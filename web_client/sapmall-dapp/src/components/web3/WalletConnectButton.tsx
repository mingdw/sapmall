'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from 'antd'
import { WalletOutlined } from '@ant-design/icons'

export function WalletConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const handleConnect = () => {
    const connector = connectors[0]
    if (connector.ready) {
      connect({ connector })
    }
  }

  const handleDisconnect = () => {
    disconnect()
  }

  if (isConnected) {
    return (
      <Button
        type="default"
        size="small"
        onClick={handleDisconnect}
        className="text-xs"
      >
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </Button>
    )
  }

  return (
    <Button
      type="primary"
      size="small"
      onClick={handleConnect}
      className="text-xs"
      icon={<WalletOutlined />}
    >
      连接钱包
    </Button>
  )
} 