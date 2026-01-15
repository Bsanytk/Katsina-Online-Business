/**
 * Payment Service - Paystack Integration
 * Handles secure payment processing for KOB (Katsina Online Business) marketplace
 * 
 * ⚠️ PAYMENT FEATURE STATUS: DISABLED FOR PRODUCTION
 * Payment processing is currently in development phase.
 * Only use in development/testing environment.
 * 
 * Environment variables required:
 * - VITE_PAYSTACK_PUBLIC_KEY (for testing only)
 * 
 * Paystack Integration Details:
 * - Ideal for Nigerian marketplace
 * - Supports: Local cards, bank transfers, USSD, mobile money
 * - Currency: Nigerian Naira (NGN)
 * - Standard fee: 1.5% + ₦100
 * 
 * @deprecated Do not use in production until fully validated
 */

/**
 * Validate payment input parameters
 * @param {string} email - Customer email
 * @param {number} amount - Payment amount in NGN
 * @param {string} productTitle - Product/order title
 * @returns {Object} - Validation result with valid flag and errors array
 */
function validatePaymentInput(email, amount, productTitle) {
  const errors = [];

  if (!email || typeof email !== 'string') {
    errors.push('Valid email address required');
  } else if (!email.includes('@')) {
    errors.push('Invalid email format');
  }

  if (typeof amount !== 'number' || amount <= 0) {
    errors.push('Amount must be a positive number');
  }

  if (!productTitle || typeof productTitle !== 'string') {
    errors.push('Product title is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Initialize payment processing with Paystack
 * 
 * @param {Object} paymentConfig - Payment configuration object
 * @param {string} paymentConfig.email - Customer email address
 * @param {number} paymentConfig.amount - Amount in NGN
 * @param {string} paymentConfig.productTitle - Product/order description
 * @param {string} paymentConfig.orderId - Unique order ID
 * @param {string} paymentConfig.customerName - Customer full name
 * @param {Function} paymentConfig.onSuccess - Success callback
 * @param {Function} paymentConfig.onError - Error callback
 * @returns {Promise<void>}
 */
export async function initializePayment({
  email,
  amount,
  productTitle,
  orderId,
  customerName,
  onSuccess,
  onError,
}) {
  try {
    // Validate input parameters
    const validation = validatePaymentInput(email, amount, productTitle);
    if (!validation.valid) {
      const errorMessage = validation.errors.join(', ');
      throw new Error(errorMessage);
    }

    // Validate amount is within acceptable range
    const MAX_TRANSACTION = 10000000; // ₦10M max per transaction
    if (amount > MAX_TRANSACTION) {
      throw new Error(`Amount exceeds maximum limit of ₦${formatCurrency(MAX_TRANSACTION)}`);
    }

    // Get Paystack public key from environment
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      console.warn('⚠️ Paystack is not configured. Payment functionality is disabled.');
      throw new Error('Payment service is not available at this time');
    }

    // Check if PaystackPop is available (loaded from CDN)
    if (typeof window.PaystackPop === 'undefined') {
      await loadPaystackScript();
    }

    // Prepare transaction reference
    const transactionRef = orderId || generateTransactionRef();

    // Initialize Paystack payment handler
    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: email,
      amount: Math.round(amount * 100), // Convert to kobo (smallest currency unit)
      currency: 'NGN',
      ref: transactionRef,
      onClose: function () {
        console.log('Payment window closed by user');
        onError?.('Payment was cancelled');
      },
      onSuccess: function (response) {
        console.log('Payment successful, verifying...');
        // Verify payment on backend (critical for security)
        verifyPayment(response.reference)
          .then(() => {
            console.log('Payment verification successful');
            onSuccess?.(response);
          })
          .catch((err) => {
            console.error('Payment verification failed:', err);
            onError?.(`Payment verification failed: ${err.message}`);
          });
      },
      metadata: {
        order_id: transactionRef,
        product_title: productTitle,
        customer_name: customerName,
        timestamp: new Date().toISOString(),
        platform: 'KOB'
      },
    });

    // Open payment modal
    handler.openIframe();

  } catch (error) {
    console.error('❌ Payment initialization failed:', error.message);
    onError?.(error.message);
  }
}

/**
 * Verify payment transaction with backend
 * 
 * SECURITY WARNING: This must communicate with backend API for verification.
 * Do NOT trust client-side verification alone.
 * 
 * Backend should:
 * 1. Verify reference with Paystack API using VITE_PAYSTACK_SECRET_KEY
 * 2. Check payment status and amount
 * 3. Update order status in database
 * 4. Return verification result to client
 * 
 * @param {string} reference - Paystack transaction reference
 * @returns {Promise<Object>} - Verification result
 */
export async function verifyPayment(reference) {
  try {
    if (!reference || typeof reference !== 'string') {
      throw new Error('Invalid transaction reference');
    }

    // TODO: In production, implement backend verification:
    // const response = await fetch('/api/verify-payment', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ reference })
    // });
    // return response.json();

    console.log('⚠️ Payment verification not fully implemented. Reference:', reference);
    
    // For development/testing only
    return { 
      success: true, 
      reference,
      warning: 'Development mode - verify with backend in production'
    };

  } catch (error) {
    console.error('❌ Payment verification error:', error.message);
    throw error;
  }
}

/**
 * Check if payment feature is enabled
 * @returns {boolean} - True if Paystack is configured
 */
export function isPaymentEnabled() {
  return !!import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
}

/**
 * Generate unique transaction reference
 * Format: KOB-TIMESTAMP-RANDOM
 * Ensures no duplicate references
 * 
 * @returns {string} - Unique transaction reference
 */
function generateTransactionRef() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `KOB-${timestamp}-${random}`;
}

/**
 * Load Paystack JavaScript SDK from CDN
 * Only loads once, subsequent calls check if already loaded
 * 
 * @returns {Promise<void>}
 */
function loadPaystackScript() {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.PaystackPop) {
      return resolve();
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => {
      console.log('✅ Paystack SDK loaded successfully');
      resolve();
    };
    script.onerror = () => {
      console.error('❌ Failed to load Paystack SDK');
      reject(new Error('Failed to load Paystack SDK from CDN'));
    };
    document.body.appendChild(script);
  });
}


/**
 * Format currency amount for display in Nigerian Naira
 * 
 * @param {number} amount - Amount in NGN
 * @returns {string} - Formatted currency string (e.g., "₦5,000.00")
 */
export function formatCurrency(amount) {
  if (typeof amount !== 'number' || amount < 0) {
    return '₦0.00';
  }
  
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format amount without currency symbol (for calculations)
 * 
 * @param {number} amount - Amount in NGN
 * @returns {string} - Formatted amount (e.g., "5,000.00")
 */
export function formatAmount(amount) {
  if (typeof amount !== 'number' || amount < 0) {
    return '0.00';
  }
  
  return new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate transaction fees for Paystack
 * 
 * Standard Paystack fee structure:
 * - Percentage: 1.5%
 * - Flat fee: ₦100
 * - Total: Amount + (Amount × 1.5%) + ₦100
 * 
 * @param {number} amount - Transaction amount in NGN
 * @returns {Object} - Fee breakdown
 *   - percentageFee: 1.5% of amount
 *   - flatFee: Fixed ₦100 fee
 *   - totalFee: Sum of all fees
 *   - total: Final amount customer pays
 */
export function calculateFees(amount) {
  if (typeof amount !== 'number' || amount <= 0) {
    return {
      percentageFee: 0,
      flatFee: 0,
      totalFee: 0,
      total: 0,
    };
  }

  const percentageFee = amount * 0.015;
  const flatFee = 100;
  const totalFee = percentageFee + flatFee;
  
  return {
    percentageFee: Math.round(percentageFee),
    flatFee,
    totalFee: Math.round(totalFee),
    total: Math.round(amount + totalFee),
  };
}

/**
 * Payment methods supported by Paystack for Nigerian users
 */
export const PAYMENT_METHODS = [
  {
    id: 'card',
    name: 'Debit/Credit Card',
    icon: '💳',
    description: 'Visa, Mastercard, Verve',
    enabled: true,
  },
  {
    id: 'ussd',
    name: 'USSD',
    icon: '📱',
    description: 'Dial *737# (Paystack) or *356# (GTBank)',
    enabled: true,
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: '🏦',
    description: 'Direct bank account transfer',
    enabled: true,
  },
  {
    id: 'mobile',
    name: 'Mobile Money',
    icon: '💰',
    description: 'MTN Mobile Money, Airtel Money, GLO',
    enabled: true,
  },
  {
    id: 'wallet',
    name: 'QR Code',
    icon: '📲',
    description: 'Scan QR code with mobile app',
    enabled: true,
  },
];

/**
 * Get payment methods by type/filter
 * 
 * @param {string} filter - Optional filter: 'enabled', 'all'
 * @returns {Array} - Filtered payment methods
 */
export function getPaymentMethods(filter = 'enabled') {
  if (filter === 'enabled') {
    return PAYMENT_METHODS.filter(m => m.enabled);
  }
  return PAYMENT_METHODS;
}

/**
 * Payment status constants for order management
 */
export const PAYMENT_STATUS = {
  PENDING: 'pending',      // Payment initiated but not completed
  SUCCESS: 'success',      // Payment verified successfully
  FAILED: 'failed',        // Payment failed/rejected
  CANCELLED: 'cancelled',  // User cancelled payment
  TIMEOUT: 'timeout',      // Payment timeout
  REFUNDED: 'refunded',    // Payment refunded
};

/**
 * Get payment status display info
 * 
 * @param {string} status - Payment status
 * @returns {Object} - Status display info
 */
export function getPaymentStatusInfo(status) {
  const statusInfo = {
    [PAYMENT_STATUS.PENDING]: {
      label: 'Payment Pending',
      color: 'yellow',
      icon: '⏳',
    },
    [PAYMENT_STATUS.SUCCESS]: {
      label: 'Payment Successful',
      color: 'green',
      icon: '✅',
    },
    [PAYMENT_STATUS.FAILED]: {
      label: 'Payment Failed',
      color: 'red',
      icon: '❌',
    },
    [PAYMENT_STATUS.CANCELLED]: {
      label: 'Payment Cancelled',
      color: 'gray',
      icon: '⏹️',
    },
    [PAYMENT_STATUS.TIMEOUT]: {
      label: 'Payment Timeout',
      color: 'orange',
      icon: '⚠️',
    },
    [PAYMENT_STATUS.REFUNDED]: {
      label: 'Payment Refunded',
      color: 'blue',
      icon: '💰',
    },
  };

  return statusInfo[status] || {
    label: 'Unknown',
    color: 'gray',
    icon: '❓',
  };
}

