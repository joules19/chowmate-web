"use client";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
    company: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Blog", href: "/blog" },
    ],
    services: [
        { name: "Food Delivery", href: "/services/food" },
        { name: "Grocery Delivery", href: "/services/grocery" },
        { name: "Package Delivery", href: "/services/package" },
        { name: "Pharmacy", href: "/services/pharmacy" },
    ],
    support: [
        { name: "Help Center", href: "/help" },
        { name: "Contact Us", href: "/contact" },
        { name: "FAQs", href: "/faqs" },
        { name: "Safety", href: "/safety" },
    ],
    legal: [
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Refund Policy", href: "/refunds" },
    ],
};

const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/chowmate" },
    { icon: Twitter, href: "https://twitter.com/chowmate" },
    { icon: Instagram, href: "https://instagram.com/chowmate" },
    { icon: Linkedin, href: "https://linkedin.com/company/chowmate" },
];

export default function Footer() {
    return (
        <footer className="bg-[#282828] text-[#FFF8E1]">
            <div className="container mx-auto px-4 py-12 lg:py-16">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-[#FFD54F] to-[#FFC107] rounded-full flex items-center justify-center">
                                <span className="text-[#282828] font-bold text-xl">C</span>
                            </div>
                            <span className="text-2xl font-bold text-white">Chowmate</span>
                        </Link>
                        <p className="text-sm mb-6 text-[#A1A1A1]">
                            Your trusted partner for fast, reliable delivery services. From food to groceries, we&#39;ve got you covered.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center hover:bg-[#FFC107] hover:text-[#282828] transition-all duration-200"
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:col-span-4">
                        <div>
                            <h3 className="text-white font-semibold mb-4">Company</h3>
                            <ul className="space-y-2">
                                {footerLinks.company.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-[#A1A1A1] hover:text-[#FFC107] transition-colors duration-200"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-4">Services</h3>
                            <ul className="space-y-2">
                                {footerLinks.services.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-[#A1A1A1] hover:text-[#FFC107] transition-colors duration-200"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-4">Support</h3>
                            <ul className="space-y-2">
                                {footerLinks.support.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-[#A1A1A1] hover:text-[#FFC107] transition-colors duration-200"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-[#A1A1A1] hover:text-[#FFC107] transition-colors duration-200"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="border-t border-[#333333] pt-8 mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-[#FFC107]" />
                            <span className="text-sm text-[#A1A1A1]">support@chowmate.com</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-[#FFC107]" />
                            <span className="text-sm text-[#A1A1A1]">+234 123 456 7890</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-[#FFC107]" />
                            <span className="text-sm text-[#A1A1A1]">Lagos, Nigeria</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-[#333333] pt-8 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm text-[#A1A1A1] mb-4 sm:mb-0">
                        © 2024 Chowmate. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-sm">
                        <Link href="/terms" className="text-[#A1A1A1] hover:text-[#FFC107] transition-colors duration-200">
                            Terms
                        </Link>
                        <Link href="/privacy" className="text-[#A1A1A1] hover:text-[#FFC107] transition-colors duration-200">
                            Privacy
                        </Link>
                        <Link href="/cookies" className="text-[#A1A1A1] hover:text-[#FFC107] transition-colors duration-200">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}