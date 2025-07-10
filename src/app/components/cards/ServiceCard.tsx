"use client";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface ServiceCardProps {
    icon: string;
    title: string;
    description: string;
    index: number;
}

export default function ServiceCard({ icon, title, description, index }: ServiceCardProps) {
    const colors = [
        "from-[#FFD54F] to-[#FFC107]",
        "from-[#FFC107] to-[#FFD54F]",
        "from-[#FFD54F] to-[#FFC107]",
    ];

    return (
        <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative group"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD54F] to-[#FFC107] rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-8 h-full">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#FFC107] rounded-full flex items-center justify-center text-[#282828] font-bold text-lg shadow-lg">
                    {index + 1}
                </div>

                {/* Icon Container */}
                <div className={`w-20 h-20 bg-gradient-to-r ${colors[index % colors.length]} rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300`}>
                    <Icon icon={icon} className="w-10 h-10 text-[#282828]" />
                </div>

                {/* Content */}
                <h3 className="text-xl lg:text-2xl font-bold text-[#282828] mb-4 group-hover:text-[#333333] transition-colors duration-300">
                    {title}
                </h3>
                <p className="text-[#333333] leading-relaxed">
                    {description}
                </p>

                {/* Decorative Element */}
                <div className="mt-6 flex items-center space-x-2">
                    <div className="h-1 w-8 bg-gradient-to-r from-[#FFD54F] to-[#FFC107] rounded-full"></div>
                    <div className="h-1 w-4 bg-[#FFF8E1] rounded-full"></div>
                    <div className="h-1 w-2 bg-[#FFF8E1] rounded-full"></div>
                </div>
            </div>
        </motion.div>
    );
}