"use client";

import { useState, useEffect } from "react";
import { Cookies } from "react-cookie-consent";

/**
 * Hook to check if user has given cookie consent
 * @returns {boolean} true if user has accepted cookies, false otherwise
 */
export function useCookieConsent(): boolean {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Check if the consent cookie exists
    const consent = Cookies.get("chowmate-cookie-consent");
    setHasConsent(consent === "true");
  }, []);

  return hasConsent;
}
