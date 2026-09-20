import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DiscountCouponForm } from './DiscountCouponForm';

describe('DiscountCouponForm Component (Behavioral Testing)', () => {
  // Test 1: Component renders expected form fields queried like a user
  it('renders input fields querying by accessible label text and submit button by role', () => {
    // Arrange: Render the form
    render(<DiscountCouponForm />);

    // Act: Query elements via user-facing accessible queries (never test IDs)
    const emailInput = screen.getByLabelText(/customer email/i);
    const couponInput = screen.getByLabelText(/coupon code/i);
    const submitBtn = screen.getByRole('button', { name: /apply coupon/i });

    // Assert: Verify all interactive controls are visible to the user
    expect(emailInput).toBeInTheDocument();
    expect(couponInput).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
  });

  // Test 2: Typing and submitting empty input triggers validation error
  it('displays a validation error when submitted with an empty coupon code', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<DiscountCouponForm />);

    const emailInput = screen.getByLabelText(/customer email/i);
    const submitBtn = screen.getByRole('button', { name: /apply coupon/i });

    // Act: User types email but leaves coupon code completely empty, then submits
    await user.type(emailInput, 'shopper@test.com');
    await user.click(submitBtn);

    // Assert: User receives accessible alert announcing the validation issue
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getByText(/coupon code cannot be empty/i)).toBeInTheDocument();
  });

  // Test 3: Edge Case - whitespace only input is caught by validation
  it('displays validation error when user enters only spaces (edge case: whitespace input)', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<DiscountCouponForm />);

    const emailInput = screen.getByLabelText(/customer email/i);
    const couponInput = screen.getByLabelText(/coupon code/i);
    const submitBtn = screen.getByRole('button', { name: /apply coupon/i });

    // Act: Type whitespace into both fields and submit
    await user.type(emailInput, '   buyer@domain.com   ');
    await user.type(couponInput, '     ');
    await user.click(submitBtn);

    // Assert: Trimmed validation flags the empty coupon
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/coupon code cannot be empty/i)).toBeInTheDocument();
  });

  // Test 4: Async resolution - waits for async API response with findBy*
  it('submits valid coupon and waits for applied discount data using findBy', async () => {
    // Arrange
    const user = userEvent.setup();
    const handleApplyCoupon = vi.fn();
    render(<DiscountCouponForm onApplyCoupon={handleApplyCoupon} />);

    const emailInput = screen.getByLabelText(/customer email/i);
    const couponInput = screen.getByLabelText(/coupon code/i);
    const submitBtn = screen.getByRole('button', { name: /apply coupon/i });

    // Act: Type valid credentials and submit
    await user.type(emailInput, 'member@store.org');
    await user.type(couponInput, 'SAVE20');
    await user.click(submitBtn);

    // Assert: Wait asynchronously for the async network response with findBy*
    const discountNotice = await screen.findByText(/20% discount applied to your order/i);
    expect(discountNotice).toBeInTheDocument();
    expect(screen.getByText('SAVE20')).toBeInTheDocument();
    expect(handleApplyCoupon).toHaveBeenCalledTimes(1);
    expect(handleApplyCoupon).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'SAVE20',
        discountPercentage: 20,
      })
    );
  });

  // Test 5: Absence Proof - queryBy* returning null when conditional element is dismissed
  it('proves absence: queryByRole("alert") returns null once the error is dismissed', async () => {
    // Arrange: Trigger an error first
    const user = userEvent.setup();
    render(<DiscountCouponForm />);

    const submitBtn = screen.getByRole('button', { name: /apply coupon/i });
    await user.click(submitBtn);

    // Verify error is initially present
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Act: Click the dismiss button to close the alert
    const dismissBtn = screen.getByRole('button', { name: /dismiss error/i });
    await user.click(dismissBtn);

    // Assert (Absence Proof): queryBy* returns null now that the conditional alert is gone
    const absentAlert = screen.queryByRole('alert');
    expect(absentAlert).toBeNull();
  });

  // Test 6: Absence Proof - queryBy* returns null when applied coupon is removed
  it('proves absence: queryByText returns null after removing an applied coupon', async () => {
    // Arrange: Apply a coupon and wait for it to appear
    const user = userEvent.setup();
    render(<DiscountCouponForm />);

    await user.type(screen.getByLabelText(/customer email/i), 'buyer@domain.com');
    await user.type(screen.getByLabelText(/coupon code/i), 'PROMO50');
    await user.click(screen.getByRole('button', { name: /apply coupon/i }));

    // Wait for the coupon to resolve and appear
    await screen.findByText(/50% VIP discount applied/i);

    // Act: User clicks the "Remove coupon" button
    const removeBtn = screen.getByRole('button', { name: /remove coupon/i });
    await user.click(removeBtn);

    // Assert (Absence Proof): The promo text is completely unmounted from the DOM
    expect(screen.queryByText(/50% VIP discount applied/i)).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
  });

  // Test 7: Edge Case - Rapid typing does not corrupt input value
  it('handles rapid sequential typing across multiple input fields without dropping characters', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<DiscountCouponForm />);

    const emailInput = screen.getByLabelText(/customer email/i);
    const couponInput = screen.getByLabelText(/coupon code/i);

    // Act: Rapid typing sequence
    await user.type(emailInput, 'rapid.user@velocity.tech');
    await user.type(couponInput, 'FREESHIP');

    // Assert: Full value is correctly captured
    expect(emailInput).toHaveValue('rapid.user@velocity.tech');
    expect(couponInput).toHaveValue('FREESHIP');
  });
});
