import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Production Security Middleware
 *
 * - Security headers (CSP, HSTS, etc.)
 * - CORS configuration
 * - Request monitoring
 */
export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const response = NextResponse.next();

  // ============================================
  // Security Headers
  // ============================================

  // 1. Content Security Policy (CSP)
  // Prevents XSS attacks by controlling which resources can be loaded
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https: blob:;
    font-src 'self' data:;
    connect-src 'self' https://api.stripe.com https://www.google-analytics.com;
    frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s{2,}/g, " ").trim();

  response.headers.set("Content-Security-Policy", cspHeader);

  // 2. Strict-Transport-Security (HSTS)
  // Forces HTTPS connections
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // 3. X-Frame-Options
  // Prevents clickjacking attacks
  response.headers.set("X-Frame-Options", "DENY");

  // 4. X-Content-Type-Options
  // Prevents MIME sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // 5. X-XSS-Protection (legacy, but still useful for older browsers)
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // 6. Referrer-Policy
  // Controls how much referrer information is shared
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // 7. Permissions-Policy
  // Controls which browser features can be used
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );

  // 8. X-DNS-Prefetch-Control
  // Controls DNS prefetching
  response.headers.set("X-DNS-Prefetch-Control", "on");

  // ============================================
  // CORS Headers (for API routes)
  // ============================================

  if (request.nextUrl.pathname.startsWith('/api')) {
    const origin = request.headers.get('origin');
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.NEXT_PUBLIC_APP_URL,
    ].filter(Boolean) as string[];

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Max-Age', '86400');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
  }

  // ============================================
  // Performance Monitoring
  // ============================================

  // Add request ID for tracing
  const requestId = crypto.randomUUID();
  response.headers.set("X-Request-ID", requestId);

  // Log slow requests in production
  if (process.env.NODE_ENV === "production") {
    const duration = Date.now() - startTime;

    if (duration > 1000) {
      console.log(
        JSON.stringify({
          level: "warn",
          message: "Slow request detected",
          timestamp: new Date().toISOString(),
          metadata: {
            requestId,
            method: request.method,
            url: request.nextUrl.pathname,
            duration: `${duration}ms`,
          },
        })
      );
    }
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
