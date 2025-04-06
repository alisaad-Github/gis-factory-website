"use client";

import { useState, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { ServiceSlider } from "@/components/service-slider";
import { ExpandingServiceDetail } from "@/components/expanding-service-detail";
import { ThemeProvider } from "@/components/theme-provider";
import { motion } from "framer-motion";
import { DelayRendering } from "@/components/delayed-rendering";

export default function Home() {
    const [activeService, setActiveService] = useState<number | null>(null);
    const [sourceElement, setSourceElement] = useState<HTMLDivElement | null>(
        null
    );

    const handleServiceSelect = (
        serviceId: number,
        element: HTMLDivElement
    ) => {
        setActiveService(serviceId);
        setSourceElement(element);
    };

    const handleCloseDetail = () => {
        setActiveService(null);
        setSourceElement(null);
    };

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            enableSystem
        >
            <main className="h-[100dvh] w-screen overflow-hidden relative">
                {/* Static Background Glow Balls */}
                {/* <BgGlowBall
                    size="w-[600px] h-[600px]"
                    intensity={0.2}
                    color="green"
                    className="top-[-300px] left-[-200px]"
                />
                <BgGlowBall
                    size="w-[1000px] h-[1000px]"
                    intensity={0.18}
                    color="teal"
                    className="bottom-[-400px] right-[-150px]"
                />
                <BgGlowBall
                    size="w-[600px] h-[600px]"
                    intensity={0.2}
                    color="green"
                    className="bottom-[-300px] right-[300px]"
                /> */}

                {/* Glow effects that follow mouse */}
                {/* <div
                    className="absolute w-[400px] h-[400px] rounded-full pointer-events-none z-0 transition-all duration-500 ease-out"
                    style={{
                        left: `${mousePosition.x - 200}px`,
                        top: `${mousePosition.y - 200}px`,
                        background: `
                            radial-gradient(circle at center, rgba(0, 255, 157, 0.1) 0%, rgba(0, 255, 157, 0) 50%),
                            radial-gradient(circle at center, rgba(0, 255, 157, 0.05) 0%, rgba(0, 255, 157, 0) 70%)
                        `,
                    }}
                /> */}

                {/* Main content */}
                <div className="relative z-10 h-full w-full flex flex-col">
                    <Navbar />
                    <DelayRendering>
                        <div className="max-w-7xl mx-auto flex-1 flex items-center justify-center">
                            <MainContent
                                onServiceSelect={handleServiceSelect}
                                onDetailClose={handleCloseDetail}
                            />
                        </div>
                    </DelayRendering>
                </div>

                {/* Expanding service detail */}
                {activeService !== null && sourceElement && (
                    <ExpandingServiceDetail
                        serviceId={activeService}
                        sourceElement={sourceElement}
                        onClose={handleCloseDetail}
                    />
                )}
            </main>
        </ThemeProvider>
    );
}

function MainContent({
    onServiceSelect,
    onDetailClose,
}: {
    onServiceSelect: (serviceId: number, element: HTMLDivElement) => void;
    onDetailClose: () => void;
}) {
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={contentRef} className="w-full h-full pt-24 md:pt-32">
            <div className="w-full flex flex-col justify-center items-center text-center">
                {/* Hero section */}
                <div className="mb-8 md:mb-16 relative max-w-2xl">
                    <motion.h1
                        className="text-3xl px-4 md:px-0 lg:text-5xl font-bold text-white mb-2 md:mb-4 relative z-10"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Your{" "}
                        <span
                            className="
                            text-teal-400 relative z-0
                            
                        "
                        >
                            GIS
                        </span>{" "}
                        and{" "}
                        <span
                            className="
                            text-teal-400 relative z-0
                            
                        "
                        >
                            Data
                        </span>{" "}
                        Solutions Partner
                    </motion.h1>

                    <motion.p
                        className="px-8 md:px-0 text-gray-300 text-sm sm:text-lg md:text-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Harness the latest advancements in GIS technology and
                        data solutions to elevate your projects to new heights
                    </motion.p>
                </div>

                {/* Services slider */}
                <ServiceSlider
                    onServiceSelect={onServiceSelect}
                    onDetailClose={onDetailClose}
                />
            </div>
        </div>
    );
}
