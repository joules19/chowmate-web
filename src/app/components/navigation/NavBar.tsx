"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/AppButton";
import ChowmateLogo from "../../assets/images/chowmate-dark-mont.png";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  {
    name: "Services",
    href: "/services",
    dropdown: [
      { name: "Food Delivery", href: "/services/food" },
      { name: "Grocery Delivery", href: "/services/grocery" },
      { name: "Package Delivery", href: "/services/package" },
      { name: "Pharmacy", href: "/services/pharmacy" },
    ],
  },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="cursor-pointer">
            <Image
              src={ChowmateLogo}
              width={190}
              height={50}
              alt="Chowmate Logo"
            />
          </Link>

          {/* Desktop Navigation */}

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* <Button
              buttonText="Sign In"
              mode="outline"
              className="border-[#282828] text-[#282828] px-6 py-2 rounded-full hover:border-[#FFC107] hover:text-[#FFC107] transition-all duration-200"
            /> */}
            {/* <Button
              buttonText="Get Started"
              mode="solid"
              className="bg-[#FFC107] text-[#282828] px-6 py-2 rounded-full hover:bg-[#FFD54F] hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            /> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-[#FFF8E1] transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[#282828]" />
            ) : (
              <Menu className="w-6 h-6 text-[#282828]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-[#FFF8E1]"
          >
            <div className="container mx-auto px-4 py-4">
              {navItems.map((item) => (
                <div key={item.name} className="py-2">
                  <Link
                    href={item.href}
                    className="block text-[#333333] hover:text-[#FFC107] transition-colors duration-200 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.dropdown && (
                    <div className="ml-4 mt-2 space-y-2">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block text-sm text-[#A1A1A1] hover:text-[#FFC107] transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex flex-col space-y-3 mt-4">
                {/* <Button
                  buttonText="Sign In"
                  mode="outline"
                  className="w-full border-[#282828] text-[#282828] py-2 rounded-full"
                /> */}
                <Button
                  buttonText="Get Started"
                  mode="solid"
                  className="w-full bg-[#FFC107] text-[#282828] py-2 rounded-full hover:bg-[#FFD54F]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}