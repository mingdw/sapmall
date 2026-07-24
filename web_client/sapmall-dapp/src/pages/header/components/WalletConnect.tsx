import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'antd';
import { useConnect, useDisconnect, useAccount, useSignMessage, useSwitchChain, useChainId } from 'wagmi';
import { Copy, Wallet, RefreshCw, X, ChevronDown, User, ShoppingCart, Heart, Package, RotateCcw, Settings, LogOut, Check } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { commonApiService } from '../../../services/api/commonApiService';
import { useUserStore } from '../../../store/userStore';
import MessageUtils from '../../../utils/messageUtils';
import { userApiService } from '../../../services/api/userApiService';
import styles from './WalletConnect.module.scss';
import { UserStatus } from '../../../services/types/userTypes';
import { buildWalletUiNetworks, isWalletNetworkSwitchable, resolveCurrentWalletNetwork } from '../../../config/walletUiNetworks';
import { config } from '../../../config/wagmi';
import { useChainConfigStore } from '../../../store/chainConfigStore';
import ChainNetworkIcon from './ChainNetworkIcon';
import WalletBalancePanel from './WalletBalancePanel';
import { ARC_TESTNET_CHAIN_ID } from '../../../config/chains/arcTestnet';
import { shortenWalletAddress } from '../../dao/utils/walletAddress';
import {
  resolveWalletRoleCodes,
  WALLET_ROLE_BADGE_CLASS,
  WALLET_ROLE_I18N_KEY,
  WALLET_ROLE_ICON,
  WalletRoleCode,
} from '../utils/walletRoleUtils';
import { isChainMismatchError, isConnectorNotConnectedError } from '../../../utils/wagmiChainMismatch';
import {
  beginUserWalletDisconnect,
  endUserWalletDisconnect,
  isUserWalletDisconnecting,
} from '../../../utils/walletDisconnectGuard';
import {
  beginUserWalletChainSwitch,
  endUserWalletChainSwitch,
} from '../../../utils/walletChainSwitchGuard';
import headerControlStyles from '../HeaderControl.module.scss';
import {
  HEADER_CTRL_ICON_SIZE,
  HEADER_CTRL_ICON_STROKE,
  HEADER_CTRL_CHEVRON_SIZE,
} from '../headerControlButton';

/** 与语言无关的错误码，供静默处理分支识别 */
const WALLET_ERR_USER_REJECTED_SIGN = 'WALLET_ERR_USER_REJECTED_SIGN';
const WALLET_ERR_AUTH_REVOKED = 'WALLET_ERR_AUTH_REVOKED';

function isSilentWalletAuthMessage(message: string | undefined): boolean {
  if (!message) return false;
  return (
    message === WALLET_ERR_USER_REJECTED_SIGN ||
    message === WALLET_ERR_AUTH_REVOKED
  );
}

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect, onDisconnect }) => {
  const { t, ready } = useTranslation();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isProcessingConnection, setIsProcessingConnection] = useState(false);
  const [lastProcessedAddress, setLastProcessedAddress] = useState<string | null>(null);
  const signingRef = useRef<boolean>(false);
  const networkMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Wagmi hooks
  const { status: connectStatus, error } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const { switchChainAsync } = useSwitchChain();
  const isPending = connectStatus === 'pending';

  // Zustand store
  const { 
    user, 
    isLoggedIn,
    setUser, 
    setLoggedIn,
    setConnected,
    setStatus,
    setAuthToken,
    login,
    logout 
  } = useUserStore();

  // 同步wagmi连接状态到userStore
  useEffect(() => {
    console.log('同步连接状态到userStore:', { isConnected, address });
    setConnected(isConnected);
    setStatus(isConnected ? UserStatus.ACTIVE : UserStatus.INACTIVE);
    
    // 当钱包完全断开连接时，清理所有状态
    if (!isConnected && !address) {
      console.log('钱包完全断开，清理所有状态');
      setConnectionError(null);
      setIsConnecting(false);
      setIsDisconnecting(false);
      setIsProcessingConnection(false);
      setLastProcessedAddress(null);
      signingRef.current = false;
    }
  }, [isConnected, address, setConnected, setStatus]);

  // 监听连接状态变化
  useEffect(() => {
    console.log('连接状态变化:', { isConnected, address, isLoggedIn, isConnecting, isDisconnecting, isProcessingConnection, lastProcessedAddress });
    
    // 防止在断开连接过程中触发重新连接
    if (isDisconnecting) {
      console.log('正在断开连接中，跳过状态处理');
      return;
    }
    
    // 防止重复处理连接
    if (isConnecting || isProcessingConnection) {
      console.log('正在连接中，跳过重复处理');
      return;
    }
    
    // 防止重复处理同一个地址
    if (isConnected && address && address === lastProcessedAddress) {
      console.log('地址已处理过，跳过重复处理:', address);
      return;
    }
    
    // 只有在真正连接且有地址且未登录时才处理连接
    if (isConnected && address && !isLoggedIn) {
      console.log('开始处理钱包连接...');
      setLastProcessedAddress(address);
      handleWalletConnected(address);
    } 
    // 只有在真正断开连接且已登录时才处理断开
    else if (!isConnected && isLoggedIn && address === undefined) {
      console.log('开始处理钱包断开连接...');
      setLastProcessedAddress(null);
      handleWalletDisconnected();
    }
  }, [isConnected, address, isLoggedIn, isDisconnecting, isProcessingConnection, lastProcessedAddress]);

  // 监听钱包错误
  useEffect(() => {
    if (error) {
      console.error('钱包错误:', error);
      
      // 检查是否是授权相关错误
      const isAuthError = error.message?.includes('UnauthorizedProviderError') || 
                         error.message?.includes('not authorized') ||
                         error.message?.includes('The requested account and/or method has not been authorized') ||
                         error.message?.includes('User rejected') ||
                         error.message?.includes('rejected') ||
                         error.name === 'UserRejectedRequestError';
      
      if (isAuthError) {
        console.log('检测到授权错误，清理状态并静默处理...');
        
        // 静默清理状态，不显示错误提示
        setIsDisconnecting(true);
        logout();
        
        // 清理所有连接相关状态
        setConnectionError(null);
        setIsConnecting(false);
        setIsProcessingConnection(false);
        setLastProcessedAddress(null);
        signingRef.current = false;
        
        // 延迟重置断开状态
        setTimeout(() => {
          setIsDisconnecting(false);
        }, 1000);
        
        // 不显示错误消息，让用户重新连接
        return;
      }

      // 链 ID 不同步（如钱包在 Arc、应用缓存 Linea）——由 WagmiChainMismatchRecovery 自动恢复
      if (isChainMismatchError(error.message)) {
        console.log('检测到链 ID 不同步，等待自动同步…', error.message);
        setConnectionError(null);
        return;
      }

      if (isConnectorNotConnectedError(error.message) || isUserWalletDisconnecting()) {
        setConnectionError(null);
        return;
      }
      
      // 其他错误正常处理
      setConnectionError(error.message || t('walletConnect.connectionFailed'));
    }
  }, [error, t]);

  // 点击菜单外部关闭下拉（勿用 .relative：页面大量 relative 会导致点空白不收起）
  useEffect(() => {
    if (!showNetworkMenu && !showUserDropdown) return undefined;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        showNetworkMenu &&
        networkMenuRef.current &&
        !networkMenuRef.current.contains(target)
      ) {
        setShowNetworkMenu(false);
      }
      if (
        showUserDropdown &&
        userMenuRef.current &&
        !userMenuRef.current.contains(target)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNetworkMenu, showUserDropdown]);

  // 钱包连接成功后的处理
  const handleWalletConnected = async (walletAddress: string) => {
    if (isUserWalletDisconnecting() || isDisconnecting) {
      return;
    }
    // 防止重复调用
    if (isConnecting || isProcessingConnection || signingRef.current) {
      console.log('正在处理连接中，跳过重复调用');
      return;
    }

    try {
      setIsConnecting(true);
      setIsProcessingConnection(true);
      signingRef.current = true;
      setConnectionError(null);
      
      console.log('开始处理钱包连接，地址:', walletAddress);
      
      // 1. 获取随机数
      const nonceResponse = await commonApiService.getNonceByAddress(walletAddress);
      const nonce = nonceResponse.nonce;
      
      console.log('获取到nonce:', nonce);
      
      // 2. 使用personal_sign方法，避免Ethereum前缀
      const signature = await signMessageAsync({ 
        message: nonce
      }).catch((signError) => {
        console.error('签名失败:', signError);
        
        // 检查是否是用户拒绝签名
        if (signError.message?.includes('User rejected') || 
            signError.message?.includes('rejected') ||
            signError.name === 'UserRejectedRequestError') {
          throw new Error(WALLET_ERR_USER_REJECTED_SIGN);
        }
        
        // 检查是否是授权错误
        if (signError.message?.includes('not authorized') ||
            signError.message?.includes('The requested account and/or method has not been authorized')) {
          throw new Error(WALLET_ERR_AUTH_REVOKED);
        }
        
        throw signError;
      });
      
      console.log('签名信息:', {
        address: walletAddress,
        nonce: nonce,
        signature: signature
      });
      
      // 3. 调用登录接口
      const loginApiResponse = await commonApiService.login(walletAddress, signature);
      console.log('登陆结果:', loginApiResponse);
      if (loginApiResponse.token === '') {
        throw new Error('Not Authorized');
      }
      const userInfo = loginApiResponse.user_info;

      const completeUserInfo = {
        id: userInfo.id.toString(),
        address: userInfo.address,
        nickname: userInfo.nickname,
        avatar: userInfo.avatar,
        status: userInfo.status,
        roles: userInfo.roles,
        created_at: userInfo.created_at,
        updated_at: userInfo.updated_at,
        token: loginApiResponse.token // 将token也保存在user对象中
      };
      
      // 5. 使用login方法保存用户信息和token
      login(completeUserInfo, loginApiResponse.token);
      
      // 6. 通知父组件
      onConnect?.(walletAddress);
      
      MessageUtils.success(t('walletConnect.walletConnectSuccess'));
      
    } catch (error: any) {
      console.error('签名或登录失败:', error);

      if (isConnectorNotConnectedError(error?.message) || isUserWalletDisconnecting()) {
        setConnectionError(null);
        setIsConnecting(false);
        setIsProcessingConnection(false);
        signingRef.current = false;
        return;
      }
      
      // 检查是否是授权相关错误
      const isAuthError =
        error.message?.includes('not authorized') ||
        error.message?.includes('The requested account and/or method has not been authorized') ||
        isSilentWalletAuthMessage(error.message);
      
      if (isAuthError) {
        console.log('检测到授权错误，静默处理...');
        // 静默清理状态，不显示错误提示
        setConnectionError(null);
        setIsConnecting(false);
        setIsProcessingConnection(false);
        signingRef.current = false;
        return;
      }
      
      // 其他错误正常处理
      const errorMessage = error.message || t('walletConnect.loginFailedRetry');
      setConnectionError(errorMessage);
      MessageUtils.error(errorMessage);
    } finally {
      setIsConnecting(false);
      setIsProcessingConnection(false);
      signingRef.current = false;
    }
  };

  // 简化的钱包断开连接处理
  const handleWalletDisconnected = async () => {
    try {
      console.log('处理钱包断开连接...');
      
      // 清除本地状态
      logout();
      
      // 关闭所有弹窗和下拉菜单
      setShowUserModal(false);
      setShowUserDropdown(false);
      setShowNetworkMenu(false);
      
      // 重置所有连接相关状态
      setIsConnecting(false);
      setIsDisconnecting(false);
      setIsProcessingConnection(false);
      setConnectionError(null);
      setLastProcessedAddress(null);
      signingRef.current = false;
      
      // 通知父组件
      onDisconnect?.();
      
      console.log('钱包断开连接完成');
      
    } catch (error: any) {
      console.error('断开连接处理失败:', error);
      // 确保本地状态被清除
      logout();
      // 强制清理所有状态
      setConnectionError(null);
      setIsConnecting(false);
      setIsDisconnecting(false);
      setIsProcessingConnection(false);
    }
  };

  // 处理断开连接
  const handleDisconnect = async () => {
    beginUserWalletDisconnect();
    setIsDisconnecting(true);
    setIsConnecting(false);
    setIsProcessingConnection(false);
    setConnectionError(null);
    setLastProcessedAddress(null);
    signingRef.current = false;

    try {
      await disconnectAsync();
      await handleWalletDisconnected();
    } catch (error: unknown) {
      console.error('断开连接处理失败:', error);
      logout();
      setConnectionError(null);
      setIsConnecting(false);
      setIsProcessingConnection(false);
    } finally {
      window.setTimeout(() => {
        setIsDisconnecting(false);
        endUserWalletDisconnect();
      }, 800);
    }
  };

  // 复制地址到剪贴板
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      MessageUtils.success(t('walletConnect.addressCopied'));
    }
  };

  const chainConfigLoaded = useChainConfigStore((s) => s.loaded);
  const chainConfigList = useChainConfigStore((s) => s.chains);

  const networks = useMemo(
    () => buildWalletUiNetworks(t),
    [t, chainConfigLoaded, chainConfigList],
  );

  const currentNetwork = useMemo(
    () => resolveCurrentWalletNetwork(chainId, networks),
    [chainId, networks],
  );

  // 处理网络切换
  const handleNetworkSwitch = async (targetChainId: number) => {
    if (!isWalletNetworkSwitchable(targetChainId)) {
      MessageUtils.info(t('walletConnect.networkViewOnly'));
      return;
    }
    beginUserWalletChainSwitch();
    try {
      await switchChainAsync({
        chainId: targetChainId as (typeof config.chains)[number]['id'],
      });
      setShowNetworkMenu(false);
      MessageUtils.success(t('walletConnect.networkSwitchSuccess'));
    } catch (error: any) {
      console.error('网络切换失败:', error);
      MessageUtils.error(t('walletConnect.networkSwitchFail', { message: error?.message ?? '' }));
    } finally {
      window.setTimeout(() => {
        endUserWalletChainSwitch();
      }, 1500);
    }
  };

  // 处理菜单项点击 - 跳转到admin后台并定位到对应菜单
  const handleMenuClick = ({ key }: { key: string }) => {
    const adminUrlBase = '/admin';

    const redirectToAdmin = (menu: string) => {
      const url = `${adminUrlBase}?menu=${menu}`;
      window.open(url, '_self');
    };

    switch (key) {
      case 'profile':
        redirectToAdmin('profile');
        break;
      case 'cart':
        redirectToAdmin('cart');
        break;
      case 'favorites':
        redirectToAdmin('favorites');
        break;
      case 'orders':
        redirectToAdmin('orders');
        break;
      case 'history':
        redirectToAdmin('history');
        break;
      case 'settings':
        redirectToAdmin('settings');
        break;
      case 'disconnect':
        handleDisconnect();
        break;
      default:
        break;
    }
  };


  // 渲染「连接钱包」主按钮
  const renderConnectButton = (
    onClick: () => void,
    loading = false,
    label = t('walletConnect.connectWallet'),
  ) => (
    <button
      type="button"
      className={headerControlStyles.launchBtn}
      onClick={onClick}
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? (
        <span className={headerControlStyles.launchBtnSpinner} aria-hidden />
      ) : (
        <span className={headerControlStyles.launchBtnIcon}>
          <Wallet size={HEADER_CTRL_ICON_SIZE} strokeWidth={HEADER_CTRL_ICON_STROKE} aria-hidden />
        </span>
      )}
      <span className={headerControlStyles.launchBtnLabel}>{label}</span>
    </button>
  );

  // 如果i18n还没有准备好，显示加载状态
  if (!ready) {
    return renderConnectButton(() => undefined, true, t('common.loading'));
  }

  // 如果未连接，显示连接按钮
  if (!isConnected) {
    return (
      <ConnectButton.Custom>
        {({ openConnectModal, mounted }) => {
          const ready = mounted;
          
          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {renderConnectButton(openConnectModal, isPending || isConnecting)}
            </div>
          );
        }}
      </ConnectButton.Custom>
    );
  }

  // 如果已连接但未登录，显示连接中状态
  if (isConnected && !isLoggedIn) {
    // 如果有连接错误，显示重试按钮
    if (connectionError) {
      return (
        <div className={headerControlStyles.headerControlActions}>
          <button
            type="button"
            className={headerControlStyles.launchBtn}
            onClick={() => handleWalletConnected(address!)}
          >
            <span className={headerControlStyles.launchBtnIcon}>
              <RefreshCw size={HEADER_CTRL_ICON_SIZE} strokeWidth={HEADER_CTRL_ICON_STROKE} aria-hidden />
            </span>
            <span className={headerControlStyles.launchBtnLabel}>{t('walletConnect.retryConnect')}</span>
          </button>
          <button
            type="button"
            className={headerControlStyles.langTrigger}
            onClick={() => handleDisconnect()}
          >
            <X size={HEADER_CTRL_ICON_SIZE} strokeWidth={HEADER_CTRL_ICON_STROKE} aria-hidden />
            <span>{t('common.cancel')}</span>
          </button>
        </div>
      );
    }
    
    // 如果正在处理连接，显示加载状态
    if (isProcessingConnection) {
      return renderConnectButton(() => undefined, true, t('walletConnect.connecting'));
    }
    
    // 如果钱包已连接但用户未登录，且不在处理中，显示连接钱包按钮
    return (
      <ConnectButton.Custom>
        {({ openConnectModal, mounted }) => {
          const ready = mounted;
          
          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {renderConnectButton(openConnectModal, isPending || isConnecting)}
            </div>
          );
        }}
      </ConnectButton.Custom>
    );
  }

  const walletAddress = address as `0x${string}` | undefined;
  const identityRoleCodes = resolveWalletRoleCodes(user?.roles);

  const renderRoleIcons = (size: 'sm' | 'md' = 'sm') => (
    <div className={styles.roleIconGroup} aria-label={t('walletConnect.userType')}>
      {identityRoleCodes.map((roleCode: WalletRoleCode) => (
        <span
          key={roleCode}
          className={`${styles.roleIconBadge} ${styles[`roleIconBadge${size === 'md' ? 'Md' : 'Sm'}`]} ${styles[WALLET_ROLE_BADGE_CLASS[roleCode]]}`}
          title={t(WALLET_ROLE_I18N_KEY[roleCode])}
          aria-label={t(WALLET_ROLE_I18N_KEY[roleCode])}
        >
          {(() => { const RoleIcon = WALLET_ROLE_ICON[roleCode]; return <RoleIcon size={14} aria-hidden="true" />; })()}
        </span>
      ))}
    </div>
  );

  // 如果已连接，显示用户信息区域（完全按照原型页面布局）
  return (
    <div className={headerControlStyles.headerControlGroup}>
      {/* 网络切换下拉 - 完全按照原型实现 */}
      <div className="relative" ref={networkMenuRef}>
        <button
          type="button"
          onClick={() => {
            setShowNetworkMenu((open) => !open);
            setShowUserDropdown(false);
          }}
          className={headerControlStyles.langTrigger}
          aria-expanded={showNetworkMenu}
          aria-haspopup="listbox"
        >
          <ChainNetworkIcon
            chainId={currentNetwork.id}
            alt={currentNetwork.name}
            className={styles.networkIcon}
          />
          <span>{currentNetwork.name}</span>
          <ChevronDown size={HEADER_CTRL_CHEVRON_SIZE} strokeWidth={HEADER_CTRL_ICON_STROKE} />
        </button>
        <div className={`${styles.dropdown} ${showNetworkMenu ? styles.show : ''} absolute right-0 top-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl min-w-[150px] z-50`}>
          <div className="py-2">
            {networks.map((network) => {
              // 与 buildWalletUiNetworks 一致：status=0 且已注册 wagmi 才可切换
              const canSwitch = network.switchable;
              return (
              <button
                key={network.id.toString()}
                type="button"
                disabled={!canSwitch}
                onClick={() => {
                  if (!canSwitch) {
                    MessageUtils.info(t('walletConnect.networkViewOnly'));
                    return;
                  }
                  handleNetworkSwitch(network.id);
                  setShowNetworkMenu(false);
                }}
                className={`flex items-center space-x-3 w-full px-4 py-2 text-sm ${
                  canSwitch
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer'
                    : 'text-gray-500 cursor-not-allowed opacity-60'
                }`}
                title={canSwitch ? undefined : t('walletConnect.networkViewOnly')}
              >
                <ChainNetworkIcon chainId={network.id} alt={network.name} className={styles.networkIcon} />
                <span>{network.name}</span>
                {!canSwitch && (
                  <span className="ml-auto text-[10px] uppercase tracking-wide text-slate-500">
                    {t('walletConnect.networkBadgeView')}
                  </span>
                )}
                {Number(network.id) === Number(chainId) && (
                  <Check size={14} className={`text-sapphire-400 ${canSwitch ? 'ml-auto' : ''}`} />
                )}
              </button>
            );
            })}
          </div>
        </div>
      </div>
      
      {/* 用户菜单 - 完全按照原型实现 */}
      <div className="relative" ref={userMenuRef}>
        <button
          type="button"
          onClick={() => {
            setShowUserDropdown((open) => !open);
            setShowNetworkMenu(false);
          }}
          className={headerControlStyles.langTrigger}
          aria-expanded={showUserDropdown}
          aria-haspopup="menu"
        >
          <User size={HEADER_CTRL_ICON_SIZE} strokeWidth={HEADER_CTRL_ICON_STROKE} aria-hidden />
          <span>
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : t('walletConnect.unknownAddress')}
          </span>
          <ChevronDown size={HEADER_CTRL_CHEVRON_SIZE} strokeWidth={HEADER_CTRL_ICON_STROKE} />
        </button>
        <div
          className={`${styles.dropdown} ${styles.userDropdownPanel} ${showUserDropdown ? styles.show : ''} ${styles.userDropdownShell}`}
        >
          <div className={styles.userDropdownHeader}>
            <div className={styles.userDropdownTitleRow}>
              <div className={styles.userDropdownTitleMain}>
                <h3
                  className={styles.userDropdownAddress}
                  title={address ?? undefined}
                >
                  {address
                    ? shortenWalletAddress(address)
                    : t('walletConnect.unknownAddress')}
                </h3>
                {address ? (
                  <button
                    type="button"
                    className={styles.addressCopyBtn}
                    onClick={copyAddress}
                    aria-label={t('walletConnect.copyAddress')}
                  >
                    <Copy size={14} strokeWidth={2} aria-hidden />
                  </button>
                ) : null}
              </div>
              {renderRoleIcons('sm')}
            </div>
          </div>

          <div className={styles.userDropdownBody}>
            <WalletBalancePanel
              chainId={chainId}
              address={walletAddress}
              variant="compact"
            />
          </div>

          <div className={styles.userDropdownMenu}>
            <button
              type="button"
              onClick={() => {
                handleMenuClick({ key: 'profile' });
                setShowUserDropdown(false);
              }}
              className={styles.userMenuBtn}
              data-menu="profile"
            >
              <User size={16} />
              <span>{t('user.profile')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleMenuClick({ key: 'cart' });
                setShowUserDropdown(false);
              }}
              className={`${styles.userMenuBtn} ${styles.userMenuBtnWithBadge}`}
              data-menu="cart"
            >
              <span className={styles.userMenuBtnMain}>
                <ShoppingCart size={16} />
                <span>{t('user.cart')}</span>
              </span>
              <span className={`${styles.userMenuBadge} ${styles.userMenuBadgeRed}`}>3</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleMenuClick({ key: 'favorites' });
                setShowUserDropdown(false);
              }}
              className={`${styles.userMenuBtn} ${styles.userMenuBtnWithBadge}`}
              data-menu="favorites"
            >
              <span className={styles.userMenuBtnMain}>
                <Heart size={16} />
                <span>{t('user.favorites')}</span>
              </span>
              <span className={`${styles.userMenuBadge} ${styles.userMenuBadgePink}`}>8</span>
            </button>

            <div className={styles.userMenuDivider} role="separator" />

            <button
              type="button"
              onClick={() => {
                handleMenuClick({ key: 'orders' });
                setShowUserDropdown(false);
              }}
              className={styles.userMenuBtn}
              data-menu="orders"
            >
              <Package size={16} />
              <span>{t('user.orders')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleMenuClick({ key: 'history' });
                setShowUserDropdown(false);
              }}
              className={styles.userMenuBtn}
              data-menu="history"
            >
              <RotateCcw size={16} />
              <span>{t('user.history')}</span>
            </button>

            <div className={styles.userMenuDivider} role="separator" />

            <button
              type="button"
              onClick={() => {
                handleMenuClick({ key: 'settings' });
                setShowUserDropdown(false);
              }}
              className={styles.userMenuBtn}
              data-menu="settings"
            >
              <Settings size={16} />
              <span>{t('user.settings')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleMenuClick({ key: 'disconnect' });
                setShowUserDropdown(false);
              }}
              className={`${styles.userMenuBtn} ${styles.userMenuBtnDanger}`}
              data-menu="disconnect"
            >
              <LogOut size={16} />
              <span>{t('user.disconnect')}</span>
            </button>
          </div>
        </div>
      </div>

      <Modal
        title={null}
        open={showUserModal}
        onCancel={() => setShowUserModal(false)}
        footer={null}
        width={440}
        centered
        className={styles.userModal}
        destroyOnClose
      >
        <div className={styles.modalBody}>
          <div className={styles.modalHero}>
            <div className={styles.modalAvatar} aria-hidden>
              <User size={16} />
            </div>
            <div className={styles.modalHeroText}>
              <div className={styles.modalNameRow}>
                <h3 className={styles.modalName}>
                  {user?.nickname || t('walletConnect.noNickname')}
                </h3>
                {user ? renderRoleIcons('md') : null}
              </div>
              <p className={styles.modalAddress}>{address}</p>
              {chainId === ARC_TESTNET_CHAIN_ID ? (
                <span className={styles.modalNetworkBadge}>Arc Testnet</span>
              ) : null}
            </div>
          </div>

          <WalletBalancePanel
            chainId={chainId}
            address={walletAddress}
            variant="full"
          />

          {user ? (
            <div className={styles.modalInfoCard}>
              <h4 className={styles.modalInfoTitle}>{t('walletConnect.accountInfo')}</h4>
              <dl className={styles.modalInfoList}>
                <div className={styles.modalInfoRow}>
                  <dt>{t('walletConnect.userId')}</dt>
                  <dd>{user.id}</dd>
                </div>
                <div className={styles.modalInfoRow}>
                  <dt>{t('walletConnect.accountStatus')}</dt>
                  <dd>
                    <span
                      className={
                        user.status === 1 ? styles.statusActive : styles.statusInactive
                      }
                    >
                      {t('walletConnect.statusActive')}
                    </span>
                  </dd>
                </div>
                <div className={styles.modalInfoRow}>
                  <dt>{t('walletConnect.registeredAt')}</dt>
                  <dd>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : t('walletConnect.unknown')}
                  </dd>
                </div>
              </dl>
            </div>
          ) : null}

          <div className={styles.modalActions}>
            <button type="button" className={styles.modalBtnSecondary} onClick={copyAddress}>
              <Copy size={15} strokeWidth={2.25} aria-hidden />
              {t('walletConnect.copyAddress')}
            </button>
            <button type="button" className={styles.modalBtnDanger} onClick={handleDisconnect}>
              <LogOut size={15} aria-hidden="true" />
              {t('user.disconnect')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WalletConnect;
