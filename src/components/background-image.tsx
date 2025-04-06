"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function BackgroundImage() {
    const pathname = usePathname();
    const [bgSize, setBgSize] = useState("200% auto");
    
    useEffect(() => {
        // Set initial size
        handleResize();
        
        // Add resize listener
        window.addEventListener("resize", handleResize);
        
        // Cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    
    function handleResize() {
        if (window.innerWidth < 768) {
            setBgSize("300% auto");
        } else {
            setBgSize("200% auto");
        }
    }
    
    function getBackgroundPosition() {
        switch (pathname) {
            case "/services":
                return "0px center";
            case "/about":
                return "right 0px";
            case "/pricing":
                return "right center";
            case "/contact":
                return "right bottom";
            default:
                return "0px 0px";
        }
    }
    
    return (
        <div
            className="fixed inset-0 z-0 opacity-20"
            style={{
                backgroundImage: "url(/main-bg.svg)",
                backgroundSize: bgSize,
                backgroundPosition: getBackgroundPosition(),
                backgroundRepeat: "no-repeat",
                transition: "background-position 2s"
            }}
        />
    );
} 