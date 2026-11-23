import { CONFIG } from './config.js';

export function buildDodoCheckoutUrl(user, redirectUrl) {
  const url = new URL(CONFIG.DODO_CHECKOUT_URL);
  url.searchParams.set('quantity', '1');
  if (user?.email) url.searchParams.set('prefilled_email', user.email);
  if (user?.id) url.searchParams.set('metadata[user_id]', user.id);
  if (redirectUrl) url.searchParams.set('redirect_url', redirectUrl);
  return url.toString();
}
