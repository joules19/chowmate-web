"use client";

import { Button } from "./components/ui/Button";
import HeroImage from "./assets/images/Hero-Img.png";
import Image from "next/image";
import { MapIcon } from "lucide-react";
import { Icon } from "@iconify/react";
import ServiceCard from "./components/cards/ServiceCard";
import FaqSection from "./components/ui/FaqSection";
import Navbar from "./components/navigation/NavBar";

const services = [
  {
    icon: "bytesize:location",
    title: "Request a delivery",
    description: "Easily request a delivery and have your packages picked up and delivered quickly, safely, and hassle-free."
  },
  {
    icon: "mdi:bike-fast",
    title: "Chowbro collects package",
    description: "Chowbro carefully handles your package, guaranteeing a seamless and secure pickup experience from start to finish. "
  },
  {
    icon: "ph:package-light",
    title: "Package is delivered",
    description: "Our package arrives safely at its destination, and our dedicated support team is always available to assist with any questions or concerns."
  }
];

const faqs = [
  {
    question: "What is Chowbro?",
    answer: "Chowbro is a tech-driven company that connects vendors and consumers through efficient logistics solutions. It enables food vendors to deliver meals effortlessly while offering customers a seamless way to order from their favorite restaurants in town."
  },
  {
    question: "What is service fee?",
    answer: "We cover a wide range of areas. Please check our service map on the website for detailed coverage information."
  },
  {
    question: "Why do we charge service fee?",
    answer: "Chowbro is a tech-driven company that connects vendors and consumers through efficient logistics solutions. It enables food vendors to deliver meals effortlessly while offering customers a seamless way to order from their favorite restaurants in town."
  },
  {
    question: "How do I create an account on Chowbro?",
    answer: "We cover a wide range of areas. Please check our service map on the website for detailed coverage information."
  },
  {
    question: "What locations do we currently deliver to?",
    answer: "You can track your package in real-time through our app or website using the tracking number provided."
  },
  {
    question: "How do I delete a saved card?",
    answer: "Chowbro is a tech-driven company that connects vendors and consumers through efficient logistics solutions. It enables food vendors to deliver meals effortlessly while offering customers a seamless way to order from their favorite restaurants in town."
  }
];

export default function Home() {
  return (
    <>
      <Navbar /> {/* Use the Client Component */}

      {/* Hero section */}
      <div className="container mx-auto p-4 flex gap-20">
        <div className="flex flex-col flex-1 pl-14 pt-20">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <h1 className="text-[48px] font-semibold">Welcome to Chowbro!</h1>
              <h1 className="text-[50px] font-semibold mt-[-8px]">Food delivery and more</h1>
              <div>
                <p className="text-[16px] font-normal mt">
                  Groceries, shops, pharmacies, anything—you’re in the right place!
                </p>
              </div>
            </div>

            <Button buttonText="Explore Now" mode="solid" className="mt-6 !w-[144px] !h-[56px] !bg-black !text-white !hover:text-dark-1" />
          </div>
        </div>

        <div className="hidden lg:flex flex-col flex-1">
          <Image className="lg:w-[569px] lg:h-[500px]" src={HeroImage} alt="hero" />
        </div>
      </div>

      {/* Services section */}
      <div className="container mx-auto px-16 flex flex-col gap-[70px]">
        <div className="flex flex-col text-center">
          <h2 className="text-[36px] font-semibold">How we work?</h2>
          <p className="text-[16px] font-normal mt-4">
            We try to make our service fast and convenient for you!
          </p>
        </div>

        <div className="flex flex-row gap-10">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>

      <FaqSection faqs={faqs} />
    </>
  );
}