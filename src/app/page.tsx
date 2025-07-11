"use client";
import ServiceCard from "./components/cards/ServiceCard";
import FaqSection from "./components/ui/FaqSection";
import Navbar from "./components/navigation/NavBar";
import { motion } from "framer-motion";
import StatsSection from "./components/sections/StatsSection";
import Footer from "./components/ui/Footer";
import TestimonialsSection from "./components/sections/TestimonialSection";
import CTASection from "./components/sections/CTASection";
import HeroSection from "./components/sections/HeroSection";
import SimpleFooter from "./components/ui/SimpleFooter";

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
    answer: "Chowmate is a tech-driven logistics company that connects food vendors, restaurants, and consumers through our efficient delivery network. We provide real-time tracking, professional dispatch riders, and guaranteed delivery times to ensure your favorite meals arrive fresh and on time. Our platform makes it easy for restaurants to expand their reach while offering customers a seamless ordering experience."
  },
  {
    question: "What is the service fee?",
    answer: "The service fee is a small charge that helps cover operational costs including technology infrastructure, customer support, payment processing, and platform maintenance. This fee typically ranges from ₦100-₦300 depending on your order size and location. The service fee ensures we can continue providing reliable delivery services, real-time tracking, and 24/7 customer support."
  },
  {
    question: "Why do we charge a service fee?",
    answer: "Service fees help us maintain high-quality operations including: maintaining our technology platform and real-time tracking system, providing 24/7 customer support, processing secure payments, ensuring rider safety with insurance coverage, and investing in faster delivery infrastructure. "
  },
  {
    question: "How do I create an account on Chowmate?",
    answer: "Creating an account is quick and easy! Simply download the Chowmate app from the App Store or Google Play, click 'Sign Up' and enter your phone number, verify with the OTP code sent to your phone, add your delivery address and payment method, and you're ready to start ordering! You can also sign up on our website at www.chowmate.app. The entire process takes less than 2 minutes."
  },
  {
    question: "What locations do we currently deliver to?",
    answer: "Chowmate currently operates in Mowe environs including Redemption Camp for now. We're rapidly expanding to new areas! To check if we deliver to your location, simply enter your address in the app. If we don't cover your area yet, you can join our waitlist to be notified when we launch there."
  },
  {
    question: "How long does delivery usually take?",
    answer: "Our average delivery time is 25-35 minutes within our coverage areas. Delivery times may vary based on: restaurant preparation time, distance from restaurant to delivery address, weather conditions, and peak hours (lunch 12-2pm, dinner 7-9pm). You'll see an estimated delivery time before placing your order, and can track your rider in real-time once your food is picked up."
  },
  {
    question: "What if my order is wrong or missing items?",
    answer: "We take order accuracy seriously! If you receive an incorrect or incomplete order: Report it immediately through the app's 'Order Help' section, Take photos of what you received, Our support team will investigate with the restaurant, You'll receive a refund or credit within 24 hours for missing/incorrect items. For the fastest resolution, please report issues within 30 minutes of delivery."
  },
  {
    question: "How do I become a Chowmate delivery rider?",
    answer: "Join our growing team of delivery partners! Requirements include: Valid form of identification, and vehicle documents(If applicable), Smartphone with data plan, Age 18 or above, Pass our background check. Benefits include flexible working hours, competitive earnings (₦300-500 per delivery), weekly payments, and insurance coverage."
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
      {/* <TestimonialsSection /> */}

      {/* FAQ Section */}
      <FaqSection faqs={faqs} />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <SimpleFooter />
    </>
  );
}