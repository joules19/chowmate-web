"use client";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import chowmateLogo from "../../assets/images/chowmate-light-mont.png";

const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Linkedin, href: "#" },
];

export default function SimpleFooter() {
    return (
        <footer className="bg-[#282828] text-[#FFF8E1]">
            <div className="container mx-auto px-4 py-12">
                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-start justify-between mb-12">
                    {/* Brand Section */}
                    <div className="flex flex-col items-center lg:items-start max-w-md text-center lg:text-left">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <img
                                src={chowmateLogo.src}
                                width={200}
                                alt="Chowmate Logo"
                            />
                        </Link>
                        <p className="text-[#A1A1A1]  mb-6 leading-relaxed">
                            Your trusted partner for fast, reliable delivery services.
                            From food to groceries, we&#39;re building the future of logistics in Nigeria.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center hover:bg-[#FFC107] hover:text-[#282828] transition-all duration-200"
                                    aria-label={`Follow us on ${social.icon.name}`}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col items-center lg:items-end space-y-4">
                        <h3 className="text-white font-semibold text-lg mb-2">Get in Touch</h3>
                        <a
                            href="mailto:support@chowmate.app"
                            className="flex items-center space-x-3 text-[#A1A1A1] hover:text-[#FFC107] transition-colors duration-200"
                        >
                            <Mail className="w-5 h-5 text-[#FFC107]" />
                            <span>support@chowmate.app</span>
                        </a>
                        <a
                            href="tel:+2341234567890"
                            className="flex items-center space-x-3 text-[#A1A1A1] hover:text-[#FFC107] transition-colors duration-200"
                        >
                            <Phone className="w-5 h-5 text-[#FFC107]" />
                            <span>+234 903 8073 651</span>
                        </a>
                        {/* <div className="flex items-center space-x-3 text-[#A1A1A1]">
                            <MapPin className="w-5 h-5 text-[#FFC107]" />
                            <span className="text-center lg:text-left">
                                8, Trinity Street, Phase II, Mowe, Ogun State.
                            </span>
                        </div> */}
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#333333]"></div>

                {/* Bottom Section */}
                <div className="pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <p className="text-sm text-[#A1A1A1]">
                        © {new Date().getFullYear()} Chowmate. All rights reserved.
                    </p>
                    {/* <p className="text-sm text-[#A1A1A1] italic">
                        Launching Soon 🚀
                    </p> */}
                </div>
            </div>
        </footer>
    );
}