'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold gradient-text">Sapphire Mall</h3>
            <p className="text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">{t('footer.platform')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/marketplace" className="text-muted-foreground hover:text-foreground">
                  {t('nav.marketplace')}
                </Link>
              </li>
              <li>
                <Link href="/staking" className="text-muted-foreground hover:text-foreground">
                  {t('nav.staking')}
                </Link>
              </li>
              <li>
                <Link href="/dao" className="text-muted-foreground hover:text-foreground">
                  {t('nav.dao')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">{t('footer.support')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground">
                  {t('footer.help')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  {t('footer.faq')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">{t('footer.legal')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Sapphire Mall. {t('footer.rights')}
            </p>
            <div className="flex space-x-4 text-sm text-muted-foreground">
              <Link href="/twitter" className="hover:text-foreground">Twitter</Link>
              <Link href="/discord" className="hover:text-foreground">Discord</Link>
              <Link href="/telegram" className="hover:text-foreground">Telegram</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 