"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { services } from "@/data/services";
import {
    ArrowRight,
    Check,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";
import Image from "next/image";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { cn } from "@/lib/utils";
import { CALENDLY_URL } from "@/constants";
// import { Lens } from "./magicui/lens";

interface ExpandingServiceDetailProps {
    serviceId: number;
    sourceElement: HTMLDivElement;
    onClose: () => void;
}

export function ExpandingServiceDetail({
    serviceId: initialServiceId, // Rename to initialServiceId
    sourceElement,
    onClose,
}: ExpandingServiceDetailProps) {
    // Track the currently displayed service
    const [currentServiceId, setCurrentServiceId] = useState(initialServiceId);
    const service =
        services.find((s) => s.id === currentServiceId) || services[0];

    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [activeFeature, setActiveFeature] = useState(0);
    const [animationStage, setAnimationStage] = useState<
        "initial" | "expanding" | "expanded" | "closing" | "changing"
    >("initial");
    const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);

    // Get the source element's position and dimensions
    useEffect(() => {
        if (sourceElement) {
            const rect = sourceElement.getBoundingClientRect();
            setSourceRect(rect);
            setAnimationStage("expanding");
        }
    }, [sourceElement]);

    // Function to navigate to previous or next service
    const navigateToService = (direction: "prev" | "next") => {
        if (animationStage !== "expanded") return;

        // Find current index
        const currentIndex = services.findIndex(
            (s) => s.id === currentServiceId
        );
        if (currentIndex === -1) return;

        // Calculate new index with wrap-around
        let newIndex;
        if (direction === "prev") {
            newIndex =
                currentIndex === 0 ? services.length - 1 : currentIndex - 1;
        } else {
            newIndex =
                currentIndex === services.length - 1 ? 0 : currentIndex + 1;
        }

        // Briefly set to 'changing' animation state
        setAnimationStage("changing");

        // Update content with a fade effect
        if (contentRef.current) {
            contentRef.current.style.opacity = "0";

            setTimeout(() => {
                // Change the service ID
                setCurrentServiceId(services[newIndex].id);
                // Reset active feature
                setActiveFeature(0);

                // Fade content back in
                setTimeout(() => {
                    if (contentRef.current) {
                        contentRef.current.style.opacity = "1";
                        setAnimationStage("expanded");
                    }
                }, 300);
            }, 300);
        }
    };

    // Handle animation stages
    useEffect(() => {
        if (
            animationStage === "expanding" &&
            imageRef.current &&
            containerRef.current &&
            sourceRect
        ) {
            // Set initial position and size to match the source element
            const container = containerRef.current;
            const image = imageRef.current;

            // Make container cover the full screen but invisible
            container.style.opacity = "1";

            // Position the image exactly where the source element is
            image.style.position = "absolute";
            image.style.width = `${sourceRect.width}px`;
            image.style.height = `${sourceRect.height}px`;
            image.style.left = `${sourceRect.left}px`;
            image.style.top = `${sourceRect.top}px`;
            image.style.borderRadius = "0.5rem";

            // Hide content initially
            if (contentRef.current) {
                contentRef.current.style.opacity = "0";
                contentRef.current.style.transform = "translateX(20px)";
            }

            // Start the animation after a small delay
            setTimeout(() => {
                // Calculate final dimensions (90% of screen width, maintaining aspect ratio)
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                // Calculate dimensions for 90% of viewport
                const finalWidth = viewportWidth * 0.9;
                const finalHeight = viewportHeight * 0.9;

                // Center position
                const finalLeft = (viewportWidth - finalWidth) / 2;
                const finalTop = (viewportHeight - finalHeight) / 2;

                // Animate to final position
                image.style.transition =
                    "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
                image.style.width = `${finalWidth}px`;
                image.style.height = `${finalHeight}px`;
                image.style.left = `${finalLeft}px`;
                image.style.top = `${finalTop}px`;

                // Show content with delay
                setTimeout(() => {
                    if (contentRef.current) {
                        contentRef.current.style.opacity = "1";
                        contentRef.current.style.transform = "translateX(0)";
                    }
                    setAnimationStage("expanded");
                }, 400);
            }, 50);
        }

        if (
            animationStage === "closing" &&
            imageRef.current &&
            sourceRect &&
            contentRef.current
        ) {
            // Hide content first
            contentRef.current.style.opacity = "0";
            contentRef.current.style.transform = "translateX(20px)";

            // Then animate image back to original position
            setTimeout(() => {
                if (imageRef.current) {
                    const image = imageRef.current;
                    image.style.width = `${sourceRect.width}px`;
                    image.style.height = `${sourceRect.height}px`;
                    image.style.left = `${sourceRect.left}px`;
                    image.style.top = `${sourceRect.top}px`;

                    // Finally close the container
                    setTimeout(() => {
                        if (containerRef.current) {
                            containerRef.current.style.opacity = "0";

                            // First dispatch the custom event
                            document.dispatchEvent(
                                new CustomEvent("serviceDetailClosed")
                            );

                            // Then call onClose after a short delay
                            setTimeout(() => {
                                onClose();
                            }, 100);
                        }
                    }, 400);
                }
            }, 200);
        }
    }, [animationStage, sourceRect, onClose]);

    // Handle keyboard events
    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (animationStage === "expanded") {
                if (e.key === "Escape") {
                    handleClose();
                } else if (e.key === "ArrowLeft") {
                    navigateToService("prev");
                } else if (e.key === "ArrowRight") {
                    navigateToService("next");
                }
            }
        };

        document.addEventListener("keydown", handleKeys);

        // Feature highlight animation
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % service.features.length);
        }, 3000);

        return () => {
            document.removeEventListener("keydown", handleKeys);
            clearInterval(interval);
        };
    }, [service.features.length, animationStage]);

    const handleClose = () => {
        if (animationStage === "expanded") {
            setAnimationStage("closing");
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && animationStage === "expanded") {
            handleClose();
        }
    };

    // Set body styles when the component mounts
    useEffect(() => {
        // Store original body styles
        const originalOverflow = document.body.style.overflow;

        // Apply styles needed for the detail view
        document.body.style.overflow = "hidden";

        return () => {
            // Reset body styles when component unmounts
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center overflow-hidden"
            onClick={handleBackdropClick}
            style={{ opacity: 0, transition: "opacity 0.3s ease" }}
        >
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 z-0 overflow-hidden opacity-80">
                {/* Single grid pattern without rotation */}
                <div className="absolute inset-0">
                    <GridPattern
                        width={40}
                        height={40}
                        x={0}
                        y={0}
                        className="opacity-20 text-green-500 fill-green-500/5 stroke-green-500"
                        strokeDasharray="2 3"
                    />
                </div>

                {/* Additional glow effect */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(circle at center, rgba(0, 255, 157, 0.15) 0%, transparent 70%)",
                        animation: "pulse 10s ease-in-out infinite",
                        opacity: 0.4,
                    }}
                />
            </div>

            {/* Expanding image container */}
            <div ref={imageRef} className="overflow-hidden z-10 relative">
                <div className="relative w-full h-full">
                    <div
                        className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-full transition-opacity duration-500"
                        style={
                            service?.imageWidth && service?.imageHeight
                                ? {
                                      width: service?.imageWidth,
                                      height: service?.imageHeight,
                                  }
                                : {}
                        }
                    >
                        {/* <Lens
                            zoomFactor={2}
                            lensSize={200}
                            isStatic={false}
                            lensColor="green"
                            ariaLabel="Zoom Area"
                        > */}
                            <Image
                                src={service.detailImage || service.image}
                                alt={service.title}
                                fill
                                className={cn(
                                    "object-cover object-left rounded-xl",
                                    service.objectFit
                                )}
                                priority
                            />
                        {/* </Lens> */}
                    </div>

                    {/* Content section - Positioned in the center of the image */}
                    <div
                        ref={contentRef}
                        className="absolute top-0 bottom-0 right-0 my-auto h-auto max-h-[80%] w-[350px] bg-[#00000033] backdrop-blur-sm border border-green-500/30 rounded-xl p-6 z-30 flex flex-col"
                        style={{
                            opacity: 0,
                            transform: "translateX(20px)",
                            transition:
                                "opacity 0.5s ease, transform 0.5s ease",
                            boxShadow: "0 4px 30px rgba(0, 255, 157, 0.1)",
                            margin: "auto 32px auto 0",
                        }}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-3xl font-bold text-green-400 relative">
                                {service.title}
                            </h2>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800/50 transition-colors group cursor-pointer"
                            >
                                <X
                                    size={20}
                                    className="group-hover:rotate-90 transition-transform duration-300"
                                />
                            </button>
                        </div>

                        <p className="text-gray-300 mb-6 text-base">
                            {service.description}
                        </p>

                        <h3 className="text-lg font-medium text-green-400 mb-3 flex items-center">
                            Key Features
                        </h3>

                        <ul className="space-y-3 mb-6 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-500/20 scrollbar-track-transparent">
                            {service.features.map((feature, index) => (
                                <li
                                    key={index}
                                    className={`flex items-center p-2 rounded-lg transition-all duration-300 ${
                                        index === activeFeature
                                            ? "bg-green-500/10 border border-green-500/30"
                                            : "border border-transparent"
                                    }`}
                                    onMouseEnter={() => setActiveFeature(index)}
                                >
                                    <div
                                        className={`mr-3 mt-1 p-1 rounded-full ${
                                            index === activeFeature
                                                ? "bg-green-500/20"
                                                : "bg-transparent"
                                        }`}
                                    >
                                        {index === activeFeature ? (
                                            <Check
                                                size={14}
                                                className="text-green-400"
                                            />
                                        ) : (
                                            <ArrowRight
                                                size={14}
                                                className="text-gray-400"
                                            />
                                        )}
                                    </div>
                                    <span
                                        className={`text-gray-300 text-sm ${
                                            index === activeFeature
                                                ? "text-white"
                                                : ""
                                        }`}
                                    >
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex justify-between items-center mt-auto">
                            <a
                                href={CALENDLY_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center whitespace-nowrap bg-green-500 hover:bg-green-600 text-black font-medium rounded-full px-4 py-2 text-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,157,0.5)] relative overflow-hidden group"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <span className="relative z-10">
                                    Book a Demo
                                </span>
                                <span className="absolute inset-0 bg-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            </a>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateToService("prev");
                                    }}
                                    className="relative bg-black/50 text-green-400 p-2 rounded-full border border-green-500/30 hover:bg-black/70 hover:border-green-500/50 transition-all z-40 group cursor-pointer"
                                >
                                    <ChevronLeft
                                        size={20}
                                        className="group-hover:scale-110 transition-transform"
                                    />
                                    <span className="absolute inset-0 rounded-full bg-green-400/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateToService("next");
                                    }}
                                    className="relative bg-black/50 text-green-400 p-2 rounded-full border border-green-500/30 hover:bg-black/70 hover:border-green-500/50 transition-all z-40 group cursor-pointer"
                                >
                                    <ChevronRight
                                        size={20}
                                        className="group-hover:scale-110 transition-transform"
                                    />
                                    <span className="absolute inset-0 rounded-full bg-green-400/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
