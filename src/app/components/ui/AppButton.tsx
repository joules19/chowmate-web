"use client";
import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
    buttonText?: string;
    children?: ReactNode;
    mode?: "solid" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

export function Button({
    buttonText,
    children,
    mode = "solid",
    size = "md",
    isLoading = false,
    className = "",
    ...props
}: ButtonProps) {
    const baseClasses = "font-semibold rounded-full transition-all duration-200 flex items-center justify-center";

    const modeClasses = {
        solid: "bg-[#FFC107] text-[#282828] hover:bg-[#FFD54F] hover:shadow-lg transform hover:scale-105",
        outline: "border-2 border-[#282828] text-[#282828] hover:bg-[#282828] hover:text-white",
        ghost: "text-[#282828] hover:bg-[#FFF8E1]",
    };

    const sizeClasses = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${baseClasses} ${modeClasses[mode]} ${sizeClasses[size]} ${className}`}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                </div>
            ) : (
                children || buttonText
            )}
        </motion.button>
    );
}