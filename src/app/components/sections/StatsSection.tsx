"use client";
import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
    { value: 10, suffix: "+", label: "Happy Customers" },
    { value: 3, suffix: "+", label: "Partner Restaurants" },
    { value: 98, suffix: "%", label: "On-Time Delivery" },
    { value: 24, suffix: "/7", label: "Customer Support" },
];

export default function StatsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (isInView && !hasAnimated) {
            setHasAnimated(true);
        }
    }, [isInView, hasAnimated]);

    return (
        <section className="py-20 bg-gradient-to-r from-[#FFD54F] to-[#FFC107] text-[#282828]" ref={ref}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="text-4xl lg:text-5xl font-bold mb-2">
                                {hasAnimated && <Counter value={stat.value} />}
                                {stat.suffix}
                            </div>
                            <div className="text-lg lg:text-xl text-[#282828]/90">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Counter({ value }: { value: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 2000;
        const steps = 50;
        const increment = value / steps;
        const stepDuration = duration / steps;

        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [value]);

    return <>{count.toLocaleString()}</>;
}