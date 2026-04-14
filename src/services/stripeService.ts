/**
 * Stripe Client-Side Service
 */

export const STRIPE_PUBLIC_KEY = (import.meta as any).env?.VITE_STRIPE_PUBLIC_KEY || "pk_test_...";

export async function createCheckoutSession(priceId: string, promoCode?: string) {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        promoCode,
      }),
    });

    const session = await response.json();
    return session.url; // Redirect user to this URL
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    throw error;
  }
}

/**
 * Check if user has access to premium content
 */
export function hasAccess(user: any, content: any) {
  if (!content.isPremium) return true;
  if (user.role === 'admin' || user.role === 'coach') return true;
  
  // Check subscription status or promo code access
  return user.subscriptionStatus === 'active' || user.hasPromoAccess;
}
