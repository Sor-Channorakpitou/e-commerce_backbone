import { useState, type FormEvent } from 'react';
import { Tag, Check, AlertCircle, Loader2, X } from 'lucide-react';

export interface AppliedCoupon {
  code: string;
  discountPercentage: number;
  description: string;
}

interface DiscountCouponFormProps {
  onApplyCoupon?: (coupon: AppliedCoupon) => void;
  onRemoveCoupon?: () => void;
}

// Simulated backend API endpoint for coupon verification
export async function verifyCouponApi(code: string, email: string): Promise<AppliedCoupon> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 200));

  const cleanCode = code.trim().toUpperCase();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    throw new Error('Valid customer email is required to redeem');
  }
  if (cleanCode === 'SAVE20') {
    return {
      code: 'SAVE20',
      discountPercentage: 20,
      description: '20% discount applied to your order',
    };
  }

  if (cleanCode === 'PROMO50') {
    return {
      code: 'PROMO50',
      discountPercentage: 50,
      description: '50% VIP discount applied to your order',
    };
  }

  if (cleanCode === 'FREESHIP') {
    return {
      code: 'FREESHIP',
      discountPercentage: 100,
      description: 'Free expedited shipping applied',
    };
  }

  throw new Error(`Invalid or expired coupon code: "${code.trim()}". Try "SAVE20".`);
}

export function DiscountCouponForm({ onApplyCoupon, onRemoveCoupon }: DiscountCouponFormProps) {
  const [couponCode, setCouponCode] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 1. Validation: check coupon code
    const trimmedCode = couponCode.trim();
    if (!trimmedCode) {
      setErrorMessage('Coupon code cannot be empty');
      return;
    }

    // 2. Validation: check email
    const trimmedEmail = customerEmail.trim();
    if (!trimmedEmail) {
      setErrorMessage('Customer email is required to redeem coupons');
      return;
    }

    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setErrorMessage('Please provide a valid email address');
      return;
    }

    // Clear previous error and start loading
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await verifyCouponApi(trimmedCode, trimmedEmail);
      setAppliedCoupon(result);
      setErrorMessage(null);
      setCouponCode('');
      if (onApplyCoupon) {
        onApplyCoupon(result);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to apply coupon');
      setAppliedCoupon(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setErrorMessage(null);
    if (onRemoveCoupon) {
      onRemoveCoupon();
    }
  };

  const handleDismissError = () => {
    setErrorMessage(null);
  };

  return (
    <div className="cart-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Tag size={20} color="#6366f1" />
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
          Redeem Store Promo or Coupon
        </h3>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Customer Email Field */}
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="customer-email"
            className="form-label"
            style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}
          >
            Customer Email
          </label>
          <input
            id="customer-email"
            type="email"
            className="form-input"
            placeholder="e.g. buyer@example.com"
            value={customerEmail}
            onChange={(e) => {
              setCustomerEmail(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            disabled={isLoading}
          />
        </div>

        {/* Coupon Code Field */}
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="coupon-code"
            className="form-label"
            style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}
          >
            Coupon Code
          </label>
          <input
            id="coupon-code"
            type="text"
            className="form-input"
            placeholder="e.g. SAVE20"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            disabled={isLoading}
          />
        </div>

        {/* Validation Error Alert (Role: alert) */}
        {errorMessage && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              fontWeight: 500,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={handleDismissError}
              aria-label="Dismiss error"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#b91c1c',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-checkout"
          style={{ width: '100%', margin: 0, justifyContent: 'center' }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="spin-animation" />
              <span>Verifying coupon...</span>
            </>
          ) : (
            <>
              <Check size={18} />
              <span>Apply Coupon</span>
            </>
          )}
        </button>
      </form>

      {/* Applied Coupon Display (Async data arrival) */}
      {appliedCoupon && (
        <div
          role="status"
          style={{
            marginTop: '1.25rem',
            padding: '1rem',
            borderRadius: '8px',
            background: '#d1fae5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  letterSpacing: '0.05em',
                  display: 'block',
                }}
              >
                {appliedCoupon.code}
              </span>
              <span style={{ fontSize: '0.85rem' }}>
                {appliedCoupon.description}
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="btn-remove-item"
              aria-label="Remove coupon"
              style={{ color: '#065f46' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DiscountCouponForm;
