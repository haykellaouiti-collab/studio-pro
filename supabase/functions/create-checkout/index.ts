import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

  const url = new URL("https://checkout.dodopayments.com/buy/pdt_0NsIlPdAVgTZQLGTpeAmF");
  url.searchParams.set("quantity", "1");
  if (user.email) url.searchParams.set("prefilled_email", user.email);
  url.searchParams.set("metadata[user_id]", user.id);

  return new Response(JSON.stringify({ checkout_url: url.toString() }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
