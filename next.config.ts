import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              // Allow scripts from self, Supabase, hCaptcha, Google OAuth
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://hcaptcha.com https://*.hcaptcha.com https://accounts.google.com https://static.cloudflareinsights.com",
              // Allow frames for hCaptcha and Google OAuth
              "frame-src 'self' https://hcaptcha.com https://*.hcaptcha.com https://accounts.google.com",
              // Allow connections to Supabase, hCaptcha, Google, OpenCage
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://hcaptcha.com https://*.hcaptcha.com https://accounts.google.com https://api.opencagedata.com https://geocoding-api.open-meteo.com https://cloudflareinsights.com https://*.cloudflareinsights.com",
              // Images from self + Google profile pictures + hCaptcha challenges
              "img-src 'self' data: blob: https://*.googleusercontent.com https://lh3.googleusercontent.com https://hcaptcha.com https://*.hcaptcha.com",
              // Fonts from self
              "font-src 'self' data:",
              // Default
              "default-src 'self'",
              "style-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com",
              "worker-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
