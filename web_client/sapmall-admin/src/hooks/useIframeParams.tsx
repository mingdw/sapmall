import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { useCategoryStore } from '../store/categoryStore';
import { IframeParams } from '../types';

/**
 * 处理iframe参数的Hook
 * 用于从dapp传递的用户参数中设置用户状态
 */
export const useIframeParams = (iframeParams?: IframeParams) => {
  const { setUserFromIframe, getCurrentUser, isUserLoggedIn, hasPermission } = useUserStore();
  const { clearCache } = useCategoryStore();

  useEffect(() => {
    if (iframeParams) {
      // 检查是否是新的用户
      const currentUser = getCurrentUser();
      const isNewUser = !currentUser || currentUser.userId !== iframeParams.userId;
      
      // 将token存储到localStorage（如果存在）
      if (iframeParams.userToken) {
        localStorage.setItem('auth_token', iframeParams.userToken);
        console.log('Token已保存到localStorage');
      }
      
      // 如果是新用户，清除之前的菜单缓存
      if (isNewUser) {
        console.log('检测到新用户，清除菜单缓存');
        clearCache();
        localStorage.removeItem('cached_menu_user_id');
      }
      
      // 从iframe参数设置用户信息
      setUserFromIframe(iframeParams);
      console.log('从iframe设置用户信息:', iframeParams);
      
      // 注意：商品目录的初始化已在 App.tsx 中处理，这里不需要重复调用
      // 如果 App.tsx 中的初始化失败，这里可以作为备用（但通常不需要）
    }
  }, [iframeParams, setUserFromIframe, getCurrentUser, clearCache]);

  return {
    currentUser: getCurrentUser(),
    isLoggedIn: isUserLoggedIn(),
    hasPermission,
    // 便捷方法
    isAdmin: () => hasPermission('admin'),
    isMerchant: () => hasPermission('merchant'),
    isUser: () => hasPermission('user'),
  };
};
