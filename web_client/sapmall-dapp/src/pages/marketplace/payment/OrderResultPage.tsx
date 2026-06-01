import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';
import { getPaymentChainLabel, getTxExplorerUrl } from '../../../config/paymentChains';
import { formatUsdcDisplay } from './utils/formatPaymentAmount';
import PaymentGlassCard from './components/PaymentGlassCard';
import { redirectToAdmin } from '../../../utils/redirectToAdmin';
import { navigateToMarketplace } from '../paths';

interface ResultLocationState {
  txHash?: string;
  amount?: number;
  chainId?: number;
}

const OrderResultPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { orderCode: orderCodeParam } = useParams<{ orderCode: string }>();
  const location = useLocation();
  const state = (location.state || {}) as ResultLocationState;

  const orderCode = orderCodeParam ? decodeURIComponent(orderCodeParam) : '';
  const explorer =
    state.txHash && state.chainId ? getTxExplorerUrl(state.chainId, state.txHash) : undefined;

  return (
    <div className="mx-auto w-[95%] max-w-2xl py-12 md:py-16">
      <Result
        icon={<CheckCircle2 className="text-emerald-400 mx-auto" size={72} strokeWidth={1.5} />}
        title={<span className="text-white">{t('payment.result.successTitle')}</span>}
        subTitle={<span className="text-slate-400">{t('payment.result.successDesc')}</span>}
        extra={
          <div className="w-full max-w-md mx-auto space-y-4">
            <PaymentGlassCard className="p-5 text-left">
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">{t('payment.result.orderCode')}</dt>
                  <dd className="text-slate-100 font-mono text-xs break-all text-right">{orderCode}</dd>
                </div>
                {state.amount != null ? (
                  <div className="flex justify-between">
                    <dt className="text-slate-400">{t('payment.result.paidAmount')}</dt>
                    <dd className="text-orange-400 font-medium">{formatUsdcDisplay(state.amount)}</dd>
                  </div>
                ) : null}
                {state.chainId ? (
                  <div className="flex justify-between">
                    <dt className="text-slate-400">{t('payment.result.network')}</dt>
                    <dd className="text-slate-200">{getPaymentChainLabel(state.chainId)}</dd>
                  </div>
                ) : null}
                {state.txHash ? (
                  <div>
                    <dt className="text-slate-400 mb-1">{t('payment.result.txHash')}</dt>
                    <dd className="text-slate-300 font-mono text-xs break-all">{state.txHash}</dd>
                    {explorer ? (
                      <a
                        href={explorer}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-xs text-sky-400 hover:text-sky-300 underline"
                      >
                        {t('payment.result.viewExplorer')}
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </dl>
              <p className="mt-4 text-xs text-slate-500 leading-relaxed border-t border-slate-600/30 pt-4">
                {t('payment.result.deliveryNotice')}
              </p>
            </PaymentGlassCard>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button type="primary" size="large" onClick={() => navigateToMarketplace(navigate)}>
                {t('payment.result.continueShopping')}
              </Button>
              <Button size="large" onClick={() => redirectToAdmin('orders')}>
                {t('payment.result.viewOrders')}
              </Button>
            </div>
            <p className="text-center text-xs text-slate-500">
              <Link to="/help" className="text-slate-400 hover:text-slate-300 underline">
                {t('payment.result.helpLink')}
              </Link>
            </p>
          </div>
        }
      />
    </div>
  );
};

export default OrderResultPage;
