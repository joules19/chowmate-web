"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Home, ArrowLeft, MapPin, Package, Clock, Shield } from "lucide-react";
import Navbar from "./components/navigation/NavBar";
import SimpleFooter from "./components/ui/SimpleFooter";

const NotFoundPage = () => {
    // Floating delivery elements animation
    const floatingElements = [
        { icon: Package, delay: 0, x: 100, y: 50 },
        { icon: MapPin, delay: 1, x: 300, y: 80 },
        { icon: Clock, delay: 2, x: 200, y: 120 },
    ];

    const quickLinks = [
        { name: "Order Food", href: "/", icon: Package },
        { name: "Faq", href: "/", icon: MapPin },
        { name: "Support", href: "#", icon: Home },
        { name: "Privacy Policy", href: "/docs/privacy", icon: Shield },
    ];

    return (
        <>
            <Navbar />

            {/* 404 Hero Section */}
            <section className="relative h-[calc(100vh-18rem)] sm:h-auto lg:min-h-screen bg-gradient-to-br from-[#FFF8E1] via-[#FFFCF4] to-[#FFF8E1] pt-20 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0">
                    {/* Geometric Grid */}
                    <div className="absolute inset-0 opacity-[0.03]">
                        <div
                            className="h-full w-full"
                            style={{
                                backgroundImage: `
                                    linear-gradient(#282828 1px, transparent 1px),
                                    linear-gradient(90deg, #282828 1px, transparent 1px)
                                `,
                                backgroundSize: '50px 50px'
                            }}
                        />
                    </div>

                    {/* Floating Delivery Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        {floatingElements.map((element, index) => {
                            const IconComponent = element.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="absolute text-[#FFC107] opacity-10"
                                    style={{
                                        left: `${element.x}px`,
                                        top: `${element.y}px`,
                                    }}
                                    animate={{
                                        y: [0, -20, 0],
                                        rotate: [0, 5, -5, 0],
                                        opacity: [0.1, 0.15, 0.1]
                                    }}
                                    transition={{
                                        duration: 6 + element.delay,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: element.delay
                                    }}
                                >
                                    <IconComponent className="w-12 h-12" />
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Animated Delivery Route */}
                    <svg className="absolute inset-0 w-full h-full opacity-[0.08]" viewBox="0 0 800 600">
                        <motion.path
                            d="M 100 300 Q 400 100 700 300"
                            stroke="#FFC107"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray="20 10"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </svg>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-5rem)] gap-8 lg:gap-16">

                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="flex-1 text-center lg:text-left max-w-2xl"
                        >
                            {/* Error Code */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="mb-6"
                            >
                                <span className="text-8xl sm:text-9xl lg:text-[12rem] font-bold text-[#FFC107] leading-none opacity-90 select-none">
                                    404
                                </span>
                            </motion.div>

                            {/* Main Message */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="mb-8"
                            >
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#282828] mb-4 leading-tight">
                                    Page
                                    <span className="text-[#FFC107]">Not Found</span>
                                </h1>
                                <p className="text-lg sm:text-xl text-[#666666] leading-relaxed max-w-lg mx-auto lg:mx-0">
                                    Sorry, the page you&#39;re looking for doesn&#39;t exist. It might have been moved,
                                    deleted, or you entered the wrong URL.
                                </p>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            >
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center gap-3 bg-[#FFC107] text-[#282828] px-8 py-4 rounded-full font-semibold hover:bg-[#FFD54F] hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:ring-offset-2"
                                >
                                    <Home className="w-5 h-5" />
                                    Back to Home
                                </Link>

                                <button
                                    onClick={() => window.history.back()}
                                    className="inline-flex items-center justify-center gap-3 border-2 border-[#282828] text-[#282828] px-8 py-4 rounded-full font-semibold hover:bg-[#282828] hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#282828] focus:ring-offset-2"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Go Back
                                </button>
                            </motion.div>
                        </motion.div>

                        {/* Right Illustration */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="hidden sm:flex flex-1 max-w-lg"
                        >
                            <div className="relative">
                                {/* Main Illustration Container */}
                                <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 relative overflow-hidden">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-5">
                                        <div
                                            className="h-full w-full"
                                            style={{
                                                backgroundImage: `radial-gradient(circle at 20px 20px, #FFC107 2px, transparent 0)`,
                                                backgroundSize: '40px 40px'
                                            }}
                                        />
                                    </div>

                                    {/* Simple 404 Illustration */}
                                    <div className="relative z-10 text-center">
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.05, 1],
                                                opacity: [0.8, 1, 0.8]
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="text-8xl mb-6"
                                        >
                                            📱
                                        </motion.div>

                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-bold text-[#282828]">
                                                Page Unavailable
                                            </h3>
                                            <p className="text-[#666666]">
                                                The page you&#39;re trying to reach is currently not available.
                                                Let&#39;s get you back to where you need to be.
                                            </p>
                                        </div>

                                        {/* Simple Status */}
                                        <div className="mt-8 p-4 bg-[#FFF8E1] rounded-xl">
                                            <div className="flex items-center justify-center gap-2">
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className="w-3 h-3 bg-red-500 rounded-full"
                                                />
                                                <span className="text-sm text-[#666666] font-medium">Page not found</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <motion.div
                                    className="absolute -top-4 -right-4 w-8 h-8 bg-[#FFC107] rounded-full flex items-center justify-center"
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <span className="text-white text-xs">?</span>
                                </motion.div>

                                <motion.div
                                    className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#282828] rounded-full"
                                    animate={{
                                        y: [0, -20, 0],
                                        opacity: [0.7, 1, 0.7]
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Quick Navigation Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#282828] mb-4">
                            Popular Destinations
                        </h2>
                        <p className="text-lg text-[#666666] max-w-2xl mx-auto">
                            While you&#39;re here, check out these popular sections of our platform.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickLinks.map((link, index) => {
                            const IconComponent = link.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="group block p-6 bg-[#FFF8E1] rounded-2xl hover:bg-[#FFC107] transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:ring-offset-2"
                                    >
                                        <div className="flex flex-col items-center text-center">
                                            <div className="bg-[#FFC107] group-hover:bg-white p-4 rounded-full mb-4 transition-colors duration-300">
                                                <IconComponent className="w-8 h-8 text-[#282828]" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-[#282828] group-hover:text-white transition-colors duration-300">
                                                {link.name}
                                            </h3>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Help Section */}
            <section className="py-16 bg-[#FFFCF4]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <div className="bg-white rounded-3xl shadow-lg p-8 lg:p-12">
                            <div className="text-6xl mb-6">🤝</div>
                            <h3 className="text-2xl lg:text-3xl font-bold text-[#282828] mb-4">
                                Still Need Help?
                            </h3>
                            <p className="text-lg text-[#666666] mb-8">
                                Our customer support team is always ready to help you find what you&#39;re looking for.
                                Don&#39;t hesitate to reach out!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="mailto:support@chowmate.app"
                                    className="inline-flex items-center justify-center gap-3 bg-[#FFC107] text-[#282828] px-8 py-4 rounded-full font-semibold hover:bg-[#FFD54F] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:ring-offset-2"
                                >
                                    Contact Support
                                </a>
                                <a
                                    href="tel:+2349038073651"
                                    className="inline-flex items-center justify-center gap-3 border-2 border-[#282828] text-[#282828] px-8 py-4 rounded-full font-semibold hover:bg-[#282828] hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#282828] focus:ring-offset-2"
                                >
                                    Call Us
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <SimpleFooter />
        </>
    );
};

export default NotFoundPage;