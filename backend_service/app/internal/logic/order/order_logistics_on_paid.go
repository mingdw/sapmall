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
// 业务约定（Phase 1 虚拟商品）：
//   - delivery_type 固定为 4（虚拟发货）
//   - sys_order.order_status 更新为 40（待发货）
//   - send_id / send_code 取自 sys_product_spu 卖家
//   - platform_tracking_no 格式：LG + orderCode
//   - 省市区/街道/详细地址暂不写入（虚拟物品无需实体配送地址）
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

	deliveryRepo := repository.NewOrderDeliveryAddressRepository(db)
	deliveryRow, _ := deliveryRepo.GetByOrderID(ctx, orderID)

	spuRepo := repository.NewProductSpuRepository(repository.NewRepository(db))
	var spuRow *model.ProductSpu
	if orderRow.SpuId > 0 {
		spuRow, _ = spuRepo.GetProductSpu(ctx, orderRow.SpuId)
	}

	row := buildPendingLogisticsRow(orderRow, deliveryRow, spuRow, operator)
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
	deliveryRow *model.OrderDeliveryAddress,
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

	if deliveryRow != nil {
		row.ReceiverName = deliveryRow.ReceiverName
		row.ReceiverPhone = deliveryRow.ReceiverPhone
		row.ReceiverEmail = deliveryRow.ReceiverEmail
	}

	if spuRow != nil {
		row.SendId = spuRow.UserID
		row.SendCode = spuRow.UserCode
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
