"use client";
import { motion } from "framer-motion";
import { Apple, PlayCircle } from "lucide-react";

export default function CTASection() {
    return (
        <section className="py-20 lg:py-32 bg-gradient-to-br from-[#FFC107] via-[#FFD54F] to-[#FFC107] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <h2 className="text-3xl lg:text-5xl font-bold text-[#282828] mb-6">
                        Ready to Experience the Best Delivery Service?
                    </h2>
                    <p className="text-lg lg:text-xl text-[#282828]/90 mb-12 max-w-2xl mx-auto">
                        Join thousands of satisfied customers who trust Chowbro for their daily delivery needs.
                        Download our app today and get 20% off your first order!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <motion.a
                            href="https://apps.apple.com/us/app/chowmate/id6751146155"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#282828] text-white px-8 py-4 rounded-full flex items-center justify-center space-x-3 hover:bg-black transition-colors duration-200"
                        >
                            <Apple className="w-6 h-6" />
                            <div className="text-left">
                                <div className="text-xs">Download on the</div>
                                <div className="text-lg font-semibold">App Store</div>
                            </div>
                        </motion.a>

                        <motion.a
                            href="https://play.google.com/store/apps/details?id=com.chowmate.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#282828] text-white px-8 py-4 rounded-full flex items-center justify-center space-x-3 hover:bg-black transition-colors duration-200"
                        >
                            <PlayCircle className="w-6 h-6" />
                            <div className="text-left">
                                <div className="text-xs">Get it on</div>
                                <div className="text-lg font-semibold">Google Play</div>
                            </div>
                        </motion.a>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-[#282828]">
                        <div className="flex items-center space-x-2">
                            <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                                <span className="text-xl">🚀</span>
                            </div>
                            <span className="font-semibold">Fast Delivery</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                                <span className="text-xl">🔒</span>
                            </div>
                            <span className="font-semibold">Secure Payments</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                                <span className="text-xl">📍</span>
                            </div>
                            <span className="font-semibold">Live Tracking</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}