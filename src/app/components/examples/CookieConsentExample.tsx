"use client";

import { useCookieConsent } from "../../hooks/useCookieConsent";
import { useEffect } from "react";

/**
 * Example component showing how to use cookie consent in your app
 * This component conditionally loads analytics/tracking only if user consented
 */
export default function CookieConsentExample() {
  const hasConsent = useCookieConsent();

  useEffect(() => {
    if (hasConsent) {
      // Initialize analytics only if user gave consent
      console.log("User has consented to cookies - safe to load analytics");

      // Example: Initialize Google Analytics
      // window.gtag('config', 'GA_MEASUREMENT_ID');

      // Example: Initialize Facebook Pixel
      // fbq('init', 'YOUR_PIXEL_ID');

      // Example: Initialize other tracking services
      // mixpanel.init('YOUR_TOKEN');
    } else {
      console.log("User has not consented to cookies - skip analytics");
    }
  }, [hasConsent]);

  return null; // This is usually a non-visual component
}

/**
 * Usage in your components:
 *
 * import { useCookieConsent } from "@/app/hooks/useCookieConsent";
 *
 * function MyComponent() {
 *   const hasConsent = useCookieConsent();
 *
 *   if (hasConsent) {
 *     // Load tracking pixels, analytics, etc.
 *   }
 * }
 */
