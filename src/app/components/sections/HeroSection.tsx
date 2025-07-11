"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, Shield, ArrowRight, Navigation } from "lucide-react";
import { useEffect, useState } from "react";
import HeroImage from "../../assets/images/map.jpg";
import { Button } from "../ui/AppButton";


const HeroSection = () => {
    const [activeStep, setActiveStep] = useState(0);

    // Auto-progress delivery steps
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const deliverySteps = [
        { id: 0, label: "Order Placed", icon: "📱", color: "#FFC107" },
        { id: 1, label: "Rider Assigned", icon: "🏍️", color: "#FFD54F" },
        { id: 2, label: "Package Picked", icon: "📦", color: "#FFC107" },
        { id: 3, label: "Delivered", icon: "✅", color: "#4CAF50" },
    ];

    return (
        <section className="relative min-h-screen bg-[#FFFCF4] overflow-hidden">
            {/* Animated Background with City Grid */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 opacity-5">
                    <div
                        className="h-full w-full"
                        style={{
                            backgroundImage: `
                linear-gradient(#282828 1px, transparent 1px),
                linear-gradient(90deg, #282828 1px, transparent 1px)
              `,
                            backgroundSize: '30px 30px'
                        }}
                    />
                </div>

                {/* Animated Road Lines */}
                <svg className="absolute inset-0 w-full h-full opacity-10">
                    <motion.line
                        x1="0"
                        y1="50%"
                        x2="100%"
                        y2="50%"
                        stroke="#FFC107"
                        strokeWidth="2"
                        strokeDasharray="10 5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.line
                        x1="30%"
                        y1="0"
                        x2="30%"
                        y2="100%"
                        stroke="#FFD54F"
                        strokeWidth="2"
                        strokeDasharray="10 5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                    />
                </svg>
            </div>

            <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        {/* Live Orders Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-lg"
                        >
                            <div className="relative">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 w-3 h-3 bg-yellow-500 rounded-full animate-ping"></div>
                            </div>
                            <span className="text-sm font-semibold text-[#282828]">
                                Launching Soon! Stay Tuned 🚀
                            </span>
                        </motion.div>

                        <h1 className="text-5xl lg:text-7xl font-bold text-[#282828] leading-tight">
                            Delivery in
                            <motion.span
                                className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FFD54F] to-[#FFC107]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                30 Minutes
                            </motion.span>
                            or Less
                        </h1>

                        <p className="text-[18px] text-[#333333] max-w-lg">
                            Track your rider in real-time. From pickup to your doorstep,
                            we guarantee the fastest delivery in the city.
                        </p>

                        {/* Delivery Steps Progress */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg max-w-lg">
                            <div className="flex items-center justify-between mb-4">
                                {deliverySteps.map((step, index) => (
                                    <motion.div
                                        key={step.id}
                                        className="flex flex-col items-center"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <motion.div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 ${activeStep >= index ? 'bg-[#FFC107]' : 'bg-[#FFF8E1]'
                                                }`}
                                            animate={{
                                                scale: activeStep === index ? [1, 1.2, 1] : 1,
                                            }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {step.icon}
                                        </motion.div>
                                        <span className={`text-xs font-medium ${activeStep >= index ? 'text-[#282828]' : 'text-[#A1A1A1]'
                                            }`}>
                                            {step.label}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Progress Line */}
                            <div className="relative h-2 bg-[#FFF8E1] rounded-full overflow-hidden">
                                <motion.div
                                    className="absolute h-full bg-gradient-to-r from-[#FFD54F] to-[#FFC107]"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${(activeStep + 1) * 25}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <div className="relative">
                                <Button
                                    buttonText="Order Now"
                                    mode="solid"
                                    className="bg-[#FFC107] text-[#282828] px-8 py-4 rounded-full font-semibold hover:bg-[#FFD54F] hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                                >
                                    Order Now <ArrowRight className="w-5 h-5" />
                                </Button>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
                                    animate={{ opacity: 1, scale: 1, rotate: -12 }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                    className="absolute -top-2 -right-2 bg-gradient-to-r from-[#282828] to-[#333333] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                                >
                                    <span className="flex items-center gap-1">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                        </span>
                                        Coming Soon
                                    </span>
                                </motion.div>
                            </div>

                            <div className="relative">
                                <Button
                                    buttonText="Become a Rider"
                                    mode="outline"
                                    className="border-2 border-[#282828] text-[#282828] px-8 py-4 rounded-full font-semibold hover:bg-[#282828] hover:text-white transition-all duration-200"
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, rotate: 12 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 12 }}
                                    transition={{ delay: 0.6, type: "spring" }}
                                    className="absolute -top-2 -right-2 bg-gradient-to-r from-[#FFD54F] to-[#FFC107] text-[#282828] px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                                >
                                    <span className="flex items-center gap-1">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#282828] opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#282828]"></span>
                                        </span>
                                        Coming Soon
                                    </span>
                                </motion.div>
                            </div>
                        </div>

                        {/* Features */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="grid grid-cols-3 gap-4 pt-4 max-w-lg"
                        >
                            <div className="text-center">
                                <Clock className="w-8 h-8 text-[#FFC107] mx-auto mb-2" />
                                <span className="text-xs text-[#333333] font-medium">Fast Delivery</span>
                            </div>
                            <div className="text-center">
                                <Shield className="w-8 h-8 text-[#FFC107] mx-auto mb-2" />
                                <span className="text-xs text-[#333333] font-medium">Secure Package</span>
                            </div>
                            <div className="text-center">
                                <Navigation className="w-8 h-8 text-[#FFC107] mx-auto mb-2" />
                                <span className="text-xs text-[#333333] font-medium">Live Tracking</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Content - Live Map Animation */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[600px]"
                    >
                        <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
                            {/* Map Background */}
                            <div className="absolute inset-0 bg-[#FFF8E1]">
                                <div className="absolute inset-0 opacity-20">
                                    <Image
                                        src={HeroImage}
                                        alt="City Map"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            {/* Animated Delivery Route */}
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 600">
                                {/* Main Delivery Path */}
                                <motion.path
                                    d="M 100 100 Q 200 200 200 300 T 300 500"
                                    stroke="#FFC107"
                                    strokeWidth="4"
                                    fill="none"
                                    strokeDasharray="8 4"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />

                                {/* Rider Movement */}
                                <motion.g
                                    initial={{ offsetDistance: "0%" }}
                                    animate={{ offsetDistance: "100%" }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    style={{
                                        offsetPath: "path('M 100 100 Q 200 200 200 300 T 300 500')",
                                    }}
                                >
                                    <circle r="20" fill="#FFC107" className="drop-shadow-lg">
                                        <animate
                                            attributeName="r"
                                            values="20;25;20"
                                            dur="1s"
                                            repeatCount="indefinite"
                                        />
                                    </circle>
                                    <text
                                        x="0"
                                        y="5"
                                        textAnchor="middle"
                                        className="text-2xl"
                                        style={{ pointerEvents: "none" }}
                                    >
                                        🏍️
                                    </text>
                                </motion.g>

                                {/* Start Point */}
                                <g>
                                    <circle cx="100" cy="100" r="30" fill="#282828" opacity="0.1" />
                                    <circle cx="100" cy="100" r="20" fill="#282828" />
                                    <text x="100" y="105" textAnchor="middle" className="text-xl">🏪</text>
                                    <text x="100" y="60" textAnchor="middle" className="text-xs font-bold fill-[#282828]">
                                        PICKUP
                                    </text>
                                </g>

                                {/* End Point */}
                                <g>
                                    <circle cx="300" cy="500" r="30" fill="#4CAF50" opacity="0.2">
                                        <animate
                                            attributeName="r"
                                            values="30;40;30"
                                            dur="2s"
                                            repeatCount="indefinite"
                                        />
                                    </circle>
                                    <circle cx="300" cy="500" r="20" fill="#4CAF50" />
                                    <text x="300" y="505" textAnchor="middle" className="text-xl">🏠</text>
                                    <text x="300" y="550" textAnchor="middle" className="text-xs font-bold fill-[#282828]">
                                        DELIVERY
                                    </text>
                                </g>

                                {/* Other Riders */}
                                <motion.circle
                                    cx="150"
                                    cy="300"
                                    r="15"
                                    fill="#FFD54F"
                                    animate={{
                                        cx: [150, 250, 150],
                                        cy: [300, 350, 300],
                                    }}
                                    transition={{
                                        duration: 5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                                <motion.circle
                                    cx="250"
                                    cy="200"
                                    r="15"
                                    fill="#FFD54F"
                                    animate={{
                                        cx: [250, 150, 250],
                                        cy: [200, 250, 200],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 1,
                                    }}
                                />
                            </svg>

                            {/* Live Stats Overlay */}
                            <motion.div
                                className="absolute top-6 left-6 right-6"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div className="bg-white opacity-85 rounded-xl mt-[-10px] p-4 shadow-lg">
                                    <div className="flex items-center justify-between ">
                                        <span className="text-sm text-[#A1A1A1]">Rider: John D.</span>
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-sm font-semibold text-green-500">Online</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-[#A1A1A1]">ETA</p>
                                            <p className="text-lg font-bold text-[#282828]">12:45 PM</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#A1A1A1]">Distance</p>
                                            <p className="text-lg font-bold text-[#FFC107]">2.3 km</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Bottom Stats */}
                            <motion.div
                                className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-3"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <div className="bg-white rounded-lg p-3 text-center opacity-85">
                                    <p className="text-2xl font-bold text-[#282828]">3+</p>
                                    <p className="text-xs text-[#A1A1A1]">Riders Active</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-center opacity-85">
                                    <p className="text-2xl font-bold text-[#FFC107]">25min</p>
                                    <p className="text-xs text-[#A1A1A1]">Avg Delivery</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 text-center opacity-85">
                                    <p className="text-2xl font-bold text-green-500">98%</p>
                                    <p className="text-xs text-[#A1A1A1]">Success Rate</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;