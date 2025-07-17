'use client'

import { Button } from 'antd'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'

interface MobileMenuProps {
  isOpen: boolean
  onToggle: () => void
}

export function MobileMenu({ isOpen, onToggle }: MobileMenuProps) {
  return (
    <div className="md:hidden">
      <Button
        type="text"
        size="small"
        onClick={onToggle}
        className="h-8 w-8 p-0"
        icon={isOpen ? <CloseOutlined /> : <MenuOutlined />}
      />
    </div>
  )
} 