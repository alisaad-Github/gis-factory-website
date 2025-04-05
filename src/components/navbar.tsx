"use client";

import { useEffect, useState, useRef, createRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { CALENDLY_URL } from "@/constants";
import Image from "next/image";

export function Navbar() {
    const [hoverItem, setHoverItem] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const [underlineStyle, setUnderlineStyle] = useState({
        left: 0,
        width: 80,
        opacity: 0.7
    });

    const navItems = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Services", href: "/services" },
        { name: "Pricing", href: "/pricing" },
        { name: "Contact us", href: "/contact" },
    ];

    // Create refs for each nav item
    const itemRefs = useRef(navItems.map(() => createRef<HTMLAnchorElement>()));

    const [activeItem, setActiveItem] = useState(navItems[0].name);
    const pathname = usePathname();
    
    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
        setActiveItem(
            navItems.find((item) => item.href === pathname)?.name ||
                navItems[0].name
        );
    }, [pathname]);

    // Calculate underline position when hoverItem or activeItem changes
    useEffect(() => {
        const targetName = hoverItem || activeItem;
        const targetIndex = navItems.findIndex(item => item.name === targetName);
        
        if (targetIndex !== -1 && navRef.current && itemRefs.current[targetIndex].current) {
            const navElement = navRef.current;
            const targetElement = itemRefs.current[targetIndex].current;
            
            if (targetElement) {
                // Get actual positions and dimensions
                const navRect = navElement.getBoundingClientRect();
                const itemRect = targetElement.getBoundingClientRect();
                
                // Calculate position relative to nav container
                const itemLeft = itemRect.left - navRect.left;
                const itemCenter = itemLeft + (itemRect.width / 2);
                const underlineWidth = 80; // fixed width of the underline
                
                setUnderlineStyle({
                    left: itemCenter - (underlineWidth / 2),
                    width: underlineWidth,
                    opacity: hoverItem ? 1 : 0.7
                });
            }
        }
    }, [hoverItem, activeItem]);

    // Toggle menu function
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="w-full py-4 px-6 md:px-12 absolute top-0 left-0 z-20">
            <div className="max-w-7xl mx-auto flex items-center justify-between relative">
                <div className="flex items-end gap-2 group z-30 mb-8">
                    <Image
                        src="/logo.png"
                        alt="GIS Factory Logo"
                        className="block"
                        width={32}
                        height={32}
                    />
                    <p className="text-white mt-6 leading-none font-bold text-xl relative hidden lg:inline-block">
                        GIS Factory
                    </p>
                </div>

                {/* Desktop Navigation - Centered on desktop only */}
                <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
                    <nav ref={navRef} className="flex items-center gap-8 relative">
                        <div
                            className="absolute h-[2px] bg-green-400 transition-all duration-300 bottom-0"
                            style={{
                                left: `${underlineStyle.left}px`,
                                width: `${underlineStyle.width}px`,
                                opacity: underlineStyle.opacity
                            }}
                        />

                        {navItems.map((item, index) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                ref={itemRefs.current[index]}
                                className={cn(
                                    "w-20 text-sm text-center font-medium transition-colors relative py-2 px-1 group whitespace-nowrap",
                                    item.name === activeItem
                                        ? "text-green-400"
                                        : "text-gray-300"
                                )}
                                onMouseEnter={() => setHoverItem(item.name)}
                                onMouseLeave={() => setHoverItem(null)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right side controls */}
                <div className="flex items-center gap-2 sm:gap-4 z-30">
                    {/* Hamburger button - Visible only on mobile/tablet */}
                    <button 
                        className="lg:hidden relative w-10 h-10 text-white focus:outline-none"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <div className="absolute w-6 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                            <span 
                                className={`absolute h-0.5 w-6 bg-white transform transition duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 delay-200' : '-translate-y-2'}`}
                            ></span>
                            <span 
                                className={`absolute h-0.5 bg-white transform transition-all duration-200 ease-in-out ${isMenuOpen ? 'w-0 opacity-50' : 'w-6 opacity-100'}`}
                            ></span>
                            <span 
                                className={`absolute h-0.5 w-6 bg-white transform transition duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 delay-200' : 'translate-y-2'}`}
                            ></span>
                        </div>
                    </button>
                    
                    {/* Book a Call button - Always visible */}
                    <a 
                        href={CALENDLY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-green-500 hover:bg-green-600 text-black font-medium px-4 sm:px-6 h-10 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,157,0.5)] relative overflow-hidden group"
                    >
                        <span className="relative z-10">Book a Call</span>
                        <span className="absolute inset-0 bg-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </a>
                </div>

                {/* Mobile Navigation Menu - Glassmorphism style */}
                <div className={`fixed inset-0 backdrop-blur-md bg-black/60 z-20 transition-opacity duration-300 ease-in-out lg:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="flex flex-col items-center justify-center h-full p-5">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8 w-full max-w-sm">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "py-4 px-6 text-xl font-medium transition-colors block rounded-lg hover:bg-white/10",
                                        item.name === activeItem
                                            ? "text-green-400"
                                            : "text-white hover:text-green-400"
                                    )}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            
                            {/* Mobile Book a Call link in menu */}
                            <a 
                                href={CALENDLY_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 py-4 px-6 text-xl font-medium bg-green-500 hover:bg-green-600 text-black block rounded-lg text-center transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Book a Call
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
