"use client";

import type React from "react";

import { useCallback, useEffect, useRef, useState } from "react";
import { services } from "@/data/services";
import { ArrowRight, Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import Link from "next/link";
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
    const [animationStage, setAnimationStage] = useState<
        "initial" | "expanding" | "expanded" | "closing" | "changing"
    >("initial");
    const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);
    const [isPanelMinimized, setIsPanelMinimized] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check if we're on mobile
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768); // md breakpoint is 768px
        };
        
        // Check initially
        checkIfMobile();
        
        // Add resize listener
        window.addEventListener('resize', checkIfMobile);
        
        // Cleanup
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    const handleTogglePanel = () => {
        setIsPanelMinimized((prev) => !prev);
    };

    // Get the source element's position and dimensions
    useEffect(() => {
        if (sourceElement) {
            const rect = sourceElement.getBoundingClientRect();
            setSourceRect(rect);
            setAnimationStage("expanding");
        }
    }, [sourceElement]);

    // Function to navigate to previous or next service
    const navigateToService = useCallback(
        (direction: "prev" | "next") => {
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

                    // Fade content back in
                    setTimeout(() => {
                        if (contentRef.current) {
                            contentRef.current.style.opacity = "1";
                            setAnimationStage("expanded");
                        }
                    }, 300);
                }, 300);
            }
        },
        [animationStage, currentServiceId, contentRef]
    );

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
                contentRef.current.style.transform = isMobile ? "translateY(20px)" : "translateX(20px)";
            }

            // Start the animation after a small delay
            setTimeout(() => {
                // Calculate final dimensions (90% of screen width, maintaining aspect ratio)
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                // Calculate dimensions based on mobile or desktop
                const finalWidth = isMobile ? viewportWidth * 0.95 : viewportWidth * 0.9;
                const finalHeight = isMobile
                    ? Math.min(viewportHeight * 0.4, finalWidth * 0.6) // Shorter height on mobile
                    : viewportHeight * 0.9;

                // Center position
                const finalLeft = (viewportWidth - finalWidth) / 2;
                const finalTop = isMobile ? viewportHeight * 0.1 : (viewportHeight - finalHeight) / 2;

                // Animate to final position
                image.style.transition = "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
                image.style.width = `${finalWidth}px`;
                image.style.height = isMobile? "auto" : `${finalHeight}px`;
                image.style.left = `${finalLeft}px`;
                image.style.top = isMobile ? '20px' : `${finalTop}px`;

                // Show content with delay
                setTimeout(() => {
                    if (contentRef.current) {
                        contentRef.current.style.opacity = "1";
                        contentRef.current.style.transform = isMobile ? "translateY(0)" : "translateX(0)";
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
            contentRef.current.style.transform = isMobile ? "translateY(20px)" : "translateX(20px)";

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
    }, [animationStage, sourceRect, onClose, isMobile]);

    const handleClose = useCallback(() => {
        if (animationStage === "expanded") {
            setAnimationStage("closing");
        }
    }, [animationStage]);

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

        return () => {
            document.removeEventListener("keydown", handleKeys);
        };
    }, [animationStage, handleClose, navigateToService]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        // Only close if we're clicking directly on the backdrop (not on any children)
        // Check if target is the backdrop by comparing with currentTarget
        // and ensuring we're in expanded state to allow closing
        if (e.target === e.currentTarget && animationStage === "expanded") {
            e.stopPropagation();
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
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center overflow-y-auto"
            onClick={handleBackdropClick}
            style={{ opacity: 0, transition: "opacity 0.3s ease" }}
            data-backdrop="true"
        >
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 z-0 overflow-hidden opacity-80" onClick={(e) => e.stopPropagation()} style={{ pointerEvents: "none" }}>
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

            {/* Expanding image container - Adjusts for mobile vs desktop */}
            <div 
                ref={imageRef} 
                className={cn(
                    "overflow-hidden z-10 relative",
                    isMobile ? "flex flex-col max-h-[95vh] max-w-[98vw]" : ""
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={cn(
                    "relative w-full h-full",
                    isMobile && "flex flex-col"
                )}>
                    <div
                        className={cn(
                            "transition-opacity duration-500", 
                            isMobile ? "relative pt-[70%] -translate-y-0" : "absolute top-1/2 -translate-y-1/2 left-0 w-full h-full"
                        )}
                        style={
                            service?.imageWidth && service?.imageHeight && !isMobile
                                ? {
                                      width: service?.imageWidth,
                                      height: service?.imageHeight,
                                  }
                                : {}
                        }
                    >
                        {/* Close button - Positioned on the image in mobile view */}
                        <button
                            onClick={handleClose}
                            className="hidden-desktop absolute top-4 right-4 z-40 text-gray-400 hover:text-white p-1 rounded-full bg-black/30 hover:bg-black/70 transition-colors group cursor-pointer"
                        >
                            <X
                                size={20}
                                className="group-hover:rotate-90 transition-transform duration-300"
                            />
                        </button>
                        
                        <Image
                            src={service.detailImage || service.image}
                            alt={service.title}
                            fill
                            quality={100}
                            className={cn(
                                "object-cover object-center rounded-t-xl md:rounded-xl",
                                service.objectFit
                            )}
                            priority
                        />
                    </div>

                    {/* Content section - Positioned based on mobile or desktop */}
                    <div
                        ref={contentRef}
                        className={cn(
                            "bg-[#00000077] backdrop-blur-sm z-30 flex flex-col justify-end transition-all duration-200",
                            isMobile 
                                ? "relative w-full p-4 pb-6 rounded-b-xl" 
                                : "absolute top-0 bottom-0 right-0 h-full w-[350px] p-6",
                            isPanelMinimized && !isMobile && "w-[60px] p-0"
                        )}
                        style={{
                            opacity: 0,
                            transform: isMobile ? "translateY(20px)" : "translateX(20px)",
                            boxShadow: "0 4px 30px rgba(0, 255, 157, 0.1)",
                        }}
                    >
                        <button
                            onClick={handleClose}
                            className="hidden-mobile absolute top-4 right-4 z-40 text-gray-400 hover:text-white p-1 rounded-full hover:bg-black/70 transition-colors group cursor-pointer"
                        >
                            <X
                                size={20}
                                className="group-hover:rotate-90 transition-transform duration-300"
                            />
                        </button>
                        {!isMobile && (
                            <button
                                onClick={handleTogglePanel}
                                className={cn(
                                    "absolute top-4 left-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800/50 transition-colors group cursor-pointer",
                                    isPanelMinimized &&
                                        "top-14 left-auto right-4 rotate-180"
                                )}
                            >
                                <ArrowRight size={20} />
                            </button>
                        )}
                        
                        {isPanelMinimized && !isMobile ? (
                            ""
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.25 }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold text-white relative mb-3">
                                    {service.title}
                                </h2>

                                <p className="text-white/50 mb-4 md:mb-6 text-sm md:text-base">
                                    {service.description}
                                </p>

                                <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-500/20 scrollbar-track-transparent max-h-[30vh] md:max-h-none">
                                    {service.features.map((feature, index) => (
                                        <li
                                            key={index}
                                            className={`flex items-center rounded-lg transition-all duration-300`}
                                        >
                                            <div
                                                className={`mr-3 p-1 rounded-full`}
                                            >
                                                <Check
                                                    size={15}
                                                    strokeWidth={2.5}
                                                    className="text-white"
                                                />
                                            </div>
                                            <span
                                                className={`text-gray-300 text-xs md:text-sm`}
                                            >
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex justify-between items-center mt-4">
                                    <Link href={"/contact"} target="_blank" rel="noopener noreferrer">
                                    <Button
                                        className="inline-flex items-center justify-center whitespace-nowrap bg-green-500 hover:bg-green-600 text-black font-medium rounded-full px-4 py-2 text-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,157,0.5)] relative overflow-hidden group"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <span className="relative z-10">
                                            Contact Us
                                        </span>
                                        <span className="absolute inset-0 bg-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                    </Button>
                                    </Link>

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
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
