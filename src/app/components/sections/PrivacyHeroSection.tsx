import { motion } from "framer-motion";
import { Shield, Clock } from "lucide-react";

const PrivacyHeroSection = () => {
    return (
        <section className="relative bg-gradient-to-br from-[#FFF8E1] to-[#FFFCF4] pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-hidden">
            {/* Professional Background Pattern */}
            <div className="absolute inset-0">
                {/* Geometric Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <div
                        className="h-full w-full"
                        style={{
                            backgroundImage: `
                                linear-gradient(#282828 1px, transparent 1px),
                                linear-gradient(90deg, #282828 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px'
                        }}
                    />
                </div>

                {/* Floating Privacy Icons */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Security Shield Icons */}
                    <motion.div
                        className="absolute top-1/4 left-[10%] w-8 h-8 text-[#FFC107] opacity-10"
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 5, 0]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Shield className="w-full h-full" />
                    </motion.div>

                    <motion.div
                        className="absolute top-1/3 right-[15%] w-6 h-6 text-[#FFC107] opacity-8"
                        animate={{
                            y: [0, 15, 0],
                            rotate: [0, -3, 0]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2
                        }}
                    >
                        <Shield className="w-full h-full" />
                    </motion.div>

                    <motion.div
                        className="absolute bottom-1/4 left-[20%] w-5 h-5 text-[#FFC107] opacity-6"
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, 8, 0]
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 4
                        }}
                    >
                        <Shield className="w-full h-full" />
                    </motion.div>

                    <motion.div
                        className="absolute top-2/3 right-[8%] w-7 h-7 text-[#FFC107] opacity-5"
                        animate={{
                            y: [0, 18, 0],
                            rotate: [0, -6, 0]
                        }}
                        transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                    >
                        <Shield className="w-full h-full" />
                    </motion.div>
                </div>

                {/* Subtle Hexagon Pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.02]" viewBox="0 0 400 400">
                    <defs>
                        <pattern id="hexagons" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                            <polygon
                                points="30,5 50,20 50,40 30,55 10,40 10,20"
                                fill="none"
                                stroke="#282828"
                                strokeWidth="1"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#hexagons)" />
                </svg>

                {/* Animated Data Flow Lines */}
                <svg className="absolute inset-0 w-full h-full opacity-5">
                    <defs>
                        <linearGradient id="dataFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#FFC107" stopOpacity="0" />
                            <stop offset="50%" stopColor="#FFC107" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#FFC107" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Horizontal flowing lines */}
                    <motion.line
                        x1="0"
                        y1="25%"
                        x2="100%"
                        y2="25%"
                        stroke="url(#dataFlow)"
                        strokeWidth="2"
                        strokeDasharray="100 50"
                        initial={{ strokeDashoffset: 150 }}
                        animate={{ strokeDashoffset: -150 }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />

                    <motion.line
                        x1="0"
                        y1="75%"
                        x2="100%"
                        y2="75%"
                        stroke="url(#dataFlow)"
                        strokeWidth="2"
                        strokeDasharray="80 40"
                        initial={{ strokeDashoffset: 120 }}
                        animate={{ strokeDashoffset: -120 }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "linear",
                            delay: 2
                        }}
                    />

                    {/* Vertical flowing lines */}
                    <motion.line
                        x1="20%"
                        y1="0"
                        x2="20%"
                        y2="100%"
                        stroke="url(#dataFlow)"
                        strokeWidth="1.5"
                        strokeDasharray="60 30"
                        initial={{ strokeDashoffset: 90 }}
                        animate={{ strokeDashoffset: -90 }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear",
                            delay: 1
                        }}
                    />

                    <motion.line
                        x1="80%"
                        y1="0"
                        x2="80%"
                        y2="100%"
                        stroke="url(#dataFlow)"
                        strokeWidth="1.5"
                        strokeDasharray="70 35"
                        initial={{ strokeDashoffset: 105 }}
                        animate={{ strokeDashoffset: -105 }}
                        transition={{
                            duration: 9,
                            repeat: Infinity,
                            ease: "linear",
                            delay: 3
                        }}
                    />
                </svg>

                {/* Privacy Lock Symbols */}
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute top-[15%] left-[5%] w-4 h-4 bg-[#FFC107] opacity-8 rounded-sm"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.08, 0.15, 0.08]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    <motion.div
                        className="absolute top-[60%] right-[10%] w-3 h-3 bg-[#FFC107] opacity-6 rounded-full"
                        animate={{
                            scale: [1, 1.4, 1],
                            opacity: [0.06, 0.12, 0.06]
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2
                        }}
                    />

                    <motion.div
                        className="absolute bottom-[20%] left-[15%] w-2 h-2 bg-[#FFC107] opacity-10 rounded-full"
                        animate={{
                            scale: [1, 1.6, 1],
                            opacity: [0.1, 0.2, 0.1]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                    />
                </div>

                {/* Radial Privacy Waves */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                        className="w-96 h-96 border border-[#FFC107] rounded-full opacity-[0.03]"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.03, 0.08, 0.03]
                        }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    <motion.div
                        className="absolute inset-8 border border-[#FFC107] rounded-full opacity-[0.04]"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.04, 0.1, 0.04]
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2
                        }}
                    />

                    <motion.div
                        className="absolute inset-16 border border-[#FFC107] rounded-full opacity-[0.05]"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.05, 0.12, 0.05]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 4
                        }}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-5xl mx-auto"
                >
                    <div className="flex items-center justify-center mb-4 sm:mb-6">
                        <motion.div
                            className="bg-[#FFC107] p-3 sm:p-4 rounded-full shadow-lg"
                            aria-hidden="true"
                            animate={{
                                boxShadow: [
                                    "0 10px 25px rgba(255, 193, 7, 0.2)",
                                    "0 15px 35px rgba(255, 193, 7, 0.3)",
                                    "0 10px 25px rgba(255, 193, 7, 0.2)"
                                ]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-[#282828]" />
                        </motion.div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#282828] mb-4 sm:mb-6 leading-tight">
                        Privacy <span className="text-[#FFC107]">Policy</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-[#333333] mb-6 sm:mb-8 leading-relaxed max-w-4xl mx-auto">
                        Your privacy matters to us. Learn how we protect, use, and manage your personal information
                        to provide you with the best delivery experience.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-[#666666]">
                        <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                            <span>Last updated: July 2025</span>
                        </span>
                        <span className="hidden sm:inline" aria-hidden="true">•</span>
                        <span>Effective immediately</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PrivacyHeroSection;