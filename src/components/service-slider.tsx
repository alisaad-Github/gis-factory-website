"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { services } from "@/data/services";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ServiceSliderProps {
    onServiceSelect: (serviceId: number, element: HTMLDivElement) => void;
    onDetailClose?: () => void;
}

export function ServiceSlider({ onServiceSelect }: ServiceSliderProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [preloadedImages, setPreloadedImages] = useState<Set<string>>(
        new Set()
    );
    const [scrollPosition, setScrollPosition] = useState(0);
    const [scrollMode, setScrollMode] = useState<"auto" | "index">("auto");
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
    const autoScrollRef = useRef<number | null>(null);
    const lastScrollTimeRef = useRef<number>(Date.now());
    const DESKTOP_SLIDE_WIDTH = 300;
    const MOBILE_SLIDE_WIDTH = 250;
    const TABLET_SLIDE_WIDTH = 200;
    const SLIDE_WIDTH = isMobile ? MOBILE_SLIDE_WIDTH : isTablet ? TABLET_SLIDE_WIDTH : DESKTOP_SLIDE_WIDTH;
    const SLIDE_GAP = isMobile ? 10 : 10;
    const SLIDE_TOTAL_WIDTH = SLIDE_WIDTH + SLIDE_GAP;

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1350);
        };
        
        checkScreenSize();
        
        window.addEventListener('resize', checkScreenSize);
        
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    const visibleIndex = useMemo(() => {
        if (scrollMode === "index") {
            return activeIndex;
        } else {
            const visibleSlides = isMobile ? 2 : 4;
            const maxScrollPosition = (services.length - visibleSlides) * SLIDE_TOTAL_WIDTH;
            const normalizedPosition =
                ((scrollPosition % maxScrollPosition) + maxScrollPosition) %
                maxScrollPosition;
            return (
                Math.round(normalizedPosition / SLIDE_TOTAL_WIDTH) %
                (services.length - (visibleSlides - 1))
            );
        }
    }, [scrollMode, activeIndex, scrollPosition, SLIDE_TOTAL_WIDTH, isMobile]);

    useEffect(() => {
        slideRefs.current = slideRefs.current.slice(0, services.length);
        while (slideRefs.current.length < services.length) {
            slideRefs.current.push(null);
        }
    }, []);

    useEffect(() => {
        const handleDetailClosed = () => {
            console.log("Detail closed event received, resuming auto-scroll");
            setIsDetailOpen(false);
        };

        document.addEventListener("serviceDetailClosed", handleDetailClosed);

        return () => {
            document.removeEventListener(
                "serviceDetailClosed",
                handleDetailClosed
            );
        };
    }, []);

    const imagesPreloaded = useRef(false);
    useEffect(() => {
        const imagesToPreload = services
            .filter(
                (service) =>
                    service.detailImage &&
                    !preloadedImages.has(service.detailImage)
            )
            .map((service) => service.detailImage as string);

        if (imagesToPreload.length === 0) return;

        const preloadImage = (src: string) => {
            console.log("Preloading image:", src);
            return new Promise<void>((resolve, reject) => {
                const img = new window.Image();
                img.src = src;
                img.onload = () => {
                    setPreloadedImages((prev) => new Set([...prev, src]));
                    resolve();
                };
                img.onerror = reject;
            });
        };

        const preloadImagesSequentially = async () => {
            try {
                const visibleRange = [-2, -1, 0, 1, 2];
                const visibleIndices = visibleRange.map((offset) => {
                    const index = activeIndex + offset;
                    if (index < 0) return services.length + index;
                    if (index >= services.length)
                        return index - services.length;
                    return index;
                });

                const visibleImagesToPreload = visibleIndices
                    .map((index) => services[index]?.detailImage)
                    .filter(
                        (src) => src && !preloadedImages.has(src)
                    ) as string[];

                for (const src of visibleImagesToPreload) {
                    await preloadImage(src);
                }

                const remainingImages = imagesToPreload.filter(
                    (src) => !visibleImagesToPreload.includes(src)
                );
                for (const src of remainingImages) {
                    await preloadImage(src);
                }
            } catch (error) {
                console.error("Error preloading images:", error);
            }
        };

        if (!imagesPreloaded.current) {
            preloadImagesSequentially();
            imagesPreloaded.current = true;
        }
    }, [activeIndex, preloadedImages]);

    const nextSlide = () => {
        setScrollMode("index");
        setActiveIndex((prev) => {
            const visibleSlides = isMobile ? 2 : 4;
            const newIndex = prev === services.length - visibleSlides ? 0 : prev + 1;
            setScrollPosition(newIndex * SLIDE_TOTAL_WIDTH);
            return newIndex;
        });
    };

    const prevSlide = () => {
        setScrollMode("index");
        setActiveIndex((prev) => {
            const visibleSlides = isMobile ? 2 : 4;
            const newIndex = prev === 0 ? services.length - visibleSlides : prev - 1;
            setScrollPosition(newIndex * SLIDE_TOTAL_WIDTH);
            return newIndex;
        });
    };

    const getWrappedScrollPosition = (position: number) => {
        const visibleSlides = isMobile ? 2 : 4;
        const maxScrollPosition = (services.length - visibleSlides) * SLIDE_TOTAL_WIDTH;
        const normalizedPosition =
            ((position % maxScrollPosition) + maxScrollPosition) %
            maxScrollPosition;
        return normalizedPosition;
    };

    const startAutoScroll = () => {
        if (autoScrollRef.current !== null) {
            cancelAnimationFrame(autoScrollRef.current);
        }

        const scrollStep = () => {
            if (!isHovering && !isDetailOpen) {
                const now = Date.now();
                const deltaTime = now - lastScrollTimeRef.current;
                lastScrollTimeRef.current = now;

                const scrollSpeed = 0.05;
                const pixelsToScroll = scrollSpeed * deltaTime;

                setScrollPosition((prev) => {
                    const nextPosition = prev + pixelsToScroll;
                    return getWrappedScrollPosition(nextPosition);
                });

                setScrollMode("auto");
            }

            autoScrollRef.current = requestAnimationFrame(scrollStep);
        };

        lastScrollTimeRef.current = Date.now();
        autoScrollRef.current = requestAnimationFrame(scrollStep);
    };

    useEffect(() => {
        startAutoScroll();

        return () => {
            if (autoScrollRef.current !== null) {
                cancelAnimationFrame(autoScrollRef.current);
            }
        };
    }, [isHovering, isDetailOpen]);

    const handleIndexClick = (index: number) => {
        setScrollMode("index");
        setActiveIndex(index);
        setScrollPosition(index * SLIDE_TOTAL_WIDTH);
    };

    useEffect(() => {
        if (isHovering && scrollMode === "auto") {
            setActiveIndex(visibleIndex);
        }
    }, [isHovering, scrollPosition, scrollMode, visibleIndex]);

    const handleServiceClick = (serviceId: number, index: number) => {
        const slideElement = slideRefs.current[index];
        if (slideElement) {
            setIsDetailOpen(true);

            onServiceSelect(serviceId, slideElement);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 600 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => {
                    setIsHovering(false);
                    setHoverIndex(null);
                }}
            className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-7xl mx-auto"
        >
            <div
                ref={sliderRef}
                className="w-full relative py-1 h-[190px] xl:h-[230px] overflow-hidden"
            >
                <motion.div
                    className={cn(
                        "flex items-center h-full",
                        scrollMode === "index" &&
                            "transition-transform duration-300 ease-out"
                    )}
                    style={{ x: -scrollPosition }}
                    transition={{
                        type: scrollMode === "index" ? "spring" : "tween",
                        stiffness: 300,
                        damping: 30,
                        duration: scrollMode === "auto" ? 0 : 0.5,
                    }}
                >
                    {services.map((service, index) => {
                        const isHovered = hoverIndex === index;

                        return (
                            <div
                                key={service.id}
                                ref={(el) => {
                                    slideRefs.current[index] = el;
                                }}
                                className="transition-transform duration-300 ease-out flex-shrink-0 mr-[10px] last:mr-0"
                                style={{
                                    zIndex: isHovered ? 30 : 1,
                                }}
                                onMouseEnter={() => setHoverIndex(index)}
                                onMouseLeave={() => setHoverIndex(null)}
                            >
                                <div style={{ width: `${SLIDE_WIDTH}px` }}>
                                    <div
                                        className="pt-[76%] relative bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300 border hover:border-green-600/80 cursor-pointer group"
                                        onClick={() =>
                                            handleServiceClick(
                                                service.id,
                                                index
                                            )
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
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute bottom-0 left-0 w-full h-1/3 p-1 z-20 bg-gradient-to-t from-black/80 from-20% to-transparent" />
                                            <div className="absolute bottom-0 left-0 w-full p-1 z-30">
                                                <h3 className="text-base md:text-lg font-semibold text-white mb-1 group-hover:text-green-300 transition-colors truncate">
                                                    {service.title}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            </div>

            <div className="flex items-center justify-center mt-2 md:mt-4 w-full">
                <div
                    className="flex items-center gap-4 md:gap-8 justify-center w-fit"
                >
                    <button
                        onClick={prevSlide}
                        className="relative bg-black/50 text-white p-1.5 md:p-2 rounded-full hover:bg-black/70 hover:border-green-500/50 transition-all z-40 group cursor-pointer"
                    >
                        <ChevronLeft
                            size={isMobile ? 16 : 20}
                            className="group-hover:scale-110 transition-transform"
                        />
                        <span className="absolute inset-0 rounded-full bg-green-400/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
                    </button>

                    <div className="flex h-2 justify-center space-x-1 md:space-x-2 flex-wrap max-w-lg">
                        {services.slice(0, -(isMobile ? 1 : 3)).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleIndexClick(index)}
                                className={`cursor-pointer w-1.5 md:w-2 h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                                    index === visibleIndex
                                        ? "bg-teal-400 w-3 md:w-4"
                                        : "bg-white/50 hover:bg-teal-600"
                                }`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={nextSlide}
                        className="relative bg-black/50 text-white p-1.5 md:p-2 rounded-full hover:bg-black/70 hover:border-green-500/50 transition-all z-40 group cursor-pointer"
                    >
                        <ChevronRight
                            size={isMobile ? 16 : 20}
                            className="group-hover:scale-110 transition-transform"
                        />
                        <span className="absolute inset-0 rounded-full bg-green-400/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
