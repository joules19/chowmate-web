"use client";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Button } from "../../components/ui/AppButton";
import Navbar from "../../components/navigation/NavBar";

export default function ProductManagementTutorial() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 pt-28">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Link href="/knowledge-base">
              <Button
                mode="outline"
                className="border-gray-300 text-gray-600 hover:border-[#FFC107] hover:text-[#FFC107] transition-all duration-200 mb-4"
              >
                <ArrowLeftOutlined className="mr-2" />
                Back to Knowledge Base
              </Button>
            </Link>
          </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs bg-[#FFC107] text-gray-800 px-3 py-1 rounded-full font-medium">
                Vendor Tutorial
              </span>
              <span className="text-sm text-gray-500">15 minutes</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Product Management
            </h1>
            <p className="text-gray-600">
              Learn how to effectively manage your products on the Chowmate platform. 
              This tutorial covers adding products, setting prices, managing inventory, 
              and optimizing your product listings for better visibility.
            </p>
          </div>

          <div className="aspect-video bg-black">
            <video
              controls
              className="w-full h-full"
              poster="/api/placeholder/800/450"
            >
              <source
                src="https://chowmate-bucket.s3.us-east-1.amazonaws.com/vendor_product_management_tutorial.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              What you'll learn
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#FFC107] mr-2">•</span>
                How to add and organize your products
              </li>
              <li className="flex items-start">
                <span className="text-[#FFC107] mr-2">•</span>
                Setting competitive prices and managing discounts
              </li>
              <li className="flex items-start">
                <span className="text-[#FFC107] mr-2">•</span>
                Managing inventory and stock levels
              </li>
              <li className="flex items-start">
                <span className="text-[#FFC107] mr-2">•</span>
                Optimizing product descriptions and images
              </li>
              <li className="flex items-start">
                <span className="text-[#FFC107] mr-2">•</span>
                Understanding analytics and performance metrics
              </li>
            </ul>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}