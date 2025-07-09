'use client'

import { useTheme } from 'next-themes'
import { Button } from 'antd'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      type="text"
      size="small"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="h-8 w-8 p-0"
      icon={theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
    />
  )
} 