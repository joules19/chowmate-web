"use client";

import { useState, useEffect } from "react";
import CookieConsent from "react-cookie-consent";
import confetti from "canvas-confetti";

export default function CookieConsentBanner() {
  const [crumbs, setCrumbs] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    // Generate floating cookie crumbs
    const newCrumbs = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setCrumbs(newCrumbs);
  }, []);

  const handleAccept = () => {
    console.log("🍪 Cookie consent accepted - User loves our cookies!");

    // Trigger confetti celebration!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#FFC107', '#FFD54F', '#FFF8E1', '#FF6B6B', '#4ECDC4'],
      shapes: ['circle', 'square'],
      scalar: 1.2,
    });

    // Second burst for extra flair
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#FFC107', '#FFD54F'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#FFC107', '#FFD54F'],
      });
    }, 250);

    // Initialize analytics here
    // Example: window.gtag('config', 'GA_MEASUREMENT_ID');
  };

  const handleDecline = () => {
    console.log("Cookie consent declined - Essentials only");
    // Disable non-essential cookies/tracking
  };

  return (
    <>
      <CookieConsent
        location="bottom"
        buttonText="Sounds Delicious! 🍪"
        declineButtonText="Just Essentials"
        enableDeclineButton
        cookieName="chowmate-cookie-consent"
        style={{
          background: "linear-gradient(135deg, #FFFBF0 0%, #FFF8E1 100%)",
          borderTop: "3px solid #FFC107",
          boxShadow: "0 -10px 40px rgba(255, 193, 7, 0.15), 0 -4px 12px rgba(0, 0, 0, 0.1)",
          padding: "1.5rem 1.25rem",
          alignItems: "center",
          gap: "1rem",
          fontFamily: "Montserrat, sans-serif",
          position: "fixed",
          bottom: "0",
          left: "0",
          right: "0",
          zIndex: 999999,
          overflow: "hidden",
        }}
        buttonStyle={{
          background: "linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)",
          color: "#282828",
          fontSize: "15px",
          fontWeight: "600",
          padding: "0.75rem 2rem",
          borderRadius: "9999px",
          border: "2px solid #FFC107",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 15px rgba(255, 193, 7, 0.3)",
          textTransform: "none",
          position: "relative",
          zIndex: 10,
        }}
        buttonWrapperClasses="cookie-button-wrapper"
        declineButtonStyle={{
          background: "transparent",
          color: "#666666",
          fontSize: "14px",
          fontWeight: "500",
          padding: "0.75rem 1.5rem",
          borderRadius: "9999px",
          border: "2px solid #E0E0E0",
          cursor: "pointer",
          transition: "all 0.3s ease",
          textTransform: "none",
          position: "relative",
          zIndex: 10,
        }}
        expires={365}
        onAccept={handleAccept}
        onDecline={handleDecline}
      >
        <style jsx global>{`
          /* Ensure cookie banner appears above everything */
          #rcc-confirm-button,
          #rcc-decline-button,
          .CookieConsent {
            z-index: 999999 !important;
          }

          .cookie-button-wrapper button:first-child:hover {
            transform: scale(1.05) rotate(-2deg);
            box-shadow: 0 6px 25px rgba(255, 193, 7, 0.5) !important;
            background: linear-gradient(135deg, #FFD54F 0%, #FFC107 100%) !important;
          }

          .cookie-button-wrapper button:first-child:active {
            transform: scale(0.95);
          }

          .cookie-button-wrapper button:last-child:hover {
            border-color: #666666 !important;
            background: rgba(102, 102, 102, 0.05) !important;
            transform: scale(1.02);
          }

          @keyframes cookieBounce {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-10px) rotate(-8deg); }
            50% { transform: translateY(-5px) rotate(0deg); }
            75% { transform: translateY(-8px) rotate(8deg); }
          }

          @keyframes cookieBite {
            0% { clip-path: circle(50% at 50% 50%); }
            100% { clip-path: circle(50% at 120% 50%); }
          }

          @keyframes crumbFloat {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 0.6;
            }
            90% {
              opacity: 0.3;
            }
            100% {
              transform: translateY(-100px) rotate(360deg);
              opacity: 0;
            }
          }

          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
          }

          .cookie-icon {
            animation: cookieBounce 2.5s ease-in-out infinite;
            position: relative;
          }

          .cookie-icon::before,
          .cookie-icon::after {
            content: '✨';
            position: absolute;
            font-size: 12px;
            animation: sparkle 2s ease-in-out infinite;
          }

          .cookie-icon::before {
            top: -5px;
            right: -5px;
            animation-delay: 0s;
          }

          .cookie-icon::after {
            bottom: -5px;
            left: -5px;
            animation-delay: 1s;
          }

          .cookie-crumb {
            position: absolute;
            width: 6px;
            height: 6px;
            background: #FFC107;
            border-radius: 50%;
            animation: crumbFloat 4s ease-in-out infinite;
            pointer-events: none;
            z-index: 1;
          }

          .cookie-crumb:nth-child(2n) {
            background: #FFD54F;
            width: 4px;
            height: 4px;
          }

          .cookie-crumb:nth-child(3n) {
            width: 5px;
            height: 5px;
            background: #FFB300;
          }
        `}</style>

        {/* Floating Cookie Crumbs */}
        {crumbs.map((crumb) => (
          <div
            key={crumb.id}
            className="cookie-crumb"
            style={{
              left: `${crumb.x}%`,
              bottom: 0,
              animationDelay: `${crumb.delay}s`,
            }}
          />
        ))}

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 max-w-6xl mx-auto relative z-10">
          {/* Cookie Icon - Desktop */}
          <div className="hidden sm:block cookie-icon flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FFC107] to-[#FFD54F] rounded-full flex items-center justify-center shadow-lg relative">
              <span className="text-3xl">🍪</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Mobile Header */}
            <div className="flex items-start gap-3 sm:hidden mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFC107] to-[#FFD54F] rounded-full flex items-center justify-center shadow-lg flex-shrink-0 cookie-icon">
                <span className="text-2xl">🍪</span>
              </div>
              <h3 className="text-lg font-bold text-[#282828] leading-tight">
                We value your privacy!
              </h3>
            </div>

            {/* Desktop Header */}
            <h3 className="hidden sm:block text-xl font-bold text-[#282828] mb-2">
              We value your privacy! 🙏
            </h3>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#333333] leading-relaxed">
              Just like we carefully prepare your orders, we handle your data with care.
              We use cookies to serve up the best experience, personalized recommendations,
              and keep track of your favorites.{" "}
              <a
                href="/docs/privacy"
                className="text-[#FFC107] hover:text-[#FFD54F] underline font-semibold transition-colors inline-flex items-center gap-1"
              >
                Learn more
                <span className="text-xs">→</span>
              </a>
            </p>
          </div>
        </div>
      </CookieConsent>
    </>
  );
}
