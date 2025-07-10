"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Food Blogger",
        content: "Chowmate has completely transformed how I order food. The delivery is always on time, and the app is so easy to use. I love being able to track my order in real-time!",
        rating: 5,
        image: "/api/placeholder/80/80",
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Restaurant Owner",
        content: "As a restaurant owner, partnering with Chowmate has been a game-changer. Their platform has helped us reach more customers and increase our revenue significantly.",
        rating: 5,
        image: "/api/placeholder/80/80",
    },
    {
        id: 3,
        name: "Emily Davis",
        role: "Busy Professional",
        content: "The convenience of Chowmate is unmatched. Whether I need groceries or dinner after a long day, they always deliver quickly and reliably. Highly recommended!",
        rating: 5,
        image: "/api/placeholder/80/80",
    },
    {
        id: 4,
        name: "David Okonkwo",
        role: "Tech Entrepreneur",
        content: "I've tried many delivery services, but Chowmate stands out with their exceptional customer service and lightning-fast delivery times. They're my go-to for everything!",
        rating: 5,
        image: "/api/placeholder/80/80",
    },
    {
        id: 5,
        name: "Amara Nwosu",
        role: "Working Mother",
        content: "Chowmate saves me so much time! With three kids and a full-time job, being able to get groceries and meals delivered reliably has been a lifesaver for our family.",
        rating: 5,
        image: "/api/placeholder/80/80",
    },
];

export default function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const goToTestimonial = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <section className="py-20 lg:py-32 bg-[#FFFCF4] relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD54F] rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFC107] rounded-full blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl lg:text-5xl font-bold text-[#282828] mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-lg lg:text-xl text-[#333333] max-w-2xl mx-auto">
                        Don&#39;t just take our word for it - hear from our satisfied customers
                    </p>
                </motion.div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Quote Icon */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-[#FFD54F] to-[#FFC107] rounded-full flex items-center justify-center shadow-lg z-20">
                        <Quote className="w-8 h-8 text-[#282828]" />
                    </div>

                    {/* Testimonial Carousel */}
                    <div className="overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 pt-12"
                            >
                                <div className="flex flex-col items-center text-center">
                                    {/* Profile Image */}
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="mb-6"
                                    >
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD54F] to-[#FFC107] rounded-full blur-lg opacity-50"></div>
                                            <Image
                                                src={testimonials[currentIndex].image}
                                                alt={testimonials[currentIndex].name}
                                                width={100}
                                                height={100}
                                                className="relative w-24 h-24 lg:w-28 lg:h-28 rounded-full object-cover border-4 border-white shadow-xl"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Rating Stars */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex justify-center mb-6"
                                    >
                                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-6 h-6 text-yellow-400 fill-current"
                                            />
                                        ))}
                                    </motion.div>

                                    {/* Testimonial Content */}
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-lg lg:text-xl text-[#333333] italic mb-8 max-w-2xl leading-relaxed"
                                    >
                                        {testimonials[currentIndex].content.replace(/'/g, "&#39;")}
                                    </motion.p>

                                    {/* Customer Info */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <h4 className="text-xl lg:text-2xl font-semibold text-[#282828] mb-1">
                                            {testimonials[currentIndex].name}
                                        </h4>
                                        <p className="text-[#333333]">{testimonials[currentIndex].role}</p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevTestimonial}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200 group"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="w-6 h-6 text-[#282828] group-hover:text-[#FFC107] transition-colors" />
                    </button>

                    <button
                        onClick={nextTestimonial}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200 group"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="w-6 h-6 text-[#282828] group-hover:text-[#FFC107] transition-colors" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="flex justify-center items-center space-x-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToTestimonial(index)}
                                className={`transition-all duration-300 ${index === currentIndex
                                    ? "w-10 h-3 bg-gradient-to-r from-[#FFD54F] to-[#FFC107] rounded-full"
                                    : "w-3 h-3 bg-[#A1A1A1] rounded-full hover:bg-[#333333]"
                                    }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Additional Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16 text-center"
                >
                    <div className="flex flex-wrap justify-center items-center gap-8">
                        <div className="flex items-center space-x-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="w-10 h-10 bg-gray-300 rounded-full border-2 border-white"
                                    />
                                ))}
                            </div>
                            <span className="text-[#333333] font-medium">50,000+ Happy Customers</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <span className="text-gray-600 font-medium">4.9/5 Average Rating</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}