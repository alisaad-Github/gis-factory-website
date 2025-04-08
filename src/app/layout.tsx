import type { Metadata } from "next";
import "./globals.css";
import { Geist_Mono } from "next/font/google";
import { BackgroundImage } from "@/components/background-image";
import { axiforma } from "@/fonts";

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "GIS Factory",
    description: "GIS Factory is a leading provider of GIS and data solutions, offering expert mapping, data analysis, and visualization services to businesses and organizations of all sizes.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${axiforma.variable} ${geistMono.variable} antialiased bg-black font-sans`}
                style={{
                    fontFamily:
                        "Axiforma, var(--font-axiforma), system-ui, sans-serif",
                }}
            >
                <BackgroundImage />
                {children}
            </body>
        </html>
    );
}
