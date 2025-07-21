'use client'

import { useTranslation } from 'react-i18next'
import { Button, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const languages = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' },
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode)
  }

  const items: MenuProps['items'] = languages.map((language) => ({
    key: language.code,
    label: language.name,
    onClick: () => handleLanguageChange(language.code),
    className: i18n.language === language.code ? 'bg-accent' : '',
  }))

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <Button 
        type="text" 
        size="small" 
        icon={<GlobalOutlined />}
        className="h-8 w-8 p-0"
      />
    </Dropdown>
  )
} 