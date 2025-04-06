"use client";

import { useEffect, useState } from "react";

export function DelayRendering({ children, delay = 0.6 }: { children: React.ReactNode, delay?: number }) {

    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShouldRender(true)
        }, delay * 1000)
        return () => clearTimeout(timeout)
    }, [delay])

    return (
        shouldRender ? children : null
    );
}
