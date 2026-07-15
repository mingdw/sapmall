package order

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"

	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

// 发货类型（sys_order_logistics.delivery_type）
const (
	DeliveryTypeExpress   = 1 // 普通快递
	DeliveryTypeSameCity  = 2 // 同城配送
	DeliveryTypePickup    = 3 // 自提
	DeliveryTypeVirtual   = 4 // 虚拟发货
)

// 物流状态（sys_order_logistics.logistics_status）
const (
	LogisticsStatusPendingShip = 0 // 待发货
	LogisticsStatusShipped     = 1 // 已发货
	LogisticsStatusInTransit   = 2 // 运输中
	LogisticsStatusDelivering  = 3 // 派件中
	LogisticsStatusSigned      = 4 // 已签收
	LogisticsStatusRejected    = 5 // 已拒收
)

// 物流异常状态（sys_order_logistics.exception_status）
const (
	LogisticsExceptionNormal       = 0 // 正常
	LogisticsExceptionLogistics    = 1 // 物流异常
	LogisticsExceptionSign         = 2 // 签收异常
	LogisticsExceptionReturning    = 3 // 退货中
)

// EnsurePendingLogisticsOnPaid 链上支付确认成功后创建待发货物流单（幂等）。
//
// 业务约定：
//   - 用户确认/创建订单时不写物流单；仅在支付成功后生成
//   - Phase 1 虚拟商品：delivery_type=4，logistics_status=待发货
//   - seller_id / seller_code 优先取订单卖家快照，缺失时回退 SPU
//   - platform_tracking_no 格式：LG + orderCode
func EnsurePendingLogisticsOnPaid(ctx context.Context, db *gorm.DB, orderID int64, operator string) error {
	if orderID <= 0 {
		return fmt.Errorf("invalid orderID: %d", orderID)
	}
	operator = strings.TrimSpace(operator)
	if operator == "" {
		operator = "system"
	}

	logisticsRepo := repository.NewOrderLogisticsRepository(db)
	if _, err := logisticsRepo.GetByOrderID(ctx, orderID); err == nil {
		return nil
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	orderRepo := repository.NewOrderRepository(db)
	orderRow, err := orderRepo.GetByID(ctx, orderID)
	if err != nil {
		return fmt.Errorf("load order: %w", err)
	}

	spuRepo := repository.NewProductSpuRepository(repository.NewRepository(db))
	var spuRow *model.ProductSpu
	if orderRow.SpuId > 0 {
		spuRow, _ = spuRepo.GetProductSpu(ctx, orderRow.SpuId)
	}

	row := buildPendingLogisticsRow(orderRow, spuRow, operator)
	if err := logisticsRepo.Create(ctx, row); err != nil {
		return fmt.Errorf("create logistics: %w", err)
	}

	logx.WithContext(ctx).Infof(
		"order logistics created: orderCode=%s logisticsNo=%s deliveryType=%d status=%d",
		row.OrderCode, row.PlatformTrackingNo, row.DeliveryType, row.LogisticsStatus,
	)
	return nil
}

func buildPendingLogisticsRow(
	orderRow *model.Order,
	spuRow *model.ProductSpu,
	operator string,
) *model.OrderLogistics {
	row := &model.OrderLogistics{
		OrderId:            orderRow.ID,
		OrderCode:          orderRow.OrderCode,
		DeliveryType:       defaultDeliveryType(spuRow),
		LogisticsStatus:    LogisticsStatusPendingShip,
		ExceptionStatus:    LogisticsExceptionNormal,
		PlatformTrackingNo: buildPlatformTrackingNo(orderRow.OrderCode),
		FreightAmount:      0,
		InsuranceAmount:    0,
		IsDeleted:          0,
		Creator:            operator,
		Updator:            operator,
	}

	var sellerId int64
	var sellerCode string
	if orderRow.SellerId != nil && *orderRow.SellerId > 0 {
		sellerId = *orderRow.SellerId
	}
	if orderRow.SellerCode != nil {
		sellerCode = strings.TrimSpace(*orderRow.SellerCode)
	}
	if sellerId <= 0 && spuRow != nil && spuRow.UserID > 0 {
		sellerId = spuRow.UserID
	}
	if sellerCode == "" && spuRow != nil {
		sellerCode = strings.TrimSpace(spuRow.UserCode)
	}
	row.SellerId = sellerId
	row.SellerCode = sellerCode

	// 从订单创单快照带入收货联系人
	row.ReceiverName = derefStr(orderRow.ReceiverName)
	row.ReceiverPhone = derefStr(orderRow.ReceiverPhone)
	if orderRow.ReceiverEmail != nil {
		row.ReceiverEmail = strings.TrimSpace(*orderRow.ReceiverEmail)
	}

	return row
}

// defaultDeliveryType Phase 1 默认虚拟发货（delivery_type=4）
func defaultDeliveryType(_ *model.ProductSpu) int {
	return DeliveryTypeVirtual
}

func buildPlatformTrackingNo(orderCode string) string {
	orderCode = strings.TrimSpace(orderCode)
	if orderCode == "" {
		return ""
	}
	return "LG" + orderCode
}
