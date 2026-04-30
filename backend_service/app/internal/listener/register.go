package listener

import "sapphire-mall/app/internal/svc"

// 在此维护监听器注册清单，统一由 ServiceContext.StartListeners 启动
func init() {
	//svc.RegisterListener(StartMerchantDepositListener)
	svc.RegisterListener(StartPlatformConfigListener)
}
