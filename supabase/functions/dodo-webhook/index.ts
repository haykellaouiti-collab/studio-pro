import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

async function verifyWebhookSignature(rawBody: string, headers: Headers, secret: string): Promise<boolean> {
  const webhookId = headers.get("webhook-id") || "";
  const timestamp = headers.get("webhook-timestamp") || "";
  const signatureHeader = headers.get("webhook-signature") || "";
  if (!webhookId || !timestamp || !signatureHeader) return false;

  const signedContent = `${webhookId}.${timestamp}.${rawBody}`;
  const rawKey = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  const keyBytes = Uint8Array.from(atob(rawKey), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(signedContent));
  const expectedSig = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)));

  return signatureHeader.split(" ").some((part) => {
    const [, sig] = part.split(",");
    return sig === expectedSig;
  });
}

Deno.serve(async (req) => {
  const rawBody = await req.text();
  const secret = Deno.env.get("DODO_PAYMENTS_WEBHOOK_KEY") || "";
  const valid = await verifyWebhookSignature(rawBody, req.headers, secret);
  if (!valid) return new Response("Invalid HMAC signature", { status: 401 });

  const event = JSON.parse(rawBody);
  const webhookId = req.headers.get("webhook-id")!;
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { error: idempErr } = await supabase
    .from("webhook_events")
    .insert({ webhook_id: webhookId, type: event.type });
  if (idempErr) return new Response("Already processed", { status: 200 });

  const userId = event.data?.metadata?.user_id;
  const subId = event.data?.subscription_id;
  const periodEnd = event.data?.next_billing_date || event.data?.current_period_end || null;

  const statusMap: Record<string, string> = {
    "subscription.active": "active",
    "subscription.renewed": "active",
    "subscription.cancelled": "cancelled",
    "subscription.expired": "expired",
    "subscription.on_hold": "on_hold",
    "subscription.past_due": "past_due",
  };

  if (userId && statusMap[event.type]) {
    await supabase.from("subscriptions").upsert({
      user_id: userId,
      status: statusMap[event.type],
      provider_subscription_id: subId,
      plan_id: event.data?.product_id || "pdt_0NsIlPdAVgTZQLGTpeAmF",
      current_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
