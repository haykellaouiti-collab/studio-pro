export const APP_CONFIG = {
  appName: 'Studio Pro',
  suiteName: 'HAK IA · Studio Pro',
  brandWatermark: 'Studio Pro - HAK IA (Gratuit)',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://gxjhkjpxpahgoiezdzxl.supabase.co',
  supabaseAnonKey:
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4amhranB4cGFoZ29pZXpkenhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ3NTU2NzIsImV4cCI6MjExMDMzMTY3Mn0.yL2PldZ4b9KFC9DzXPBwti-CQnpNLPKD1wUHhDWcr1c',
  dodoCheckoutBaseUrl: 'https://checkout.dodopayments.com/buy/pdt_0NsIlPdAVgTZQLGTpeAmF',
  plans: {
    free: {
      name: 'Gratuit',
      priceLabel: '0 $ / mois',
      maxClips: 2,
      maxExportsPerDay: 1,
      maxResolution: 720,
      watermark: true,
      allowDeepAnonymization: false,
    },
    creator: {
      name: 'Creator',
      priceLabel: '10 $ / mois',
      maxClips: Infinity,
      maxExportsPerDay: Infinity,
      maxResolution: 1080,
      watermark: false,
      allowDeepAnonymization: true,
    },
  },
};
