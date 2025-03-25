"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../assets/images/chowbro_logo.png";
import { useRouter } from "next/navigation";

const navLinks = [
  { name: "Store", path: "/store" },
  { name: "Company", path: "#" },
  { name: "Contact", path: "#" },
];

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="px-4 py-3 flex justify-between items-center">
      <Image src={Logo} alt="Logo" width={180} />

      {/* Mobile Menu Button */}
      {!menuOpen && (
        <button className="lg:hidden text-gray-800" onClick={() => setMenuOpen(true)}>
          <Menu size={28} />
        </button>
      )}

      <div className="hidden lg:flex justify-between items-center space-x-14">
        {/* Desktop Menu */}
        <nav className="flex space-x-6">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path} className="text-dark-1 hover:text-primary-1 font-medium text-base">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Menu - Login Button */}
        <button onClick={() => router.push("/login")} className="flex items-center px-4 py-1 border border-dark-1 text-dark-1 font-normal text-sm hover:border-primary-1 hover:text-primary-1 rounded-md transition-colors duration-300">
          Login
        </button>
      </div>


      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="fixed top-0 left-0 h-full w-64 bg-primary-fade shadow-md transform transition-transform duration-300 ease-in-out lg:hidden">
          <div className="p-4 flex justify-between items-center border-b">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button onClick={() => setMenuOpen(false)}>
              <X size={28} className="text-gray-800" />
            </button>
          </div>
          <ul className="p-4 space-y-4">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className="block text-dark-1 hover:text-primary-1 font-medium text-base"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}