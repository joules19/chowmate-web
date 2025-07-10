"use client";
import { Button } from "./components/ui/Button";
import HeroImage from "./assets/images/Hero-Img.png";
import Image from "next/image";
import ServiceCard from "./components/cards/ServiceCard";
import FaqSection from "./components/ui/FaqSection";
import Navbar from "./components/navigation/NavBar";
import { motion } from "framer-motion";
import StatsSection from "./components/sections/StatsSection";
import Footer from "./components/ui/Footer";
import TestimonialsSection from "./components/sections/TestimonialSection";
import CTASection from "./components/sections/CTASection";
import HeroSection from "./components/sections/HeroSection";

const services = [
  {
    icon: "bytesize:location",
    title: "Request a delivery",
    description: "Easily request a delivery and have your packages picked up and delivered quickly, safely, and hassle-free."
  },
  {
    icon: "mdi:bike-fast",
    title: "Chowmate collects package",
    description: "Chowmate carefully handles your package, guaranteeing a seamless and secure pickup experience from start to finish."
  },
  {
    icon: "ph:package-light",
    title: "Package is delivered",
    description: "Our package arrives safely at its destination, and our dedicated support team is always available to assist with any questions or concerns."
  }
];

const faqs = [
  {
    question: "What is Chowmate?",
    answer: "Chowmate is a tech-driven company that connects vendors and consumers through efficient logistics solutions. It enables food vendors to deliver meals effortlessly while offering customers a seamless way to order from their favorite restaurants in town."
  },
  {
    question: "What is service fee?",
    answer: "We cover a wide range of areas. Please check our service map on the website for detailed coverage information."
  },
  {
    question: "Why do we charge service fee?",
    answer: "Chowmate is a tech-driven company that connects vendors and consumers through efficient logistics solutions. It enables food vendors to deliver meals effortlessly while offering customers a seamless way to order from their favorite restaurants in town."
  },
  {
    question: "How do I create an account on Chowmate?",
    answer: "We cover a wide range of areas. Please check our service map on the website for detailed coverage information."
  },
  {
    question: "What locations do we currently deliver to?",
    answer: "You can track your package in real-time through our app or website using the tracking number provided."
  },
  {
    question: "How do I delete a saved card?",
    answer: "Chowmate is a tech-driven company that connects vendors and consumers through efficient logistics solutions. It enables food vendors to deliver meals effortlessly while offering customers a seamless way to order from their favorite restaurants in town."
  }
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero section with animations */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Services section with enhanced design */}
      <section className="py-20 lg:py-32 bg-[#FFF8E1]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-[#282828] mb-4">
              How we work?
            </h2>
            <p className="text-lg lg:text-xl text-[#333333] max-w-2xl mx-auto">
              We try to make our service fast and convenient for you!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  index={index}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FaqSection faqs={faqs} />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </>
  );
}