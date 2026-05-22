"use client";
import { motion } from "framer-motion";
import { Scale, FileText, AlertCircle, UserCheck, CreditCard, Package } from "lucide-react";
import { useState } from "react";
import Navbar from "../../components/navigation/NavBar";
import SimpleFooter from "../../components/ui/SimpleFooter";
import TermsHeroSection from "../../components/sections/TermsHeroSection";

const TermsPage = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const termsHighlights = [
        {
            icon: UserCheck,
            title: "User Agreement",
            description: "Clear guidelines on account creation, user responsibilities, and platform usage."
        },
        {
            icon: Package,
            title: "Service Delivery",
            description: "How we handle orders, deliveries, and ensure quality service for every meal."
        },
        {
            icon: CreditCard,
            title: "Payment Terms",
            description: "Transparent pricing, payment methods, and refund policies for your protection."
        },
        {
            icon: Scale,
            title: "Fair Usage",
            description: "Rules that protect both users and our community of riders and vendors."
        }
    ];

    return (
        <>
            <Navbar />

            {/* Hero Section */}
            <TermsHeroSection />

            {/* Terms Highlights */}
            <section className="py-12 sm:py-16 bg-white" aria-labelledby="terms-commitments">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8 sm:mb-12"
                    >
                        <h2 id="terms-commitments" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#282828] mb-3 sm:mb-4">
                            What You Need to Know
                        </h2>
                        <p className="text-base sm:text-lg text-[#666666] max-w-3xl mx-auto">
                            We've made our terms clear and straightforward. Here's what matters most.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {termsHighlights.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="text-center p-4 sm:p-6 rounded-2xl bg-[#FFF8E1] hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="bg-[#FFC107] p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
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

            {/* Terms Content */}
            <section className="py-12 sm:py-16 bg-[#FFFCF4]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 lg:p-12"
                        >
                            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">

                                {/* Welcome */}
                                <div className="mb-8 sm:mb-12">
                                    <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl mb-4 sm:mb-6">
                                        <p className="text-sm sm:text-base text-[#333333] leading-relaxed">
                                            Welcome to Chowmate Technologies Limited (&quot;Chowmate,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
                                            We operate a food delivery platform that connects hungry customers with local restaurants and dedicated riders.
                                            By accessing or using our website and mobile application (collectively, the &quot;Platform&quot;),
                                            you (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) enter into this legal agreement.
                                            We know legal documents can feel overwhelming, but these terms protect both you and our community.
                                            Take a moment to read through—if anything's unclear, reach out at{" "}
                                            <a href="mailto:support@chowmate.app" className="text-[#FFC107] hover:underline font-semibold">
                                                support@chowmate.app
                                            </a>.
                                        </p>
                                    </div>
                                </div>

                                {/* 1. Acceptance & Modifications */}
                                <div className="mb-8 sm:mb-12">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">1. Acceptance & Modifications</h3>
                                    <p className="text-sm sm:text-base text-[#666666] mb-3 sm:mb-4">
                                        When you sign up, place an order, or simply browse our Platform, you're agreeing to these terms.
                                        Think of it as a handshake—we promise to deliver great service, and you agree to use our Platform responsibly.
                                    </p>
                                    <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl">
                                        <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-2 sm:mb-3">Important Notes:</h4>
                                        <ul className="list-disc pl-4 sm:pl-6 text-sm sm:text-base text-[#666666] space-y-1 sm:space-y-2">
                                            <li>We may update these terms as our service evolves. When we do, we'll notify you through the app</li>
                                            <li>Continued use after changes means you accept the new terms</li>
                                            <li>If you don't agree with updates, you can close your account anytime</li>
                                            <li>Violating these terms may result in account suspension or termination</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* 2. Our Services */}
                                <div className="mb-8 sm:mb-12">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">2. What We Provide</h3>
                                    <p className="text-sm sm:text-base text-[#666666] mb-4">
                                        Chowmate is your bridge to delicious meals. We connect you with local restaurants and coordinate
                                        professional riders to bring food straight to your doorstep. Here's what you should know:
                                    </p>

                                    <div className="space-y-4 sm:space-y-6">
                                        <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl">
                                            <h4 className="text-lg sm:text-xl font-semibold text-[#282828] mb-2 sm:mb-3">Our Platform Enables:</h4>
                                            <ul className="list-disc pl-4 sm:pl-6 text-sm sm:text-base text-[#666666] space-y-1 sm:space-y-2">
                                                <li>Browsing menus from restaurants in your area</li>
                                                <li>Placing and tracking food orders in real-time</li>
                                                <li>Secure payment processing</li>
                                                <li>Direct communication with customer support</li>
                                                <li>Order history and favorites management</li>
                                            </ul>
                                        </div>

                                        <div className="border-l-4 border-[#FFC107] pl-4 sm:pl-6 py-2">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-1 sm:mb-2">What We're NOT:</h4>
                                            <p className="text-sm sm:text-base text-[#666666]">
                                                We don't own, operate, or control the restaurants on our Platform. We're facilitators, not food preparers.
                                                While we carefully select partners, we can't guarantee the quality, safety, or preparation standards of meals—that's on the restaurants.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Account Requirements */}
                                <div className="mb-8 sm:mb-12">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">3. Account Creation & Responsibilities</h3>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
                                        <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-2 sm:mb-3">Eligibility Requirements</h4>
                                            <ul className="text-sm sm:text-base text-[#666666] space-y-1 sm:space-y-2">
                                                <li>• Must be 18 years or older</li>
                                                <li>• Provide accurate information</li>
                                                <li>• Valid phone number & email</li>
                                                <li>• Delivery address in our service area</li>
                                            </ul>
                                        </div>
                                        <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-2 sm:mb-3">Your Responsibilities</h4>
                                            <ul className="text-sm sm:text-base text-[#666666] space-y-1 sm:space-y-2">
                                                <li>• Keep login credentials secure</li>
                                                <li>• Update info when it changes</li>
                                                <li>• Don't share your account</li>
                                                <li>• Report suspicious activity</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                        <div className="flex items-start">
                                            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                                            <p className="text-sm text-yellow-800">
                                                <strong>Security Alert:</strong> You're responsible for all activity under your account.
                                                If your account is compromised, contact us immediately at support@chowmate.app
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Orders & Delivery */}
                                <div className="mb-8 sm:mb-12">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">4. Placing Orders & Delivery Process</h3>

                                    <p className="text-sm sm:text-base text-[#666666] mb-4">
                                        When you place an order through Chowmate, you're entering into a binding agreement to purchase those items.
                                    </p>

                                    <div className="space-y-4">
                                        <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-2 sm:mb-3">The Order Flow:</h4>
                                            <ol className="list-decimal pl-4 sm:pl-6 text-sm sm:text-base text-[#666666] space-y-2">
                                                <li><strong>Selection:</strong> Browse restaurants and add items to your cart</li>
                                                <li><strong>Review:</strong> Double-check your order, delivery address, and payment method</li>
                                                <li><strong>Confirmation:</strong> Complete payment to finalize your order</li>
                                                <li><strong>Preparation:</strong> Restaurant prepares your meal</li>
                                                <li><strong>Pickup:</strong> Our rider collects your order</li>
                                                <li><strong>Delivery:</strong> Track in real-time until it arrives at your door</li>
                                            </ol>
                                        </div>

                                        <div className="border-l-4 border-[#FFC107] pl-4 sm:pl-6">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-2">Cancellations & Modifications</h4>
                                            <p className="text-sm sm:text-base text-[#666666] mb-2">
                                                Once a restaurant begins preparing your order, we can't cancel or modify it.
                                                For order issues, contact support immediately—we're here to help make things right.
                                            </p>
                                        </div>

                                        <div className="border-l-4 border-[#FFC107] pl-4 sm:pl-6">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-2">Delivery Times</h4>
                                            <p className="text-sm sm:text-base text-[#666666]">
                                                Our estimated delivery times (usually 25-35 minutes) are our best predictions.
                                                Traffic, weather, and restaurant prep time can affect delivery. We'll keep you updated throughout.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 5. Pricing & Payment */}
                                <div className="mb-8 sm:mb-12">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">5. Pricing, Payments & Service Fees</h3>

                                    <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl mb-4">
                                        <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-2 sm:mb-3">Transparent Pricing</h4>
                                        <p className="text-sm sm:text-base text-[#666666] mb-3">
                                            Every price you see is in Nigerian Naira (₦) and includes applicable taxes.
                                            Your total is always shown before you confirm payment—no hidden surprises.
                                        </p>
                                        <p className="text-sm sm:text-base text-[#666666]">
                                            <strong>Your total includes:</strong> Food cost + Delivery fee + Service fee (₦100-₦300) + Applicable taxes
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="border-l-4 border-[#FFC107] pl-4 sm:pl-6">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-1 sm:mb-2">Payment Methods</h4>
                                            <p className="text-sm sm:text-base text-[#666666]">
                                                We accept debit cards, bank transfers.
                                                All payments are processed securely through trusted third-party providers.
                                            </p>
                                        </div>

                                        <div className="border-l-4 border-[#FFC107] pl-4 sm:pl-6">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-1 sm:mb-2">Price Changes</h4>
                                            <p className="text-sm sm:text-base text-[#666666]">
                                                If item prices change after you add them to your cart, we'll notify you before checkout.
                                                You'll need to accept the new price to proceed.
                                            </p>
                                        </div>

                                        <div className="border-l-4 border-[#FFC107] pl-4 sm:pl-6">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-1 sm:mb-2">Refunds & Issues</h4>
                                            <p className="text-sm sm:text-base text-[#666666] mb-3">
                                                Wrong order? Missing items? Report it through the app within 30 minutes of delivery.
                                                We'll investigate and process approved refunds within 24 hours.
                                            </p>
                                            <div className="bg-blue-50 border-2 border-blue-200 p-3 sm:p-4 rounded-lg mt-2">
                                                <p className="text-sm sm:text-base text-blue-900">
                                                    <strong className="text-blue-800">Important - Refund Policy:</strong> All approved refunds are issued as
                                                    <strong> wallet credits</strong> to your Chowmate account, not as bank transfers.
                                                    Wallet credits can be used immediately for future orders on our Platform.
                                                    We do not process refunds back to your bank account or original payment method.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 6. Promo Codes */}
                                <div className="mb-8 sm:mb-12">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">6. Promotional Codes & Discounts</h3>
                                    <p className="text-sm sm:text-base text-[#666666] mb-4">
                                        We love rewarding our loyal customers! When we offer promo codes, here's how they work:
                                    </p>
                                    <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl">
                                        <ul className="list-disc pl-4 sm:pl-6 text-sm sm:text-base text-[#666666] space-y-2">
                                            <li>Use codes only as intended—for personal use, not resale</li>
                                            <li>One code per order unless stated otherwise</li>
                                            <li>Codes expire and can't be redeemed for cash</li>
                                            <li>We reserve the right to cancel fraudulent or misused codes</li>
                                            <li>Check specific terms for each promotion—they vary</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* 7. Refund Policy */}
                                <div className="mb-8 sm:mb-12">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">7. Refund & Cancellation Policy</h3>

                                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 sm:p-6 rounded-xl mb-4">
                                        <div className="flex items-start gap-3">
                                            <CreditCard className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                            <div>
                                                <h4 className="text-lg sm:text-xl font-bold text-blue-900 mb-2">Wallet Credit Refunds Only</h4>
                                                <p className="text-sm sm:text-base text-blue-800 leading-relaxed">
                                                    All approved refunds are processed exclusively as <strong>wallet credits</strong> added to your Chowmate account.
                                                    We do not issue refunds to bank accounts, debit cards, or any original payment methods.
                                                    This policy applies to all refund scenarios without exception.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-3">When Refunds Are Issued</h4>
                                            <ul className="list-disc pl-4 sm:pl-6 text-sm sm:text-base text-[#666666] space-y-2">
                                                <li>Order not received after confirmed delivery</li>
                                                <li>Incorrect items delivered (wrong food, restaurant error)</li>
                                                <li>Missing items from your order</li>
                                                <li>Food quality issues (spoiled, contaminated, or inedible)</li>
                                                <li>Order canceled before restaurant preparation begins</li>
                                                <li>Significant delivery delays caused by platform issues</li>
                                            </ul>
                                        </div>

                                        <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-3">How Wallet Credits Work</h4>
                                            <ul className="text-sm sm:text-base text-[#666666] space-y-2">
                                                <li>• <strong>Instant Availability:</strong> Credits are added to your wallet within 24 hours of approval</li>
                                                <li>• <strong>No Expiration:</strong> Your wallet balance never expires</li>
                                                <li>• <strong>Full Value:</strong> Credits maintain their full monetary value in Naira (₦)</li>
                                                <li>• <strong>Flexible Usage:</strong> Use credits across any restaurant or service on our Platform</li>
                                            </ul>
                                        </div>

                                        <div className="border-l-4 border-red-400 bg-red-50 pl-4 sm:pl-6 py-3 rounded">
                                            <h4 className="text-base sm:text-lg font-semibold text-red-900 mb-2">No Cash or Bank Refunds</h4>
                                            <p className="text-sm sm:text-base text-red-800">
                                                Under no circumstances will Chowmate process refunds back to your bank account, debit card, or original payment method.
                                                All refunds are final once issued as wallet credits. Wallet credits cannot be converted to cash or withdrawn.
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-3">Refund Process Timeline</h4>
                                            <ol className="list-decimal pl-4 sm:pl-6 text-sm sm:text-base text-[#666666] space-y-2">
                                                <li><strong>Report Issue:</strong> Contact support within 30 minutes of delivery via the app</li>
                                                <li><strong>Provide Evidence:</strong> Submit photos or details of the issue</li>
                                                <li><strong>Investigation:</strong> Our team reviews your claim (usually within 2-4 hours)</li>
                                                <li><strong>Decision:</strong> You'll receive approval or denial notification</li>
                                                <li><strong>Credit Issued:</strong> Approved refunds appear in your wallet within 24 hours</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>

                                {/* 8. Platform Usage Rules */}
                                <div className="mb-8 sm:mb-12">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">8. Acceptable Use & Prohibited Activities</h3>

                                    <p className="text-sm sm:text-base text-[#666666] mb-4">
                                        Our Platform is for ordering food, plain and simple. To keep it safe and functional for everyone:
                                    </p>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                        <div className="bg-green-50 p-4 sm:p-6 rounded-xl border-2 border-green-200">
                                            <h4 className="text-base sm:text-lg font-semibold text-green-800 mb-3">✅ Do This</h4>
                                            <ul className="text-sm text-green-700 space-y-2">
                                                <li>• Use the Platform for personal food orders</li>
                                                <li>• Provide accurate delivery information</li>
                                                <li>• Report issues promptly and honestly</li>
                                                <li>• Treat riders and support staff with respect</li>
                                            </ul>
                                        </div>
                                        <div className="bg-red-50 p-4 sm:p-6 rounded-xl border-2 border-red-200">
                                            <h4 className="text-base sm:text-lg font-semibold text-red-800 mb-3">❌ Don't Do This</h4>
                                            <ul className="text-sm text-red-700 space-y-2">
                                                <li>• Share or sell your account</li>
                                                <li>• Use fake information or multiple accounts</li>
                                                <li>• Attempt to hack or reverse-engineer our Platform</li>
                                                <li>• Abuse promo codes or exploit system bugs</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* 9. Intellectual Property */}
                                <div className="mb-8 sm:mb-12">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">9. Intellectual Property Rights</h3>
                                    <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl">
                                        <p className="text-sm sm:text-base text-[#666666] mb-3">
                                            Everything you see on our Platform—the Chowmate name, logo, design, software, and content—belongs to us
                                            or our licensors. You can use the Platform for ordering food, but you can't:
                                        </p>
                                        <ul className="list-disc pl-4 sm:pl-6 text-sm sm:text-base text-[#666666] space-y-1">
                                            <li>Copy, distribute, or modify our content without permission</li>
                                            <li>Use our branding for commercial purposes</li>
                                            <li>Scrape data from our Platform</li>
                                            <li>Create derivative works based on our Platform</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* 10. Liability & Disclaimers */}
                                <div className="mb-8 sm:mb-12">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">10. Limitations of Liability</h3>

                                    <div className="bg-yellow-50 border-2 border-yellow-300 p-4 sm:p-6 rounded-xl mb-4">
                                        <h4 className="text-base sm:text-lg font-semibold text-yellow-900 mb-2">Important Legal Notice</h4>
                                        <p className="text-sm sm:text-base text-yellow-800">
                                            While we work hard to provide excellent service, we operate in the real world where things don't always go perfectly.
                                            Here's what that means legally:
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="border-l-4 border-[#FFC107] pl-4 sm:pl-6">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-2">Platform Availability</h4>
                                            <p className="text-sm sm:text-base text-[#666666]">
                                                We can't guarantee 100% uptime. Maintenance, technical issues, or unforeseen problems may temporarily
                                                affect service. We're not liable for losses from Platform downtime.
                                            </p>
                                        </div>

                                        <div className="border-l-4 border-[#FFC107] pl-4 sm:pl-6">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-2">Food Quality & Safety</h4>
                                            <p className="text-sm sm:text-base text-[#666666]">
                                                Restaurants prepare the food, not us. While we partner with reputable establishments,
                                                we can't guarantee food quality, safety, or accuracy of descriptions. Food allergies?
                                                Contact the restaurant directly before ordering.
                                            </p>
                                        </div>

                                        <div className="border-l-4 border-[#FFC107] pl-4 sm:pl-6">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-2">Personal Use Only</h4>
                                            <p className="text-sm sm:text-base text-[#666666]">
                                                Our Platform is designed for personal food orders. Using it for commercial purposes without
                                                written permission voids any warranties or guarantees.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 11. User Protection */}
                                <div className="mb-8 sm:mb-12">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">11. Your Protection & Our Commitment</h3>
                                    <p className="text-sm sm:text-base text-[#666666] mb-4">
                                        As a user, you agree to use our service responsibly. In return, here's what we commit to:
                                    </p>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                        <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-2 sm:mb-3">What We Promise</h4>
                                            <ul className="text-sm sm:text-base text-[#666666] space-y-1">
                                                <li>• Fair treatment of all users</li>
                                                <li>• Transparent pricing and policies</li>
                                                <li>• Responsive customer support</li>
                                                <li>• Secure payment processing</li>
                                                <li>• Protection of your personal data</li>
                                            </ul>
                                        </div>
                                        <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-2 sm:mb-3">What We Expect</h4>
                                            <ul className="text-sm sm:text-base text-[#666666] space-y-1">
                                                <li>• Honest order information</li>
                                                <li>• Timely payment for orders</li>
                                                <li>• Respectful communication</li>
                                                <li>• Acceptance of deliveries you ordered</li>
                                                <li>• Accurate delivery addresses</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* 12. Termination */}
                                <div className="mb-8 sm:mb-12">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">12. Account Termination</h3>
                                    <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl">
                                        <p className="text-sm sm:text-base text-[#666666] mb-3">
                                            You can close your account anytime through the app settings. Your data will be handled according
                                            to our Privacy Policy.
                                        </p>
                                        <p className="text-sm sm:text-base text-[#666666]">
                                            We reserve the right to suspend or terminate accounts that violate these terms, engage in fraud,
                                            or harm our community. If we terminate your account, we'll notify you and explain why.
                                        </p>
                                    </div>
                                </div>

                                {/* 13. Governing Law */}
                                <div className="mb-8 sm:mb-12">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">13. Governing Law & Dispute Resolution</h3>
                                    <div className="space-y-3">
                                        <div className="border-l-4 border-[#FFC107] pl-4 sm:pl-6">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-2">Jurisdiction</h4>
                                            <p className="text-sm sm:text-base text-[#666666]">
                                                These terms are governed by the laws of the Federal Republic of Nigeria.
                                                Any disputes will be resolved in Nigerian courts.
                                            </p>
                                        </div>

                                        <div className="border-l-4 border-[#FFC107] pl-4 sm:pl-6">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#282828] mb-2">Complaints & Resolution</h4>
                                            <p className="text-sm sm:text-base text-[#666666]">
                                                Got an issue? Contact our support team first at support@chowmate.app or through the in-app chat.
                                                We're committed to resolving problems quickly and fairly.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="mb-6 sm:mb-8">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#282828] mb-3 sm:mb-4">14. Contact Us</h3>
                                    <div className="bg-[#FFF8E1] p-4 sm:p-6 rounded-xl">
                                        <p className="text-sm sm:text-base text-[#666666] mb-3">
                                            Questions about these terms? We're here to help clarify anything that's confusing.
                                        </p>
                                        <div className="space-y-1 sm:space-y-2 text-sm text-[#666666]">
                                            <p><strong>Email:</strong>{" "}
                                                <a href="mailto:support@chowmate.app" className="text-[#FFC107] hover:underline">
                                                    support@chowmate.app
                                                </a>
                                            </p>
                                            <p><strong>Phone:</strong>{" "}
                                                <a href="tel:+2349038073651" className="text-[#FFC107] hover:underline">
                                                    +234 810 357 6463
                                                </a>
                                            </p>
                                            <p><strong>Support:</strong> Available 24/7 through in-app chat</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Version Info */}
                                <div className="text-xs sm:text-sm text-[#666666] bg-gray-50 p-3 sm:p-4 rounded-xl">
                                    <p><strong>Last Updated:</strong> February 2026</p>
                                    <p className="mt-1"><strong>Effective Date:</strong> Immediately upon publication</p>
                                    <p className="mt-2">Chowmate Technologies Limited © 2026. All rights reserved.</p>
                                </div>

                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <SimpleFooter />
        </>
    );
};

export default TermsPage;
