/** Marketplace payment page copy (en) */
const paymentPage = {
  payment: {
    title: 'Confirm order',
    subtitle:
      'Review your item and total. Pricing is calculated server-side; checkout settles in USDC on-chain.',
    loading: 'Loading order preview…',
    breadcrumb: {
      mall: 'Marketplace',
      product: 'Product',
      checkout: 'Checkout',
    },
    steps: {
      aria: 'Payment progress',
      confirm: 'Review item',
      create: 'Create order',
      approve: 'Approve USDC',
      pay: 'Pay in wallet',
      confirming: 'On-chain confirm',
    },
    summary: {
      title: 'Order item',
      noImage: 'No image',
      unitPrice: 'Unit price',
      quantity: 'Qty',
      subtotal: 'Subtotal',
      deliveryHint:
        'Digital goods are delivered after on-chain payment is confirmed. See product details for specifics.',
    },
    contact: {
      title: 'Delivery contact (reserved)',
      comingSoon: 'Coming soon',
      hint: 'Email and phone will be used for automated delivery notifications. Not submitted in this release.',
      email: 'Email',
      emailPlaceholder: 'name@example.com',
      phone: 'Phone',
      phonePlaceholder: '+1 555 000 0000',
    },
    pay: {
      title: 'Payment summary',
      subtotal: 'Items',
      total: 'Total due',
      network: 'Network',
      balance: 'USDC balance',
      balanceUnavailable: 'Unavailable on this network',
      switchNetworkManual:
        'Switch to Linea Sepolia or Arc Testnet in the header wallet menu before paying.',
      connectWallet: 'Connect your wallet first',
      button: 'Pay with USDC',
      buttonBusy: {
        submitting: 'Creating order…',
        intentLoading: 'Preparing payment…',
        approving: 'Approve USDC in wallet…',
        paying: 'Confirm payment in wallet…',
        confirming: 'Waiting for confirmations…',
      },
      legalHint:
        'By paying you agree to our digital goods terms. Success is determined by on-chain events (6 confirmations).',
    },
    status: {
      creatingOrder: 'Creating your order…',
      preparingIntent: 'Generating payment intent…',
      approving: 'Waiting for USDC approval…',
      paying: 'Waiting for payment signature…',
      confirming: 'Transaction submitted—waiting for block confirmations…',
      success: 'Payment confirmed',
      error: 'Payment not completed',
      txHash: 'Transaction',
      viewExplorer: 'View on explorer',
      expireHint: 'Complete payment before {{time}}',
    },
    errors: {
      invalidParams: 'Invalid link. Please start checkout from the product page again.',
      previewFailed: 'Could not load order preview',
      walletNotConnected: 'Connect your wallet first',
      wrongNetwork: 'Wrong network—switch manually to a supported payment network',
      paymentFailed: 'Payment failed. Please try again.',
    },
    actions: {
      retry: 'Retry',
      backToMall: 'Back to marketplace',
    },
    result: {
      successTitle: 'Payment successful',
      successDesc: 'Thank you! Your order is being fulfilled.',
      orderCode: 'Order ID',
      paidAmount: 'Amount paid',
      network: 'Network',
      txHash: 'Transaction',
      viewExplorer: 'View on explorer',
      deliveryNotice:
        'Digital entitlements will be delivered after confirmation. View progress in Orders. Contact fields will support auto-delivery when enabled.',
      continueShopping: 'Continue shopping',
      viewOrders: 'View orders',
      helpLink: 'Need help? Visit Help Center',
    },
  },
};

export default paymentPage;
