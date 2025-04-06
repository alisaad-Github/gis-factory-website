"use client";

import type React from "react";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { CALENDLY_URL } from "@/constants";
import pricingPlans from "@/data/pricing";
import { BorderBeam } from "@/components/magicui/border-beam";
import { cn } from "@/lib/utils";
import { DelayRendering } from "@/components/delayed-rendering";
import Link from "next/link";

export default function PricingPage() {
    const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

    return (
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
            <main className="h-screen w-screen overflow-auto relative">
                {/* Main content */}
                <div className="relative z-10 min-h-screen w-full flex flex-col">
                    <Navbar />

                    <DelayRendering>
                        <div className="flex-1 flex flex-col items-center justify-start pt-24 md:pt-36 pb-16 px-4 md:px-6 max-w-7xl mx-auto w-full">
                            {/* Pricing cards - improved grid layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                            {pricingPlans.map((plan, index) => (
                                <PricingCard
                                    key={plan.id}
                                    plan={plan}
                                    isHovered={hoveredPlan === plan.id}
                                    setHovered={(isHovered) =>
                                        setHoveredPlan(
                                            isHovered ? plan.id : null
                                        )
                                    }
                                    delay={index * 0.1}
                                />
                            ))}
                        </div>

                        {/* Additional info */}
                        <motion.div
                            className="mt-16 text-center max-w-2xl glassmorphism bg-[#00000001]  p-8 rounded-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <h3 className="text-xl font-medium text-teal-400 mb-3">
                                Need a custom solution?
                            </h3>
                            <p className="text-gray-300 mb-6">
                                Contact us for a tailored plan that meets your
                                specific requirements
                            </p>
                            <a
                                href={CALENDLY_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center whitespace-nowrap bg-teal-500 hover:bg-teal-600 text-black font-medium rounded-full px-8 py-3 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,157,0.5)] relative overflow-hidden group"
                            >
                                <span className="relative z-10">
                                    Let&apos;s Talk
                                </span>
                                <span className="absolute inset-0 bg-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            </a>
                        </motion.div>
                        </div>
                    </DelayRendering>
                </div>
            </main>
        </ThemeProvider>
    );
}

interface PricingCardProps {
    plan: {
        id: number;
        name: string;
        price: string;
        period: string;
        description: string;
        features: string[];
        recommended: boolean;
    };
    isHovered: boolean;
    setHovered: (isHovered: boolean) => void;
    delay: number;
}

function PricingCard({ plan, isHovered, setHovered, delay }: PricingCardProps) {
    return (
        <motion.div
            className={cn(
                "pricing-card relative glassmorphism !bg-[#00000001] rounded-xl overflow-hidden",
                plan.recommended &&
                    "pricing-recommended border-2 border-green-400/50 ring-4 ring-green-400/10",
                !plan.recommended && "border border-green-500/30"
            )}
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Recommended badge */}
            {plan.recommended && (
                <div className="absolute top-0 right-0 z-20">
                    <div className="bg-green-400 text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                        RECOMMENDED
                    </div>
                </div>
            )}
            {isHovered && (
                <BorderBeam duration={8} delay={delay * 5} size={100} />
            )}

            <div className="pricing-card-content p-6">
                {/* Header - Centered plan name */}
                <div className="text-center mb-5 mt-2">
                    <h3 className="text-2xl font-bold text-teal-400">
                        {plan.name}
                    </h3>
                </div>

                {/* Price */}
                <div className="mb-8 text-center">
                    <div className="flex items-end justify-center">
                        <span className="text-3xl font-bold text-white leading-none">
                            {plan.price}
                        </span>
                        <span className="text-gray-400 ml-2">
                            {plan.period}
                        </span>
                    </div>
                    <p className="text-gray-300 mt-3 text-sm px-4">
                        {plan.description}
                    </p>
                </div>

                {/* Features */}
                <ul className="pricing-card-features space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                        <motion.li
                            key={index}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: delay + 0.1 + index * 0.1,
                            }}
                        >
                            <div className="mr-3 mt-0.5 text-teal-400 flex-shrink-0">
                                <Check size={16} />
                            </div>
                            <span className="text-gray-300 text-sm">
                                {feature}
                            </span>
                        </motion.li>
                    ))}
                </ul>

                {/* CTA */}
                <div className="mt-auto">
                    <Link
                        href={"/contact"}
                        target="_blank"
                        className={`flex items-center justify-center w-full rounded-full relative overflow-hidden py-3 group ${
                            plan.recommended
                                ? "bg-teal-500 hover:bg-teal-600 text-black font-medium"
                                : "bg-transparent border border-teal-500/50 text-teal-400 hover:bg-teal-500/10"
                        }`}
                    >
                        <span className="relative z-10">Contact us</span>
                        {plan.recommended && (
                            <span className="absolute inset-0 bg-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Hover glow effect */}
            {isHovered && (
                <div className="absolute inset-0 bg-teal-400/5 pointer-events-none" />
            )}
        </motion.div>
    );
}
