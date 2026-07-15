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
	SkuImgs       string
	ProductName   string
	ProductPrice  float64
	TotalAmount   float64
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
	sellerId     int64
	sellerCode   string
	operator     string
}

// createOrderBundle 待入库实体及响应所需数据
type createOrderBundle struct {
	order      *model.Order
	payment    *model.OrderPayment
	promotions []model.OrderPromotion
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

	// 订单创建成功后，加入延时队列（30分钟未支付自动取消）
	l.enqueueOrderExpire(bundle.order.OrderCode, validated.expireAt)

	return customererrors.SuccessData(l.buildCreateOrderResp(bundle)), nil
}

// enqueueOrderExpire 将订单加入延时队列
func (l *CreateOrderLogic) enqueueOrderExpire(orderCode string, expireAt time.Time) {
	if l.svcCtx.OrderDelayQueue == nil {
		return
	}
	if err := l.svcCtx.OrderDelayQueue.Enqueue(l.ctx, orderCode, expireAt); err != nil {
		l.Errorf("enqueue order expire failed, orderCode=%s, err=%v", orderCode, err)
	}
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

	spuRepo := repository.NewProductSpuRepository(repository.NewRepository(l.svcCtx.GormDB))
	spu, spuErr := spuRepo.GetProductSpu(l.ctx, sku.ProductSpuID)
	if spuErr != nil {
		if errors.Is(spuErr, gorm.ErrRecordNotFound) {
			return nil, customererrors.ParamErrorResp("商品 SPU 不存在")
		}
		l.Errorf("get product spu failed, spuId=%d, err=%v", sku.ProductSpuID, spuErr)
		return nil, customererrors.DatabaseErrorResp("查询商品卖家失败")
	}
	if spu.IsDeleted != 0 {
		return nil, customererrors.ParamErrorResp("商品已下架")
	}
	if spu.UserID <= 0 {
		return nil, customererrors.ParamErrorResp("商品未绑定卖家")
	}
	sellerCode, sellerOk := normalizePayerAddress(spu.UserCode)
	if !sellerOk {
		return nil, customererrors.ParamErrorResp("商品卖家收款地址无效")
	}
	sellerId := spu.UserID

	orderCode := generateOrderCode()
	if !validateOrderCodeLength(orderCode) {
		return nil, customererrors.FailMsg("生成订单号失败")
	}

	amountRaw := payAmountToAmountRaw(req.PayAmount, chainCfg.TokenDecimals)
	if !isPositiveAmountRaw(amountRaw) {
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
		sellerId:     sellerId,
		sellerCode:   sellerCode,
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
	if req.PayableAmount < 0 || req.DiscountAmount < 0 ||
		req.PlatformFeeAmount < 0 || req.EstGasFee < 0 {
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
		SellerId:                &v.sellerId,
		SellerCode:              &v.sellerCode,
		SpuId:                   snap.SpuId,
		SpuCode:                 snap.SpuCode,
		SkuId:                   snap.SkuId,
		SkuCode:                 snap.SkuCode,
		SkuImgs:                 strings.TrimSpace(req.SkuImgs),
		ProductName:             snap.ProductName,
		ProductPrice:            snap.ProductPrice,
		ProductQuantity:         int(req.Quantity),
		TotalAmount:             snap.TotalAmount,
		ProductRemark:           snap.ProductRemark,
		OrderStatus:             orderStatusPendingPay,
		OrderStatusDesc:         orderStatusDescPendingPay,
		PaymentStatus:           paymentStatusUnpaid,
		PaymentStatusDesc:       paymentStatusDescUnpaid,
		OrderDate:               now,
		Currency:          v.currency,
		SettleCurrency:    v.chainCfg.TokenSymbol,
		DiscountAmount:    req.DiscountAmount,
		PayableAmount:     req.PayableAmount,
		PlatformFeeAmount:       req.PlatformFeeAmount,
		EstGasFee:               req.EstGasFee,
		PayAmount:               req.PayAmount,
		OrderRemark:             strings.TrimSpace(req.OrderRemark),
		ExpireAt:                v.expireAt,
		IsDeleted:               0,
		Creator:                 v.operator,
		Updator:                 v.operator,
	}
	applyOrderDeliverySnapshot(orderRow, req.Delivery)

	paymentRow := &model.OrderPayment{
		OrderCode:             v.orderCode,
		IntentId:              v.intentID,
		PayerAddress:          v.payerAddress,
		SellerId:              &v.sellerId,
		SellerCode:            &v.sellerCode,
		ChainId:               v.chainCfg.ChainID,
		TokenSymbol:           v.chainCfg.TokenSymbol,
		TokenAddress:          v.chainCfg.TokenAddress,
		ContractAddress:       v.chainCfg.RouterAddress,
		AmountRaw:             v.amountRaw,
		TokenDecimals:         v.chainCfg.TokenDecimals,
		PayAmount:             req.PayAmount,
		EstGasFee:             req.EstGasFee,
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
		promoReq:   req.Promotions,
	}
}

// persistCreateOrder 事务写入订单主表、支付记录及关联子表
func (l *CreateOrderLogic) persistCreateOrder(bundle *createOrderBundle) *types.BaseResp {
	repo := repository.NewRepository(l.svcCtx.GormDB)
	
	txErr := repo.Transaction(l.ctx, func(ctx context.Context) error {
		orderRepo := repository.NewOrderRepository(l.svcCtx.GormDB)
		if err := orderRepo.Create(ctx, bundle.order); err != nil {
			return err
		}

		bundle.payment.OrderId = bundle.order.ID
		paymentRepo := repository.NewOrderPaymentRepository(l.svcCtx.GormDB)
		if err := paymentRepo.Create(ctx, bundle.payment); err != nil {
			return err
		}

		if len(bundle.promotions) > 0 {
			promoRepo := repository.NewOrderPromotionRepository(l.svcCtx.GormDB)
			for i := range bundle.promotions {
				bundle.promotions[i].OrderId = bundle.order.ID
			}
			if err := promoRepo.CreateBatch(ctx, bundle.promotions); err != nil {
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
		SkuImgs:      strings.TrimSpace(req.SkuImgs),
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
	if req.TotalAmount > 0 {
		snap.TotalAmount = req.TotalAmount
	} else {
		snap.TotalAmount = snap.ProductPrice * float64(req.Quantity)
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

// applyOrderDeliverySnapshot 创单时把收货联系人落到订单快照；物流单待支付成功后再生成。
func applyOrderDeliverySnapshot(orderRow *model.Order, input types.OrderDeliveryInput) {
	name := strings.TrimSpace(input.ReceiverName)
	phone := strings.TrimSpace(input.ReceiverPhone)
	email := strings.TrimSpace(input.ReceiverEmail)
	if !hasDeliveryInput(name, phone, email) {
		return
	}
	if name != "" {
		orderRow.ReceiverName = &name
	}
	if phone != "" {
		orderRow.ReceiverPhone = &phone
	}
	if email != "" {
		orderRow.ReceiverEmail = &email
	}
}

