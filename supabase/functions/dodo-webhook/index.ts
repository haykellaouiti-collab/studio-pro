import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const payload = await req.json();
    const eventType = payload?.type || '';
    const data = payload?.data || {};
    const userId = data?.metadata?.user_id;

    if (!userId) {
      return new Response(JSON.stringify({ received: true, skipped: 'missing user_id' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const isActive =
      eventType === 'subscription.active' ||
      eventType === 'subscription.renewed' ||
      data?.status === 'active';

    const status = isActive ? 'active' : 'canceled';

    const { error } = await supabaseAdmin.from('subscriptions').upsert(
      {
        user_id: userId,
        provider: 'dodo_payments',
        subscription_id: data?.subscription_id || data?.id || null,
        status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    if (error) throw error;

    return new Response(JSON.stringify({ received: true, userId, status }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
