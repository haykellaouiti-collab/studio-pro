export interface SubscriptionRecord {
  user_id: string;
  status: 'active' | 'trialing' | 'cancelled' | 'expired' | 'on_hold' | 'past_due';
  provider_subscription_id?: string;
  plan_id?: string;
  current_period_end?: string | null;
}
