"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { X, ArrowRight, Check } from "lucide-react"
import Image from "next/image"
import { CALENDLY_URL } from "@/constants"

type Service = {
  id: number
  title: string
  image: string
  description: string
  features: string[]
  detailImage: string
}

const services: Service[] = [
  {
    id: 0,
    title: "Geodatabase Development",
    image: "/placeholder.svg?height=400&width=600",
    detailImage: "/placeholder.svg?height=800&width=1200",
    description:
      "Custom geodatabase solutions designed for your specific needs, ensuring optimal data organization and accessibility.",
    features: [
      "Spatial database design and implementation",
      "Data migration and integration",
      "Custom schema development",
      "Performance optimization",
      "Automated data validation",
    ],
  },
  {
    id: 1,
    title: "Desktop Mapping",
    image: "/placeholder.svg?height=400&width=600",
    detailImage: "/placeholder.svg?height=800&width=1200",
    description:
      "Powerful desktop mapping solutions that transform your data into compelling visual stories and actionable insights.",
    features: [
      "Custom map creation and styling",
      "Spatial analysis and modeling",
      "Thematic mapping",
      "3D visualization",
      "Print-ready cartographic outputs",
    ],
  },
  {
    id: 2,
    title: "Web Mapping",
    image: "/placeholder.svg?height=400&width=600",
    detailImage: "/placeholder.svg?height=800&width=1200",
    description:
      "Interactive web mapping applications that engage your audience and communicate complex spatial information effectively.",
    features: [
      "Responsive web map design",
      "Interactive data visualization",
      "Real-time data integration",
      "Custom tools and widgets",
      "Cross-platform compatibility",
    ],
  },
  {
    id: 3,
    title: "Data Analytics",
    image: "/placeholder.svg?height=400&width=600",
    detailImage: "/placeholder.svg?height=800&width=1200",
    description:
      "Advanced spatial data analytics that uncover patterns, trends, and insights to drive informed decision-making.",
    features: [
      "Predictive spatial modeling",
      "Pattern and cluster analysis",
      "Time-series analysis",
      "Custom algorithms development",
      "Automated reporting",
    ],
  },
]

interface ServiceDetailProps {
  serviceId: number
  onClose: () => void
}

export function ServiceDetail({ serviceId, onClose }: ServiceDetailProps) {
  const service = services[serviceId]
  const detailRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Throttle mouse move updates for better performance
      requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY })
      })
    }

    document.addEventListener("keydown", handleEscape)
    document.addEventListener("mousemove", handleMouseMove)
    document.body.style.overflow = "hidden"

    // Animation
    if (detailRef.current) {
      detailRef.current.style.opacity = "0"
      detailRef.current.style.transform = "scale(0.95)"

      setTimeout(() => {
        if (detailRef.current) {
          detailRef.current.style.opacity = "1"
          detailRef.current.style.transform = "scale(1)"
        }
      }, 10)
    }

    // Feature highlight animation
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % service.features.length)
    }, 3000)

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousemove", handleMouseMove)
      document.body.style.overflow = "auto"
      clearInterval(interval)
    }
  }, [onClose, service.features.length])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={detailRef}
        className="bg-black border border-green-500/30 rounded-xl w-full max-w-6xl h-[80vh] overflow-hidden transition-all duration-500 relative"
      >
        {/* Glow effect that follows mouse - using CSS variables for better performance */}
        <div
          className="absolute pointer-events-none z-10 opacity-30 w-full h-full"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 255, 157, 0.3) 0%, transparent 60%)`,
          }}
        />

        <div className="flex flex-col md:flex-row h-full relative z-20">
          <div className="md:w-1/2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80 z-10 md:hidden" />
            <Image
              src={service.detailImage || service.image}
              alt={service.title}
              width={800}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black/20 md:bg-black/40">
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent" />
            </div>

            {/* Simplified grid overlay for better performance */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 z-20 opacity-30">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="border border-green-500/10 flex items-center justify-center">
                  {i % 7 === 0 && <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />}
                </div>
              ))}
            </div>
          </div>

          <div className="md:w-1/2 p-6 md:p-8 flex flex-col h-full overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-green-400 relative">
                {service.title}
                <span className="absolute -inset-1 bg-green-400/10 blur-md rounded-lg -z-10"></span>
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800/50 transition-colors group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            <p className="text-gray-300 mb-8 text-lg">{service.description}</p>

            <h3 className="text-xl font-medium text-green-400 mb-4 flex items-center">
              Key Features
              <span className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75" />
            </h3>

            <ul className="space-y-4 mb-8">
              {service.features.map((feature, index) => (
                <li
                  key={index}
                  className={`flex items-start p-3 rounded-lg transition-all duration-300 ${
                    index === activeFeature ? "bg-green-500/10 border border-green-500/30" : "border border-transparent"
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div
                    className={`mr-3 mt-1 p-1 rounded-full ${
                      index === activeFeature ? "bg-green-500/20" : "bg-transparent"
                    }`}
                  >
                    {index === activeFeature ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <ArrowRight size={16} className="text-gray-400" />
                    )}
                  </div>
                  <span className={`text-gray-300 ${index === activeFeature ? "text-white" : ""}`}>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-col sm:flex-row gap-4">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap bg-green-500 hover:bg-green-600 text-black font-medium rounded-full px-6 h-10 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,157,0.5)] relative overflow-hidden group"
              >
                <span className="relative z-10">Contact Us</span>
                <span className="absolute inset-0 bg-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </a>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-green-500/50 text-green-400 hover:bg-green-500/10 px-6 h-10 relative group"
              >
                <span className="relative z-10 group-hover:text-white transition-colors">Book a Demo</span>
                <span className="absolute inset-0 bg-green-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

