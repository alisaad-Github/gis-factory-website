"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { Check } from "lucide-react"
import { motion, useInView } from "framer-motion"

// Import the services data
import { services } from "@/data/services"

export default function ServicesPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([])

  // Initialize refs array
  useEffect(() => {
    serviceRefs.current = serviceRefs.current.slice(0, services.length)
    while (serviceRefs.current.length < services.length) {
      serviceRefs.current.push(null)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <main className="min-h-screen w-full relative">
        {/* Glow effects that follow mouse */}
        <div
          className="fixed w-[600px] h-[600px] rounded-full bg-green-400/5 blur-[120px] pointer-events-none z-0 transition-all duration-1000 ease-out"
          style={{
            left: `${mousePosition.x - 300}px`,
            top: `${mousePosition.y - 300}px`,
            opacity: 0.6,
          }}
        />

        {/* Main content */}
        <div className="relative z-10 w-full flex flex-col">
          <Navbar />

          {/* Centered title */}
          <div className="pt-24 pb-12 flex justify-center items-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-green-400 relative text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              We&apos;ve Got You Covered
              <span className="absolute -inset-1 bg-green-400/10 blur-md rounded-lg -z-10"></span>
            </motion.h1>
          </div>

          {/* Grid layout for services */}
          <div className="px-4 md:px-8 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {services.map((service, index) => (
                <ServiceCard 
                  key={service.id}
                  service={service}
                  index={index}
                  setRef={(el) => {
                    serviceRefs.current[index] = el;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </ThemeProvider>
  )
}

interface ServiceCardProps {
  service: {
    id: number
    title: string
    image: string
    detailImage: string
    description: string
    features: string[]
  }
  index: number
  setRef: (el: HTMLDivElement | null) => void
}

function ServiceCard({ service, index, setRef }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef as React.RefObject<Element>, { 
    amount: 0.3, // Trigger when 50% of the element is in view
    once: true 
  })

  return (
    <div 
      ref={(el) => {
        // Set both refs
        if (el) {
          setRef(el)
          cardRef.current = el
        }
      }}
      className="h-full flex items-stretch"
    >
      <motion.div 
        className="w-full flex flex-col glassmorphism rounded-xl p-0 overflow-hidden h-full"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ 
          duration: 0.5, 
          delay: (index % 3) * 0.15, // Stagger based on index
          ease: "easeOut"
        }}
      >
        {/* Image section */}
        <div className="w-full relative overflow-hidden pt-[70%]">
          <Image 
            src={service.detailImage || service.image} 
            alt={service.title} 
            fill 
            className="object-cover absolute inset-0" 
            priority 
          />

          {/* Gradient overlay */}
          <div className="absolute left-0 bottom-0 w-full h-full bg-gradient-to-t from-black/70 to-50% to-transparent" />

          {/* Title overlay at bottom */}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h2 className="text-2xl font-bold text-green-400 relative">
              {service.title}
              <span className="absolute -inset-1 bg-green-400/10 blur-md rounded-lg -z-10"></span>
            </h2>
          </div>
        </div>

        {/* Service details */}
        <div className="w-full p-5 flex flex-col flex-grow">
          <p className="text-gray-300 mb-4 text-sm">{service.description}</p>

          <ul className="space-y-2 mb-4">
            {service.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start p-2 rounded-lg hover:bg-green-500/10 transition-all duration-300"
              >
                <div className="mr-2 mt-0.5 p-1 rounded-full bg-green-500/20">
                  <Check size={12} className="text-green-400" />
                </div>
                <span className="text-gray-300 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  )
}

