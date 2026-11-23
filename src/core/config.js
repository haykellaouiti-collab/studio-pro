export const CONFIG = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://gxjhkjpxpahgoiezdzxl.supabase.co',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4amhranB4cGFoZ29pZXpkenhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ3NTU2NzIsImV4cCI6MjExMDMzMTY3Mn0.yL2PldZ4b9KFC9DzXPBwti-CQnpNLPKD1wUHhDWcr1c',
  DODO_CHECKOUT_URL: 'https://checkout.dodopayments.com/buy/pdt_0NsIlPdAVgTZQLGTpeAmF',
  CREATOR_PRICE_USD: 10,
  MAX_FILE_BYTES: 500 * 1024 * 1024,
  ALLOWED_EXTENSIONS: ['mp4', 'mov', 'webm', 'mkv'],
  FREE_MAX_CLIPS: 2,
  CREATOR_MAX_CLIPS: 10,
  FREE_DAILY_EXPORTS: 1
};
