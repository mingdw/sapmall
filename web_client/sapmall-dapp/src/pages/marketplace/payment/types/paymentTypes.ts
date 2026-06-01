export type PaymentPhase =
  | 'idle'
  | 'submitting'
  | 'intentLoading'
  | 'approving'
  | 'paying'
  | 'confirming'
  | 'success'
  | 'error';

export interface CheckoutContactDraft {
  email: string;
  phone: string;
}

export const EMPTY_CONTACT: CheckoutContactDraft = {
  email: '',
  phone: '',
};
