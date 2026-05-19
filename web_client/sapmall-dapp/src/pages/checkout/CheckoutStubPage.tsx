import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

interface CheckoutStubState {
  productCode?: string;
  productId?: number;
  skuId?: number;
  quantity?: number;
  price?: number;
}

const CheckoutStubPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as CheckoutStubState;

  return (
    <div className="mx-auto w-[95%] max-w-2xl py-24 text-center">
      <h1 className="text-2xl font-bold text-white mb-4">{t('checkout.stubTitle')}</h1>
      <p className="text-slate-400 mb-6">{t('checkout.stubDesc')}</p>
      {state.productCode && (
        <p className="text-slate-500 text-sm mb-4">
          {state.productCode} × {state.quantity ?? 1}
        </p>
      )}
      <Button type="primary" onClick={() => navigate(-1)}>
        {t('checkout.back')}
      </Button>
    </div>
  );
};

export default CheckoutStubPage;
