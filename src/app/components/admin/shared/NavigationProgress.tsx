"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavigationProgress() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Start loading when pathname changes
    setIsLoading(true);
    setProgress(0);

    // Simulate progress animation
    const progressTimer = setTimeout(() => {
      setProgress(30);
      
      const secondTimer = setTimeout(() => {
        setProgress(70);
        
        const thirdTimer = setTimeout(() => {
          setProgress(100);
          
          // Hide progress bar after completion
          const hideTimer = setTimeout(() => {
            setIsLoading(false);
            setProgress(0);
          }, 200);
          
          return () => clearTimeout(hideTimer);
        }, 100);
        
        return () => clearTimeout(thirdTimer);
      }, 150);
      
      return () => clearTimeout(secondTimer);
    }, 100);

    return () => clearTimeout(progressTimer);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1">
      <div
        className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 ease-out shadow-sm"
        style={{
          width: `${progress}%`,
          boxShadow: progress > 0 ? '0 0 10px rgba(255, 193, 7, 0.5)' : 'none'
        }}
      />
      <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-primary-600/20 to-transparent" />
    </div>
  );
}