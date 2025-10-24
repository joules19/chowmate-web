"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ChowmateLogo from "../../assets/images/chowmate-dark-mont.png";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-white/95 backdrop-blur-md shadow-lg"
        : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center h-20">
          {/* Logo */}
          <Link href="/" className="cursor-pointer">
            <Image
              src={ChowmateLogo}
              width={190}
              height={50}
              alt="Chowmate Logo"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}