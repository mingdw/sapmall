'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { WalletConnectButton } from '@/components/web3/WalletConnectButton'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { MobileMenu } from '@/components/ui/MobileMenu'

export function Header() {
  const { t } = useTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl gradient-text">Sapphire Mall</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6 text-sm font-medium hidden md:flex">
            <Link href="/marketplace" className="transition-colors hover:text-foreground/80">
              {t('nav.marketplace')}
            </Link>
            <Link href="/staking" className="transition-colors hover:text-foreground/80">
              {t('nav.staking')}
            </Link>
            <Link href="/dao" className="transition-colors hover:text-foreground/80">
              {t('nav.dao')}
            </Link>
            <Link href="/about" className="transition-colors hover:text-foreground/80">
              {t('nav.about')}
            </Link>
          </nav>
          
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <WalletConnectButton />
            <MobileMenu 
              isOpen={isMobileMenuOpen}
              onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>
      </div>
    </header>
  )
} 