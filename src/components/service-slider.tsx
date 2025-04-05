"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { services } from "@/data/services";
import { motion } from "framer-motion";

interface ServiceSliderProps {
    onServiceSelect: (serviceId: number, element: HTMLDivElement) => void;
    mousePosition: { x: number; y: number };
    onDetailClose?: () => void;
}

export function ServiceSlider({ onServiceSelect }: ServiceSliderProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
    const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize slideRefs array
    useEffect(() => {
        slideRefs.current = slideRefs.current.slice(0, services.length);
        while (slideRefs.current.length < services.length) {
            slideRefs.current.push(null);
        }
    }, []);

    // Listen for detail close events from the custom event
    useEffect(() => {
        const handleDetailClosed = () => {
            console.log('Detail closed event received, resuming auto-scroll');
            setIsDetailOpen(false);
        };
        
        // Add custom event listener
        document.addEventListener('serviceDetailClosed', handleDetailClosed);
        
        return () => {
            document.removeEventListener('serviceDetailClosed', handleDetailClosed);
        };
    }, []);

    // Preload detail images in the background
    useEffect(() => {
        // Create array of detail images that haven't been loaded yet
        const imagesToPreload = services
            .filter(service => service.detailImage && !preloadedImages.has(service.detailImage))
            .map(service => service.detailImage as string);
        
        if (imagesToPreload.length === 0) return;
        
        // Helper function to preload a single image
        const preloadImage = (src: string) => {
            return new Promise<void>((resolve, reject) => {
                const img = new window.Image();
                img.src = src;
                img.onload = () => {
                    setPreloadedImages(prev => new Set([...prev, src]));
                    resolve();
                };
                img.onerror = reject;
            });
        };
        
        // Start preloading the visible slides first, then the rest
        const preloadImagesSequentially = async () => {
            try {
                // First load visible images (around active index)
                const visibleRange = [-2, -1, 0, 1, 2]; // Visible slide indices relative to active
                const visibleIndices = visibleRange.map(offset => {
                    const index = activeIndex + offset;
                    if (index < 0) return services.length + index;
                    if (index >= services.length) return index - services.length;
                    return index;
                });
                
                // Get visible detail images that haven't been loaded
                const visibleImagesToPreload = visibleIndices
                    .map(index => services[index]?.detailImage)
                    .filter(src => src && !preloadedImages.has(src)) as string[];
                
                // Preload visible images first
                for (const src of visibleImagesToPreload) {
                    await preloadImage(src);
                }
                
                // Then preload remaining images
                const remainingImages = imagesToPreload.filter(src => !visibleImagesToPreload.includes(src));
                for (const src of remainingImages) {
                    await preloadImage(src);
                }
            } catch (error) {
                console.error("Error preloading images:", error);
            }
        };
        
        preloadImagesSequentially();
    }, [activeIndex, preloadedImages]);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev === services.length - 4 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev === 0 ? services.length - 4 : prev - 1));
    };

    const startAutoScroll = () => {
        if (autoScrollRef.current) {
            clearInterval(autoScrollRef.current);
        }

        autoScrollRef.current = setInterval(() => {
            // Only auto-scroll if not hovering AND detail is not open
            if (!isHovering && !isDetailOpen) {
                nextSlide();
            }
        }, 5000);
    };

    useEffect(() => {
        startAutoScroll();

        return () => {
            if (autoScrollRef.current) {
                clearInterval(autoScrollRef.current);
            }
        };
    }, [isHovering, isDetailOpen]); // Also depend on isDetailOpen

    const handleServiceClick = (serviceId: number, index: number) => {
        const slideElement = slideRefs.current[index];
        if (slideElement) {
            // Set detail as open
            setIsDetailOpen(true);
            
            // Call the original onServiceSelect
            onServiceSelect(serviceId, slideElement);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 600 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-7xl mx-auto"
        >
            <div
                ref={sliderRef}
                className="w-full relative h-[220px] overflow-visible"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => {
                    setIsHovering(false);
                    setHoverIndex(null);
                }}
            >
                <div className="absolute top-0 left-0 flex items-center h-full">
                    {services.map((service, index) => {
                        // Calculate position based on index relative to active
                        const position = index - activeIndex;

                        // Calculate transform values
                        const translateX = position * (280 + 20); // Slide width + gap
                        const isHovered = hoverIndex === index;

                        return (
                            <div
                                key={service.id}
                                ref={(el) => {
                                    slideRefs.current[index] = el;
                                }}
                                className="absolute top-0 transition-all duration-500 ease-out"
                                style={{
                                    transform: `translateX(${translateX}px) scale(${
                                        isHovered ? 1.1 : 1
                                    })`,
                                    zIndex: isHovered
                                        ? 30
                                        : 20 - Math.abs(position),
                                }}
                                onMouseEnter={() => setHoverIndex(index)}
                                onMouseLeave={() => setHoverIndex(null)}
                            >
                                <div className="w-[280px]">
                                <div
                                    className="pt-[76%] relative bg-black/40 backdrop-blur-sm border border-green-500/20 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:border-green-500/40 cursor-pointer group"
                                    onClick={() =>
                                        handleServiceClick(service.id, index)
                                    }
                                    data-service-id={service.id}
                                >
                                    <div className="h-full flex flex-col absolute inset-0 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />

                                        <Image
                                            src={
                                                service.image ||
                                                "/placeholder.svg"
                                            }
                                            alt={service.title}
                                            width={320}
                                            height={180}
                                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                                        />

                                        <div className="absolute bottom-0 left-0 w-full p-3 z-20">
                                            <h3 className="text-lg font-bold text-green-400 mb-1 group-hover:text-green-300 transition-colors truncate">
                                                {service.title}
                                            </h3>

                                            <div className="w-full h-0.5 bg-green-500/20 overflow-hidden">
                                                <div className="h-full bg-green-500 w-0 group-hover:w-full transition-all duration-700" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center gap-8 justify-center mt-4">
                <button
                    onClick={prevSlide}
                    className="relative bg-black/50 text-green-400 p-2 rounded-full border border-green-500/30 hover:bg-black/70 hover:border-green-500/50 transition-all z-40 group cursor-pointer"
                >
                    <ChevronLeft
                        size={20}
                        className="group-hover:scale-110 transition-transform"
                    />
                    <span className="absolute inset-0 rounded-full bg-green-400/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
                </button>

                <div className="flex h-2 justify-center space-x-2 flex-wrap max-w-lg">
                    {services.slice(0, -3).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === activeIndex
                                    ? "bg-green-400 w-4"
                                    : "bg-green-800 hover:bg-green-600"
                            }`}
                        />
                    ))}
                </div>
                <button
                    onClick={nextSlide}
                    className="relative bg-black/50 text-green-400 p-2 rounded-full border border-green-500/30 hover:bg-black/70 hover:border-green-500/50 transition-all z-40 group cursor-pointer"
                >
                    <ChevronRight
                        size={20}
                        className="group-hover:scale-110 transition-transform"
                    />
                    <span className="absolute inset-0 rounded-full bg-green-400/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
                </button>
            </div>
        </motion.div>
    );
}
