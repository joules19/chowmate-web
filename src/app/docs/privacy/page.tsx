"use client";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, Users, ChevronDown } from "lucide-react";
import { useState } from "react";
import Navbar from "../../components/navigation/NavBar";
import SimpleFooter from "../../components/ui/SimpleFooter";
import PrivacyHeroSection from "../../components/sections/PrivacyHeroSection";

interface FAQ {
    question: string;
    answer: string;
}

const PrivacyPage = () => {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    const privacyHighlights = [
        {
            icon: Shield,
            title: "Data Protection",
            description: "Your personal information is encrypted and securely stored with industry-standard protection."
        },
        {
            icon: Lock,
            title: "Secure Transactions",
            description: "All payment and order data is processed through secure, encrypted channels."
        },
        {
            icon: Eye,
            title: "Transparent Practices",
            description: "We clearly explain how we collect, use, and protect your personal information."
        },
        {
            icon: Users,
            title: "User Control",
            description: "You have complete control over your data with easy access, correction, and deletion options."
        }
    ];

    const faqs: FAQ[] = [
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
            answer: "Service fees help us maintain high-quality operations including: maintaining our technology platform and real-time tracking system, providing 24/7 customer support, processing secure payments, ensuring rider safety with insurance coverage, and investing in faster delivery infrastructure."
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

    return (
        <>
            <Navbar />

            {/* Hero Section */}
            <PrivacyHeroSection />

            {/* Privacy Highlights */}
            <section className="py-12 sm:py-16 bg-white" aria-labelledby="privacy-commitments">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8 sm:mb-12"
                    >
                        <h2 id="privacy-commitments" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#282828] mb-3 sm:mb-4">
                            Our Privacy Commitments
                        </h2>
                        <p className="text-base sm:text-lg text-[#666666] max-w-3xl mx-auto">
                            We&apos;re committed to maintaining the highest standards of data protection and transparency.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {privacyHighlights.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="text-center p-4 sm:p-6 rounded-2xl bg-[#FFF8E1] hover:shadow-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-[#FFC107] focus-within:ring-offset-2"
                                    tabIndex={0}
                                >
                                    <div className="bg-[#FFC107] p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center" aria-hidden="true">
                                        <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-[#282828]" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-[#282828] mb-2 sm:mb-3">{item.title}</h3>
                                    <p className="text-sm sm:text-base text-[#666666] leading-relaxed">{item.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Privacy Policy Content */}
            <section className="py-12 sm:py-16 bg-[#FFFCF4]" aria-labelledby="privacy-policy-content">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 lg:p-12"
                        >
                            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">

                                {/* Introduction */}
                                <div className="mb-8 sm:mb-12">
                                    <h2 id="introduction" className="text-2xl sm:text-3xl font-bold text-[#282828] mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                        <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-[#FFC107] flex-shrink-0" aria-hidden="true" />
                                        <span>Introduction</span>
                                    </h2>
                                    <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl mb-4 sm:mb-6">
                                        <p className="text-sm sm:text-base text-[#333333] leading-relaxed">
                                            Chowmate Technologies Limited (&quot;Chowmate&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates a comprehensive logistics platform connecting users with local restaurants and vendors for seamless food delivery services (&quot;Platform&quot;). We believe in complete transparency regarding how we handle your personal data. This Privacy Policy outlines our data collection, usage, and protection practices to help you make informed decisions about using our services.
                                        </p>
                                    </div>
                                    <p className="text-sm sm:text-base text-[#666666]">
                                        For questions about this policy, please contact us at{" "}
                                        <a
                                            href="mailto:privacy@chowmate.app"
                                            className="text-[#FFC107] hover:underline focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:ring-offset-2 rounded"
                                        >
                                            privacy@chowmate.app
                                        </a>.
                                    </p>
                                </div>

                                {/* Policy Updates */}
                                <div className="mb-8 sm:mb-12">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">1. Policy Updates & Notifications</h3>
                                    <p className="text-sm sm:text-base text-[#666666] mb-3 sm:mb-4">
                                        We review this Privacy Policy annually and whenever we introduce new features or services. As our technology evolves and data protection laws change, we may update our practices. When significant changes occur, we will:
                                    </p>
                                    <ul className="list-disc pl-4 sm:pl-6 text-sm sm:text-base text-[#666666] space-y-1 sm:space-y-2">
                                        <li>Notify you through our app and email</li>
                                        <li>Post the updated policy on our website and mobile application</li>
                                        <li>Provide a summary of key changes</li>
                                        <li>Give you time to review before the changes take effect</li>
                                    </ul>
                                </div>

                                {/* Data Collection */}
                                <div className="mb-8 sm:mb-12">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">2. Information We Collect</h3>
                                    <p className="text-sm sm:text-base text-[#666666] mb-3 sm:mb-4">
                                        We collect only the information necessary to provide exceptional delivery services. Here&apos;s when and how we gather your data:
                                    </p>

                                    <div className="space-y-4 sm:space-y-6">
                                        <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl">
                                            <h4 className="text-lg sm:text-xl font-semibold text-[#282828] mb-2 sm:mb-3">Account Information</h4>
                                            <ul className="list-disc pl-4 sm:pl-6 text-sm sm:text-base text-[#666666] space-y-1 sm:space-y-2">
                                                <li>Name, phone number, and email address during registration</li>
                                                <li>Delivery addresses for order fulfillment</li>
                                                {/* <li>Profile preferences and dietary restrictions</li> */}
                                                <li>Payment method details for transaction processing</li>
                                            </ul>
                                        </div>

                                        <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl">
                                            <h4 className="text-lg sm:text-xl font-semibold text-[#282828] mb-2 sm:mb-3">Service Usage Data</h4>
                                            <ul className="list-disc pl-4 sm:pl-6 text-sm sm:text-base text-[#666666] space-y-1 sm:space-y-2">
                                                <li>Order history and restaurant preferences</li>
                                                <li>App interaction patterns and feature usage</li>
                                                <li>Customer service communications and feedback</li>
                                                <li>Promotional campaign participation</li>
                                            </ul>
                                        </div>

                                        <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl">
                                            <h4 className="text-lg sm:text-xl font-semibold text-[#282828] mb-2 sm:mb-3">Device & Technical Information</h4>
                                            <ul className="list-disc pl-4 sm:pl-6 text-sm sm:text-base text-[#666666] space-y-1 sm:space-y-2">
                                                <li>Device type, operating system, and app version</li>
                                                <li>IP address and network connection details</li>
                                                <li>Location data for delivery services (with permission)</li>
                                                <li>Usage analytics to improve app performance</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Data Usage */}
                                <div className="mb-8 sm:mb-12">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">3. How We Use Your Information</h3>
                                    <p className="text-sm sm:text-base text-[#666666] mb-4 sm:mb-6">
                                        Your information helps us deliver reliable, personalized services while maintaining the highest security standards:
                                    </p>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                        <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-2 sm:mb-3">Core Services</h4>
                                            <ul className="text-sm sm:text-base text-[#666666] space-y-1 sm:space-y-2">
                                                <li>• Process and fulfill your orders</li>
                                                <li>• Connect you with nearby restaurants</li>
                                                <li>• Provide real-time delivery tracking</li>
                                                <li>• Process secure payments</li>
                                            </ul>
                                        </div>
                                        <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-2 sm:mb-3">Enhanced Experience</h4>
                                            <ul className="text-sm sm:text-base text-[#666666] space-y-1 sm:space-y-2">
                                                <li>• Personalize restaurant recommendations</li>
                                                <li>• Send order updates and notifications</li>
                                                <li>• Provide customer support assistance</li>
                                                <li>• Offer relevant promotions and deals</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Location Services */}
                                <div className="mb-8 sm:mb-12">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">4. Location Services</h3>
                                    <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl">
                                        <p className="text-sm sm:text-base text-[#666666] mb-3 sm:mb-4">
                                            Location access is essential for our delivery services. We use your location to:
                                        </p>
                                        <ul className="list-disc pl-4 sm:pl-6 text-sm sm:text-base text-[#666666] space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                                            <li>Show restaurants available in your area</li>
                                            <li>Calculate accurate delivery times and fees</li>
                                            <li>Enable real-time order tracking</li>
                                            <li>Optimize delivery routes for faster service</li>
                                        </ul>
                                        <p className="text-xs sm:text-sm text-[#666666]">
                                            You can manage location permissions in your device settings. Note that disabling location services may limit app functionality.
                                        </p>
                                    </div>
                                </div>

                                {/* Data Sharing */}
                                <div className="mb-8 sm:mb-12">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">5. Information Sharing</h3>
                                    <p className="text-sm sm:text-base text-[#666666] mb-3 sm:mb-4">
                                        We never sell your personal information. We only share data when necessary to provide our services or comply with legal requirements:
                                    </p>

                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="border-l-4 border-[#FFC107] pl-4 sm:pl-6">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-1 sm:mb-2">Service Partners</h4>
                                            <p className="text-sm sm:text-base text-[#666666]">Restaurant partners receive order details to prepare your food. Delivery riders get your address and contact info for delivery coordination.</p>
                                        </div>
                                        <div className="border-l-4 border-[#FFC107] pl-4 sm:pl-6">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-1 sm:mb-2">Payment Processors</h4>
                                            <p className="text-sm sm:text-base text-[#666666]">Secure payment gateways process transactions while maintaining PCI DSS compliance standards.</p>
                                        </div>
                                        <div className="border-l-4 border-[#FFC107] pl-4 sm:pl-6">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-1 sm:mb-2">Legal Requirements</h4>
                                            <p className="text-sm sm:text-base text-[#666666]">We may disclose information when required by law, to protect user safety, or prevent fraudulent activities.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Data Security */}
                                <div className="mb-8 sm:mb-12">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">6. Data Security & Storage</h3>
                                    <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl">
                                        <p className="text-sm sm:text-base text-[#666666] mb-3 sm:mb-4">
                                            We employ industry-leading security measures to protect your information:
                                        </p>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-1 sm:mb-2">Technical Safeguards</h4>
                                                <ul className="text-sm sm:text-base text-[#666666] space-y-0 sm:space-y-1">
                                                    <li>• End-to-end encryption</li>
                                                    <li>• Secure cloud infrastructure</li>
                                                    <li>• Regular security audits</li>
                                                    {/* <li>• Multi-factor authentication</li> */}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-1 sm:mb-2">Access Controls</h4>
                                                <ul className="text-sm sm:text-base text-[#666666] space-y-0 sm:space-y-1">
                                                    <li>• Role-based data access</li>
                                                    <li>• Employee security training</li>
                                                    <li>• Activity monitoring</li>
                                                    <li>• Data anonymization</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Your Rights */}
                                <div className="mb-8 sm:mb-12">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">7. Your Data Rights</h3>
                                    <p className="text-sm sm:text-base text-[#666666] mb-4 sm:mb-6">
                                        You have complete control over your personal information. You can:
                                    </p>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                        <div className="space-y-3 sm:space-y-4">
                                            <div className="flex items-start gap-2 sm:gap-3">
                                                <div className="bg-[#FFC107] p-1.5 sm:p-2 rounded-full mt-1 flex-shrink-0" aria-hidden="true">
                                                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-[#282828]" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-[#282828] text-sm sm:text-base">Access Your Data</h4>
                                                    <p className="text-[#666666] text-xs sm:text-sm">View all personal information we have about you</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2 sm:gap-3">
                                                <div className="bg-[#FFC107] p-1.5 sm:p-2 rounded-full mt-1 flex-shrink-0" aria-hidden="true">
                                                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-[#282828]" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-[#282828] text-sm sm:text-base">Update Information</h4>
                                                    <p className="text-[#666666] text-xs sm:text-sm">Correct or modify your personal details</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3 sm:space-y-4">
                                            <div className="flex items-start gap-2 sm:gap-3">
                                                <div className="bg-[#FFC107] p-1.5 sm:p-2 rounded-full mt-1 flex-shrink-0" aria-hidden="true">
                                                    <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-[#282828]" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-[#282828] text-sm sm:text-base">Delete Your Account</h4>
                                                    <p className="text-[#666666] text-xs sm:text-sm">Remove your information from our systems</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2 sm:gap-3">
                                                <div className="bg-[#FFC107] p-1.5 sm:p-2 rounded-full mt-1 flex-shrink-0" aria-hidden="true">
                                                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-[#282828]" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-[#282828] text-sm sm:text-base">Data Portability</h4>
                                                    <p className="text-[#666666] text-xs sm:text-sm">Export your data in a portable format</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-primary-50 rounded-xl">
                                        <p className="text-[#666666] text-xs sm:text-sm">
                                            To exercise these rights, contact us at{" "}
                                            <a
                                                href="mailto:privacy@chowmate.app"
                                                className="text-[#FFC107] hover:underline focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:ring-offset-2 rounded"
                                            >
                                                privacy@chowmate.app
                                            </a> or use our in-app data request feature.
                                        </p>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="mb-8 sm:mb-12">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">8. Contact Us</h3>
                                    <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl">
                                        <p className="text-sm sm:text-base text-[#666666] mb-3 sm:mb-4">
                                            Questions about this Privacy Policy or how we handle your data? We&apos;re here to help:
                                        </p>
                                        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-[#666666]">
                                            <p><strong>Email:</strong>{" "}
                                                <a
                                                    href="mailto:privacy@chowmate.app"
                                                    className="text-[#FFC107] hover:underline focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:ring-offset-2 rounded"
                                                >
                                                    privacy@chowmate.app
                                                </a>
                                            </p>
                                            <p><strong>Phone:</strong>{" "}
                                                <a
                                                    href="tel:+2349038073651"
                                                    className="text-[#FFC107] hover:underline focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:ring-offset-2 rounded"
                                                >
                                                    +234 903 8073 651
                                                </a>
                                            </p>
                                            {/* <p><strong>Address:</strong> 8, Trinity Street, Phase II, Mowe, Ogun State, Nigeria</p> */}
                                            {/* <p><strong>Data Protection Officer:</strong>{" "}
                                                <a
                                                    href="mailto:dpo@chowmate.app"
                                                    className="text-[#FFC107] hover:underline focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:ring-offset-2 rounded"
                                                >
                                                    dpo@chowmate.app
                                                </a>
                                            </p> */}
                                        </div>
                                    </div>
                                </div>

                                {/* Legal Compliance */}
                                <div className="mb-6 sm:mb-8">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">9. Legal Compliance</h3>
                                    <p className="text-sm sm:text-base text-[#666666] mb-3 sm:mb-4">
                                        This Privacy Policy complies with the Nigeria Data Protection Regulation (NDPR) 2019, Nigeria Data Protection Act (NDPA) 2023, and other applicable data protection laws in Nigeria.
                                    </p>
                                    <div className="text-xs sm:text-sm text-[#666666] bg-gray-50 p-3 sm:p-4 rounded-xl">
                                        <p><strong>Last Updated:</strong> July 2025 | <strong>Governing Law:</strong> Federal Republic of Nigeria</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 sm:py-16 bg-white" aria-labelledby="faq-section">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8 sm:mb-12"
                    >
                        <h2 id="faq-section" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#282828] mb-3 sm:mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-base sm:text-lg text-[#666666] max-w-3xl mx-auto">
                            Got questions? We&apos;ve got answers. Find everything you need to know about Chowmate.
                        </p>
                    </motion.div>

                    <div className="max-w-5xl mx-auto">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="mb-3 sm:mb-4"
                            >
                                <div
                                    className={`border-2 rounded-xl sm:rounded-2xl transition-all duration-300 ${expandedFaq === index
                                        ? 'border-[#FFC107] bg-[#FFF8E1]'
                                        : 'border-gray-200 bg-white hover:border-[#FFD54F]'
                                        }`}
                                >
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full p-4 sm:p-6 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:ring-offset-2 rounded-xl sm:rounded-2xl"
                                        aria-expanded={expandedFaq === index}
                                        aria-controls={`faq-answer-${index}`}
                                        id={`faq-question-${index}`}
                                    >
                                        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-[#282828] pr-3 sm:pr-4 leading-tight">
                                            {faq.question}
                                        </h3>
                                        <div
                                            className={`transform transition-transform duration-300 flex-shrink-0 ${expandedFaq === index ? 'rotate-180' : ''
                                                }`}
                                            aria-hidden="true"
                                        >
                                            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFC107]" />
                                        </div>
                                    </button>

                                    <motion.div
                                        initial={false}
                                        animate={{
                                            height: expandedFaq === index ? 'auto' : 0,
                                            opacity: expandedFaq === index ? 1 : 0
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                        id={`faq-answer-${index}`}
                                        aria-labelledby={`faq-question-${index}`}
                                        role="region"
                                    >
                                        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                                            <div className="h-px bg-[#FFC107] mb-3 sm:mb-4 opacity-30" aria-hidden="true"></div>
                                            <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-center mt-8 sm:mt-12"
                    >
                        <div className="bg-[#FFF8E1] rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
                            <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">
                                Still Have Questions?
                            </h3>
                            <p className="text-sm sm:text-base text-[#666666] mb-4 sm:mb-6">
                                Our support team is here to help you with any privacy-related concerns.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                                <a
                                    href="mailto:support@chowmate.app"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-[#FFC107] text-[#282828] font-semibold rounded-full hover:bg-[#FFD54F] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:ring-offset-2"
                                >
                                    Contact Support
                                </a>
                                <a
                                    href="tel:+2349038073651"
                                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#282828] text-[#282828] font-semibold rounded-full hover:bg-[#282828] hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#282828] focus:ring-offset-2"
                                >
                                    Call Us
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <SimpleFooter />
        </>
    );
};

export default PrivacyPage;