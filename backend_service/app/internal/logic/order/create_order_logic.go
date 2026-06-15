// Code scaffolded by goctl. Safe to edit.
// goctl 1.9.2

package order

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"sapphire-mall/app/internal/customererrors"
	"sapphire-mall/app/internal/model"
	"sapphire-mall/app/internal/repository"
	"sapphire-mall/app/internal/svc"
	"sapphire-mall/app/internal/types"
	"sapphire-mall/app/internal/user"

	"github.com/zeromicro/go-zero/core/logx"
	"gorm.io/gorm"
)

type CreateOrderLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// 创建待支付订单并生成支付 intent。请求：CreateOrderReq；响应 Data：CreateOrderResp { order, payment, promotions }
func NewCreateOrderLogic(ctx context.Context, svcCtx *svc.ServiceContext) *CreateOrderLogic {
	return &CreateOrderLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

type paymentChainConfig struct {
	ChainID       int64
	RouterAddress string
	TokenSymbol   string
	TokenAddress  string
	TokenDecimals int
}

type productSnapshot struct {
	SpuId         int64
	SpuCode       string
	SkuId         int64
	SkuCode       string
	ProductName   string
	ProductPrice  float64
	ProductTotal  float64
	ProductRemark string
}

// createOrderValidated 校验通过后携带的上下文，供组装与落库使用
type createOrderValidated struct {
	userInfo     *model.User
	payerAddress string
	sku          *model.ProductSku
	productSnap  productSnapshot
	chainCfg     *paymentChainConfig
	currency     string
	orderCode    string
	intentID     string
	amountRaw    string
	expireAt     time.Time
	operator     string
}

// createOrderBundle 待入库实体及响应所需数据
type createOrderBundle struct {
	order      *model.Order
	payment    *model.OrderPayment
	promotions []model.OrderPromotion
	delivery   *model.OrderDeliveryAddress
	promoReq   []types.OrderPromotionItem
}

func (l *CreateOrderLogic) CreateOrder(req *types.CreateOrderReq) (resp *types.BaseResp, err error) {
	if errMsg := validateCreateOrderParams(req); errMsg != "" {
		return customererrors.ParamErrorResp(errMsg), nil
	}

	userInfo, authErr := user.AuthUserInfo(l.ctx, l.svcCtx.GormDB)
	if authErr != nil {
		if errors.Is(authErr, user.ErrUserNotLoggedIn) || errors.Is(authErr, user.ErrUserNotFound) {
			return customererrors.AuthFailedResp("请先登录"), nil
		}
		return customererrors.AuthFailedResp("获取用户信息失败"), nil
	}

	releaseLock, failResp := l.acquireCreateOrderLock(userInfo.ID, req.SkuId)
	if failResp != nil {
		return failResp, nil
	}
	defer releaseLock()

	validated, failResp := l.validateCreateOrderAfterAuth(req, userInfo)
	if failResp != nil {
		return failResp, nil
	}

	bundle := l.assembleCreateOrderBundle(req, validated)

	if failResp := l.persistCreateOrder(bundle); failResp != nil {
		return failResp, nil
	}

	return customererrors.SuccessData(l.buildCreateOrderResp(bundle)), nil
}

// validateCreateOrderAfterAuth 在已鉴权且已加锁后完成业务校验
func (l *CreateOrderLogic) validateCreateOrderAfterAuth(req *types.CreateOrderReq, userInfo *model.User) (*createOrderValidated, *types.BaseResp) {
	payerAddress, ok := normalizePayerAddress(req.PayerAddress)
	if !ok {
		return nil, customererrors.ParamErrorResp("付款钱包地址无效")
	}

	skuRepo := repository.NewProductSkuRepository(repository.NewRepository(l.svcCtx.GormDB))
	sku, skuErr := skuRepo.GetProductSku(l.ctx, req.SkuId)
	if skuErr != nil {
		if errors.Is(skuErr, gorm.ErrRecordNotFound) {
			return nil, customererrors.ParamErrorResp("商品 SKU 不存在")
		}
		l.Errorf("get product sku failed, skuId=%d, err=%v", req.SkuId, skuErr)
		return nil, customererrors.DatabaseErrorResp("查询商品失败")
	}
	if sku.IsDeleted != 0 {
		return nil, customererrors.ParamErrorResp("商品已下架")
	}
	if sku.Stock < int(req.Quantity) {
		return nil, customererrors.ParamErrorResp("商品库存不足")
	}

	chainID := req.ChainId
	if chainID <= 0 {
		chainID = defaultChainID
	}
	tokenSymbol := strings.TrimSpace(req.TokenSymbol)
	if tokenSymbol == "" {
		tokenSymbol = defaultTokenSymbol
	}

	chainCfg, cfgErr := l.resolvePaymentChainConfig(int(chainID), tokenSymbol)
	if cfgErr != nil {
		return nil, customererrors.ParamErrorResp(cfgErr.Error())
	}

	orderCode := generateOrderCode()
	if !validateOrderCodeLength(orderCode) {
		return nil, customererrors.FailMsg("生成订单号失败")
	}

	amountRaw := payAmountToAmountRaw(req.PayAmount, chainCfg.TokenDecimals)
	if amountRaw == "0" {
		return nil, customererrors.ParamErrorResp("实付金额无效")
	}

	currency := strings.TrimSpace(req.Currency)
	if currency == "" {
		currency = defaultCurrency
	}

	now := time.Now()
	expireMins := resolveExpireMins(l.svcCtx.Config.MerchantDeposit.IntentExpireMins)

	operator := userInfo.UserCode
	if operator == "" {
		operator = fmt.Sprintf("user_%d", userInfo.ID)
	}

	return &createOrderValidated{
		userInfo:     userInfo,
		payerAddress: payerAddress,
		sku:          sku,
		productSnap:  l.buildProductSnapshot(req, sku),
		chainCfg:     chainCfg,
		currency:     currency,
		orderCode:    orderCode,
		intentID:     generateIntentID(),
		amountRaw:    amountRaw,
		expireAt:     orderExpireAt(now, expireMins),
		operator:     operator,
	}, nil
}

func validateCreateOrderParams(req *types.CreateOrderReq) string {
	if req.SkuId <= 0 {
		return "skuId 无效"
	}
	if req.Quantity <= 0 {
		return "购买数量须大于 0"
	}
	if strings.TrimSpace(req.PayerAddress) == "" {
		return "付款钱包地址不能为空"
	}
	if req.PayAmount <= 0 {
		return "实付金额须大于 0"
	}
	if req.PayableAmount < 0 || req.PromotionDiscountAmount < 0 ||
		req.PlatformFeeAmount < 0 || req.EstimatedGasFee < 0 {
		return "金额字段不能为负数"
	}
	return ""
}

// assembleCreateOrderBundle 组装待入库实体
func (l *CreateOrderLogic) assembleCreateOrderBundle(req *types.CreateOrderReq, v *createOrderValidated) *createOrderBundle {
	snap := v.productSnap
	now := time.Now()

	orderRow := &model.Order{
		OrderCode:               v.orderCode,
		UserId:                  v.userInfo.ID,
		UserCode:                v.userInfo.UserCode,
		SpuId:                   snap.SpuId,
		SpuCode:                 snap.SpuCode,
		SkuId:                   snap.SkuId,
		SkuCode:                 snap.SkuCode,
		ProductName:             snap.ProductName,
		ProductPrice:            snap.ProductPrice,
		ProductQuantity:         int(req.Quantity),
		ProductTotal:            snap.ProductTotal,
		ProductRemark:           snap.ProductRemark,
		OrderStatus:             orderStatusPendingPay,
		OrderStatusDesc:         orderStatusDescPendingPay,
		PaymentStatus:           paymentStatusUnpaid,
		PaymentStatusDesc:       paymentStatusDescUnpaid,
		OrderDate:               now,
		Currency:                v.currency,
		SaleSubtotal:            req.SaleSubtotal,
		PromotionDiscountAmount: req.PromotionDiscountAmount,
		PayableAmount:           req.PayableAmount,
		PlatformFeeAmount:       req.PlatformFeeAmount,
		EstimatedGasFee:         req.EstimatedGasFee,
		PayAmount:               req.PayAmount,
		OrderRemark:             strings.TrimSpace(req.OrderRemark),
		ExpireAt:                v.expireAt,
		IsDeleted:               0,
		Creator:                 v.operator,
		Updator:                 v.operator,
	}

	paymentRow := &model.OrderPayment{
		OrderCode:             v.orderCode,
		IntentId:              v.intentID,
		PayerAddress:          v.payerAddress,
		ChainId:               v.chainCfg.ChainID,
		TokenSymbol:           v.chainCfg.TokenSymbol,
		TokenAddress:          v.chainCfg.TokenAddress,
		ContractAddress:       v.chainCfg.RouterAddress,
		AmountRaw:             v.amountRaw,
		TokenDecimals:         v.chainCfg.TokenDecimals,
		PayAmount:             req.PayAmount,
		PaymentStatus:         paymentStatusUnpaid,
		PaymentStatusDesc:     paymentStatusDescUnpaid,
		RequiredConfirmations: defaultConfirmations,
		ExpireAt:              v.expireAt,
		IsDeleted:             0,
		Creator:               v.operator,
		Updator:               v.operator,
	}

	return &createOrderBundle{
		order:      orderRow,
		payment:    paymentRow,
		promotions: l.buildPromotionRows(req.Promotions, v.orderCode, v.operator),
		delivery:   l.buildDeliveryRow(req.Delivery, v.userInfo, v.orderCode, v.operator),
		promoReq:   req.Promotions,
	}
}

// persistCreateOrder 事务写入订单主表、支付记录及关联子表
func (l *CreateOrderLogic) persistCreateOrder(bundle *createOrderBundle) *types.BaseResp {
	txErr := l.svcCtx.GormDB.WithContext(l.ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(bundle.order).Error; err != nil {
			return err
		}
		bundle.payment.OrderId = bundle.order.ID
		if err := tx.Create(bundle.payment).Error; err != nil {
			return err
		}
		for i := range bundle.promotions {
			bundle.promotions[i].OrderId = bundle.order.ID
			if err := tx.Create(&bundle.promotions[i]).Error; err != nil {
				return err
			}
		}
		if bundle.delivery != nil {
			bundle.delivery.OrderId = bundle.order.ID
			if err := tx.Create(bundle.delivery).Error; err != nil {
				return err
			}
		}
		return nil
	})
	if txErr != nil {
		l.Errorf("create order transaction failed, err=%v", txErr)
		return customererrors.DatabaseErrorResp("创建订单失败")
	}
	return nil
}

// buildCreateOrderResp 构建 API 响应
func (l *CreateOrderLogic) buildCreateOrderResp(bundle *createOrderBundle) types.CreateOrderResp {
	return types.CreateOrderResp{
		Order:      toOrderInfo(bundle.order),
		Payment:    toOrderPaymentInfo(bundle.payment),
		Promotions: toPromotionItemsFromReq(bundle.promoReq),
	}
}

func (l *CreateOrderLogic) buildProductSnapshot(req *types.CreateOrderReq, sku *model.ProductSku) productSnapshot {
	snap := productSnapshot{
		SpuId:        sku.ProductSpuID,
		SpuCode:      sku.ProductSpuCode,
		SkuId:        sku.ID,
		SkuCode:      sku.SkuCode,
		ProductName:  sku.Title,
		ProductPrice: sku.Price,
	}
	if strings.TrimSpace(req.SpuCode) != "" {
		snap.SpuCode = strings.TrimSpace(req.SpuCode)
	}
	if req.SpuId > 0 {
		snap.SpuId = req.SpuId
	}
	if strings.TrimSpace(req.SkuCode) != "" {
		snap.SkuCode = strings.TrimSpace(req.SkuCode)
	}
	if strings.TrimSpace(req.ProductName) != "" {
		snap.ProductName = strings.TrimSpace(req.ProductName)
	}
	if req.ProductPrice > 0 {
		snap.ProductPrice = req.ProductPrice
	}
	if req.ProductTotal > 0 {
		snap.ProductTotal = req.ProductTotal
	} else {
		snap.ProductTotal = snap.ProductPrice * float64(req.Quantity)
	}
	snap.ProductRemark = strings.TrimSpace(req.ProductRemark)
	return snap
}

func (l *CreateOrderLogic) resolvePaymentChainConfig(chainID int, tokenSymbol string) (*paymentChainConfig, error) {
	networkRepo := repository.NewChain_networkRepository(l.svcCtx.GormDB)
	network, err := networkRepo.GetByChainId(l.ctx, chainID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("链 ID=%d 未配置", chainID)
		}
		return nil, fmt.Errorf("查询链配置失败")
	}
	if network.Status != 0 {
		return nil, fmt.Errorf("链 %s 未启用", network.Name)
	}
	router := strings.TrimSpace(network.PaymentRouterAddress)
	if router == "" || !commonIsHexAddress(router) {
		return nil, fmt.Errorf("链 %s 未配置 PaymentRouter 地址", network.Name)
	}

	tokenRepo := repository.NewChain_payment_tokenRepository(l.svcCtx.GormDB)
	token, tokenErr := tokenRepo.GetEnabledByChainIdAndSymbol(l.ctx, chainID, tokenSymbol)
	if tokenErr != nil {
		if errors.Is(tokenErr, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("链上未配置或未启用代币 %s", tokenSymbol)
		}
		return nil, fmt.Errorf("查询支付代币失败")
	}
	tokenAddr := strings.TrimSpace(token.ContractAddress)
	if tokenAddr == "" || !commonIsHexAddress(tokenAddr) {
		return nil, fmt.Errorf("代币 %s 合约地址无效", tokenSymbol)
	}

	decimals := token.Decimals
	if decimals <= 0 {
		decimals = 6
	}

	return &paymentChainConfig{
		ChainID:       int64(chainID),
		RouterAddress: normalizeContractAddress(router),
		TokenSymbol:   tokenSymbol,
		TokenAddress:  normalizeContractAddress(tokenAddr),
		TokenDecimals: decimals,
	}, nil
}

func commonIsHexAddress(addr string) bool {
	_, ok := normalizePayerAddress(addr)
	return ok
}

func normalizeContractAddress(addr string) string {
	normalized, ok := normalizePayerAddress(addr)
	if !ok {
		return strings.TrimSpace(addr)
	}
	return normalized
}

func (l *CreateOrderLogic) buildPromotionRows(
	items []types.OrderPromotionItem,
	orderCode, operator string,
) []model.OrderPromotion {
	if len(items) == 0 {
		return nil
	}
	rows := make([]model.OrderPromotion, 0, len(items))
	for _, item := range items {
		rows = append(rows, model.OrderPromotion{
			OrderCode: orderCode,
			PromoId:   strings.TrimSpace(item.PromoId),
			LabelKey:  strings.TrimSpace(item.LabelKey),
			Label:     strings.TrimSpace(item.Label),
			Amount:    item.Amount,
			IsDeleted: 0,
			Creator:   operator,
			Updator:   operator,
		})
	}
	return rows
}

func (l *CreateOrderLogic) buildDeliveryRow(
	input types.OrderDeliveryInput,
	userInfo *model.User,
	orderCode, operator string,
) *model.OrderDeliveryAddress {
	name := strings.TrimSpace(input.ReceiverName)
	phone := strings.TrimSpace(input.ReceiverPhone)
	email := strings.TrimSpace(input.ReceiverEmail)
	if !hasDeliveryInput(name, phone, email) {
		return nil
	}
	return &model.OrderDeliveryAddress{
		OrderCode:     orderCode,
		UserId:        userInfo.ID,
		UserCode:      userInfo.UserCode,
		ReceiverName:  name,
		ReceiverPhone: phone,
		ReceiverEmail: email,
		IsDeleted:     0,
		Creator:       operator,
		Updator:       operator,
	}
}
