/**
 * Performance monitoring and optimization utilities
 */

/**
 * Measure and log performance metrics
 */
export function measurePerformance(name: string, fn: () => void): void {
  if (typeof window === 'undefined') return;

  const start = performance.now();
  fn();
  const end = performance.now();
  const duration = end - start;

  console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);

  // Send to analytics if available
  if (window.gtag) {
    window.gtag('event', 'timing_complete', {
      name,
      value: Math.round(duration),
      event_category: 'Performance',
    });
  }
}

/**
 * Async performance measurement
 */
export async function measurePerformanceAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  if (typeof window === 'undefined') {
    return fn();
  }

  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const duration = end - start;

  console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);

  // Send to analytics if available
  if (window.gtag) {
    window.gtag('event', 'timing_complete', {
      name,
      value: Math.round(duration),
      event_category: 'Performance',
    });
  }

  return result;
}

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: any): void {
  if (typeof window === 'undefined') return;

  const { name, value, id } = metric;

  console.log(`[Web Vitals] ${name}:`, value);

  // Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', name, {
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      event_label: id,
      non_interaction: true,
    });
  }

  // Send to Vercel Analytics
  if (window.va) {
    window.va('event', {
      name,
      data: {
        value,
        id,
      },
    });
  }
}

/**
 * Prefetch critical resources
 */
export function prefetchResources(urls: string[]): void {
  if (typeof window === 'undefined') return;

  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Preload critical resources
 */
export function preloadResources(urls: string[], type: 'script' | 'style' | 'font' = 'script'): void {
  if (typeof window === 'undefined') return;

  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    if (type === 'font') {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
}

/**
 * Lazy load component with loading fallback
 */
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = React.lazy(importFn);

  return (props: React.ComponentProps<T>) => (
    <React.Suspense fallback={fallback || <div>Loading...</div>}>
      <LazyComponent {...props} />
    </React.Suspense>
  );
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Optimize images by checking device pixel ratio
 */
export function getOptimalImageSize(baseSize: number): number {
  if (typeof window === 'undefined') return baseSize;
  const dpr = window.devicePixelRatio || 1;
  return baseSize * Math.min(dpr, 2); // Cap at 2x to avoid huge images
}

/**
 * Check if browser supports WebP
 */
export function supportsWebP(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);

  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

// Type declarations for global analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    va?: (...args: any[]) => void;
  }
}

// Import React for lazy component helper
import React from 'react';
