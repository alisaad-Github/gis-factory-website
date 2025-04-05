"use client";

import { usePathname } from "next/navigation";

export function BackgroundImage() {
    const pathname = usePathname();
    
    function getBackgroundPosition() {
        switch (pathname) {
            case "/services":
                return "90% 20%";
            case "/about":
                return "center center";
            case "/pricing":
                return "100% 50%";
            case "/contact":
                return "0px 0px";
            default:
                return "0px -200px";
        }
    }
    
    return (
        <div
            className="fixed inset-0 z-0 opacity-20"
            style={{
                backgroundImage: "url(/main-bg.svg)",
                backgroundSize: "180% auto",
                backgroundPosition: getBackgroundPosition(),
                backgroundRepeat: "no-repeat",
                transition: "background-position 3s"
            }}
        />
    );
} 