"use client";

import type React from "react";

import { useRef } from "react";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { motion } from "framer-motion";
import {
    Database,
    Globe,
    Layers,
    Code,
    BrainCircuit,
    LineChart,
} from "lucide-react";
import { GlobeCanvas } from "@/components/magicui/globe";
import { TextAnimate } from "@/components/magicui/text-animate";
import { DelayRendering } from "@/components/delayed-rendering";

export default function AboutPage() {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
            <main className="md:h-screen md:p-0 w-screen overflow-hidden relative">
                {/* Main content */}
                <div className="relative z-10 h-full w-full flex flex-col">
                    <Navbar />

                    <DelayRendering>
                        <div className="px-4 md:p-0 flex-1 flex items-center justify-center mt-16 md:mt-8">
                            <BentoGrid />
                        </div>
                    </DelayRendering>
                </div>
            </main>
        </ThemeProvider>
    );
}

function BentoGrid() {
    const gridRef = useRef<HTMLDivElement>(null);

    const tools = [
        {
            name: "Arc Pro",
            icon: "/logo-arc-pro.png",
            color: "from-emerald-500/20 to-transparent",
        },
        {
            name: "Arc Online",
            icon: "/logo-arc-online.png",
            color: "from-teal-500/20 to-transparent",
        },
        {
            name: "QGIS",
            icon: "/logo-qgis.png",
            color: "from-cyan-500/20 to-transparent",
        },
        {
            name: "Power BI",
            icon: "/logo-powerbi.png",
            color: "from-blue-500/20 to-transparent",
        },
        {
            name: "Tableau",
            icon: "/logo-tableau.png",
            color: "from-indigo-500/20 to-transparent",
        },
        {
            name: "Excel",
            icon: "/logo-excel.svg",
            color: "from-emerald-500/20 to-transparent",
        },
        {
            name: "Python",
            icon: "/logo-python.png",
            color: "from-teal-500/20 to-transparent",
        },
        {
            name: "Postgres",
            icon: "/logo-postgres.png",
            color: "from-cyan-500/20 to-transparent",
        },
    ];

    return (
        <div
            ref={gridRef}
            className="w-full max-w-7xl mt-10 mx-auto flex pb-8 md:pb-0 flex-col md:grid md:grid-cols-3 grid-rows-2 gap-4 md:h-[80vh]"
        >
            {/* Card 1: Title Card */}
            <BentoCard
                index={0}
                className="col-span-1 row-span-1"
                glowColor="from-green-400/20 to-teal-400/0"
            >
                <div className="flex flex-col h-full justify-start p-6">
                    <motion.div
                        className="relative flex flex-col h-full justify-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <span className="text-xs font-semibold text-teal-400/70 mb-4 tracking-widest uppercase">
                            THE BEST
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                            <TextAnimate
                                className="whitespace-break-spaces text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400"
                                animation="slideUp"
                                by="character"
                                once
                                duration={0.6}
                            >
                                GIS & Data
                            </TextAnimate>
                            <TextAnimate
                                className="whitespace-break-spaces text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400"
                                animation="slideUp"
                                by="character"
                                once
                                duration={0.6}
                                delay={0.6}
                            >
                                Solutions
                            </TextAnimate>
                        </h1>
                        <p className="text-gray-400 max-w-xs mt-2">
                            Specialized services for any industry
                        </p>

                        <motion.div
                            className="flex items-center space-x-2 mt-4 md:mt-auto"
                            initial={{ opacity: 0, x: 400 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <div className="h-px w-56 bg-gradient-to-r from-green-400 to-transparent"></div>
                        </motion.div>
                    </motion.div>
                </div>
            </BentoCard>

            {/* Card 2: Company Description */}
            <BentoCard
                index={1}
                className="col-span-1 md:col-span-2 row-span-1"
                glowColor="from-teal-400/20 to-emerald-400/0"
            >
                <div className="flex flex-col md:flex-row h-full items-start p-6">
                    <div className="flex flex-col h-full w-full md:w-[100%] pr-6 space-y-2">
                        <motion.span
                            className="text-xs font-semibold text-teal-400/70 tracking-widest uppercase"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            About Us
                        </motion.span>

                        <motion.p
                            className="text-white/90 text-sm font-light leading-relaxed"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            GIS Factory is a Geographic Information System (GIS)
                            and Data solution firm that helps various industries
                            utilize the power of their data. GIS Factory was founded by Ali Saad, a Lebanese GIS expert with extensive experience at UN agencies and private companies. Built on technical expertise and passion for mapping solutions, the company leverages its founder&apos;s engineering background to help organizations effectively utilize location intelligence.
                        </motion.p>

                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-auto w-[80%]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <div className="group flex items-center gap-2">
                                <div className="p-2.5 bg-zinc-800 rounded-lg  w-10 h-10 flex items-center justify-center">
                                    <Database className="w-5 h-5 text-green-400" />
                                </div>
                                <h3 className="text-white  text-sm whitespace-nowrap">
                                    Database Management
                                </h3>
                            </div>

                            <div className="group flex items-center gap-2">
                                <div className="p-2.5 bg-zinc-800 rounded-lg  w-10 h-10 flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-green-400" />
                                </div>
                                <h3 className="text-white  text-sm whitespace-nowrap">
                                    Global Mapping
                                </h3>
                            </div>

                            <div className="group flex items-center gap-2">
                                <div className="p-2.5 bg-zinc-800 rounded-lg  w-10 h-10 flex items-center justify-center">
                                    <Layers className="w-5 h-5 text-green-400" />
                                </div>
                                <h3 className="text-white  text-sm whitespace-nowrap">
                                    Data Layers
                                </h3>
                            </div>

                            <div className="group flex items-center gap-2">
                                <div className="p-2.5 bg-zinc-800 rounded-lg  w-10 h-10 flex items-center justify-center">
                                    <Code className="w-5 h-5 text-green-400" />
                                </div>
                                <h3 className="text-white  text-sm whitespace-nowrap">
                                    Custom Development
                                </h3>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        className="md:w-2/5 h-full flex items-center justify-center absolute -right-32 bottom-0 translate-y-1/2"
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <div className="relative w-72 h-72">
                            <div className="absolute inset-0 rounded-full bg-green-900/5 delay-1000"></div>
                            <div
                                className={`absolute inset-4 rounded-full bg-green-900/10 transition-all duration-1000`}
                            ></div>
                            <div
                                className={`absolute inset-8 rounded-full bg-green-900/20 transition-all duration-1500`}
                            ></div>
                            <div
                                className={`absolute inset-12 rounded-full bg-green-900/30 transition-all duration-2000`}
                            ></div>
                            <div
                                className={`absolute inset-16 rounded-full bg-green-800/50 transition-all duration-2500`}
                            ></div>
                            <div
                                className={`absolute inset-20 rounded-full bg-green-800/80 transition-all duration-2500`}
                            ></div>
                            <div
                                className={`absolute inset-24 rounded-full bg-green-400/70 transition-all duration-2500`}
                            ></div>
                            <div
                                className={`absolute inset-28 rounded-full bg-green-400/90 transition-all duration-2500`}
                            ></div>
                        </div>
                    </motion.div>
                </div>
            </BentoCard>

            {/* Card 3: Experience */}
            <BentoCard
                index={2}
                className="col-span-1 row-span-1 relative"
                glowColor="from-blue-400/20 to-teal-400/0"
            >
                <div className="flex flex-col h-full p-6">
                    <motion.span
                        className="text-xs font-semibold text-teal-400/70 tracking-widest uppercase"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        Experience
                    </motion.span>

                    <motion.div
                        className="mb-6 mt-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-3">
                            <span className="text-white mb-2">
                                Global Expertise
                            </span>
                        </h2>
                        <p className="text-gray-400 mb-6 md:mb-0">
                            From bustling cities to remote crisis zones, our
                            experts have spent over a decade turning location
                            data into life-changing insights—supporting global
                            progress in urban growth, energy, and
                            humanitarian action.
                        </p>
                    </motion.div>

                    <motion.div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[90px] w-full overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <GlobeCanvas />
                    </motion.div>
                </div>
            </BentoCard>

            {/* Card 4: Innovation */}
            <BentoCard
                index={3}
                className="col-span-1 row-span-1"
                glowColor="from-cyan-400/20 to-blue-400/0"
            >
                <div className="flex flex-col h-full">
                    <motion.span
                        className="text-xs font-semibold text-teal-400/70 tracking-widest uppercase pt-6 px-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        Innovation
                    </motion.span>

                    <motion.div
                        className="mb-5 mt-2 px-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-3">
                            <span className="text-white">Future-Ready</span>
                        </h2>
                        <p className="text-gray-400">
                            We combine GIS and data fundamentals with the latest
                            innovations in the field to provide our partners
                            with the best solution.
                        </p>
                    </motion.div>

                    <motion.div
                        className=" relative"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        {/* Horizontal dashed line */}
                        <div className="absolute top-1/2 left-0 w-full h-0 border-t-2 border-dashed border-green-400/30"></div>

                        <div className="tech-conveyor">
                            {/* Icons for continuous loop */}
                            <div className="tech-item bg-zinc-900 flex items-center justify-center mx-5 min-w-10 min-h-10 rounded-lg">
                                <BrainCircuit
                                    size={18}
                                    className="text-teal-400"
                                />
                            </div>
                            <div className="tech-item bg-zinc-900 flex items-center justify-center mx-5 min-w-10 min-h-10 rounded-lg">
                                <LineChart
                                    size={18}
                                    className="text-teal-400"
                                />
                            </div>
                            <div className="tech-item bg-zinc-900 flex items-center justify-center mx-5 min-w-10 min-h-10 rounded-lg">
                                <Database size={18} className="text-teal-400" />
                            </div>
                            <div className="tech-item bg-zinc-900 flex items-center justify-center mx-5 min-w-10 min-h-10 rounded-lg">
                                <Globe size={18} className="text-teal-400" />
                            </div>

                            {/* Duplicate set for seamless loop */}
                            <div className="tech-item bg-zinc-900 flex items-center justify-center mx-5 min-w-10 min-h-10 rounded-lg">
                                <BrainCircuit
                                    size={18}
                                    className="text-teal-400"
                                />
                            </div>
                            <div className="tech-item bg-zinc-900 flex items-center justify-center mx-5 min-w-10 min-h-10 rounded-lg">
                                <LineChart
                                    size={18}
                                    className="text-teal-400"
                                />
                            </div>
                            <div className="tech-item bg-zinc-900 flex items-center justify-center mx-5 min-w-10 min-h-10 rounded-lg">
                                <Database size={18} className="text-teal-400" />
                            </div>
                            {/* Duplicate set for seamless loop */}
                            <div className="tech-item bg-zinc-900 flex items-center justify-center mx-5 min-w-10 min-h-10 rounded-lg">
                                <BrainCircuit
                                    size={18}
                                    className="text-teal-400"
                                />
                            </div>
                            <div className="tech-item bg-zinc-900 flex items-center justify-center mx-5 min-w-10 min-h-10 rounded-lg">
                                <LineChart
                                    size={18}
                                    className="text-teal-400"
                                />
                            </div>
                            <div className="tech-item bg-zinc-900 flex items-center justify-center mx-5 min-w-10 min-h-10 rounded-lg">
                                <Database size={18} className="text-teal-400" />
                            </div>
                            <div className="tech-item bg-zinc-900 flex items-center justify-center mx-5 min-w-10 min-h-10 rounded-lg">
                                <Globe size={18} className="text-teal-400" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </BentoCard>

            {/* Card 5: Tools */}
            <BentoCard
                index={4}
                className="col-span-1 row-span-1"
                glowColor="from-emerald-400/20 to-green-400/0"
            >
                <div className="flex flex-col h-full p-6">
                    <motion.span
                        className="text-xs font-semibold text-teal-400/70 tracking-widest uppercase"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        Stack
                    </motion.span>

                    <motion.h2
                        className="text-2xl font-bold text-white mb-4 mt-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <span className="text-white">Tech Ecosystem</span>
                    </motion.h2>

                    <motion.div
                        className="grid grid-cols-4 gap-3 mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        {tools.map((tool, i) => (
                            <motion.div
                                key={tool.name}
                                className="flex flex-col items-center"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    delay: 0.6 + i * 0.05,
                                    duration: 0.5,
                                }}
                            >
                                <div
                                    className="w-12 h-12 relative mb-1 bg-black/40 rounded-lg flex items-center justify-center overflow-hidden
                                                border border-white/10 shadow-lg"
                                >
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-25`}
                                    ></div>
                                    <Image
                                        src={tool.icon || "/placeholder.svg"}
                                        alt={tool.name}
                                        width={30}
                                        height={30}
                                        className="relative z-10 object-contain p-1"
                                    />
                                </div>
                                <span className="text-gray-400 text-xs ">
                                    {tool.name}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </BentoCard>
        </div>
    );
}

interface BentoCardProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
    index: number;
}

function BentoCard({
    children,
    className,
    glowColor = "from-green-400/20 to-transparent",
    index,
}: BentoCardProps) {
    return (
        <motion.div
            className={`relative overflow-hidden ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
        >
            {/* Base card with glass effect */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/15 shadow-2xl" />

            {/* Glow effect */}
            <div
                className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${glowColor} opacity-15`}
            />

            {/* Holographic grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,transparent_0%,black_70%)] opacity-30" />

            {/* Content container */}
            <div className="relative z-10 h-full">{children}</div>
        </motion.div>
    );
}
