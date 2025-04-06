"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { Check } from "lucide-react"
import { motion, useInView } from "framer-motion"

// Import the services data
import { services } from "@/data/services"
import { ExpandingServiceDetail } from "@/components/expanding-service-detail"
import { DelayRendering } from "@/components/delayed-rendering"

export default function ServicesPage() {
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([])
  const serviceImageRefs = useRef<(HTMLDivElement | null)[]>([])
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
  const [detailSourceElement, setDetailSourceElement] = useState<HTMLDivElement | null>(null)

  // Initialize refs array
  useEffect(() => {
    serviceRefs.current = serviceRefs.current.slice(0, services.length)
    serviceImageRefs.current = serviceImageRefs.current.slice(0, services.length)
    while (serviceRefs.current.length < services.length) {
      serviceRefs.current.push(null)
      serviceImageRefs.current.push(null)
    }
  }, [])


  // Handle service card click
  const handleServiceCardClick = (serviceId: number, index: number) => {
    setSelectedServiceId(serviceId)
    setDetailSourceElement(serviceImageRefs.current[index])
  }

  // Handle closing the service detail
  const handleCloseServiceDetail = () => {
    setSelectedServiceId(null)
    setDetailSourceElement(null)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <main className="min-h-screen w-full relative">

        {/* Main content */}
        <div className="relative z-10 w-full flex flex-col">
          <Navbar />

          <DelayRendering>
          {/* Centered title */}
          <div className="pt-20 md:pt-24 pb-6 md:pb-12 flex justify-center items-center">
            <motion.h1 
              className="text-2xl md:text-4xl font-bold text-white relative text-center mt-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              We&apos;ve Got You Covered
              <span className="hidden-mobile absolute -inset-1 bg-teal-400/10 blur-md rounded-lg -z-10"></span>
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
                  setImageRef={(el) => {
                    serviceImageRefs.current[index] = el;
                  }}
                  onClick={() => handleServiceCardClick(service.id, index)}
                />
              ))}
            </div>
          </div>
        </DelayRendering>

        </div>

        {/* Service Detail Overlay */}
        {selectedServiceId !== null && detailSourceElement && (
          <ExpandingServiceDetail
            serviceId={selectedServiceId}
            sourceElement={detailSourceElement}
            onClose={handleCloseServiceDetail}
          />
        )}

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
  setImageRef: (el: HTMLDivElement | null) => void
  onClick: () => void
}

function ServiceCard({ service, index, setRef, setImageRef, onClick }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef as React.RefObject<Element>, { 
    amount: 0.3, // Trigger when 50% of the element is in view
    once: true 
  })

  return (
    <div 
      ref={(el) => {
        // Set card ref
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
        <div 
          ref={setImageRef}
          className="w-full relative group overflow-hidden pt-[70%] cursor-pointer"
          onClick={onClick}
        >
          <Image 
            src={service.detailImage || service.image} 
            alt={service.title} 
            fill 
            className="object-cover absolute inset-0 group-hover:scale-110 transition-all duration-300 ease-out" 
            priority 
          />

          {/* Gradient overlay */}
          <div className="absolute left-0 bottom-0 w-full h-full bg-gradient-to-t from-black/70 to-50% to-transparent" />

          {/* Title overlay at bottom */}
          <div className="absolute bottom-0 left-0 w-full px-4 py-2 bg-gradient-to-t from-black/80 to-transparent">
            <h2 className="text-xl font-bold text-white relative">
              {service.title}
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
                className="flex items-center py-2 rounded-lg"
              >
                <div className="mr-2 p-1 rounded-full">
                  <Check size={14} className="text-teal-400" />
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

