/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          {
            // Content Security Policy - Controls what resources can be loaded
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-inline and unsafe-eval
              "style-src 'self' 'unsafe-inline'", // Tailwind requires unsafe-inline
              "img-src 'self' data: https:", // Allow images from self, data URIs, and HTTPS
              "font-src 'self' data:", // Allow fonts from self and data URIs
              "connect-src 'self'", // Restrict API calls to same origin
              "frame-ancestors 'none'", // Prevent embedding in iframes (clickjacking protection)
              "base-uri 'self'", // Restrict base tag URLs
              "form-action 'self'", // Restrict form submissions to same origin
            ].join('; ')
          },
          {
            // Prevent the page from being embedded in iframes (clickjacking protection)
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            // Prevent MIME type sniffing
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            // Control how much referrer information is shared
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            // Control which browser features can be used
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          {
            // Force HTTPS in modern browsers (if served over HTTPS)
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
