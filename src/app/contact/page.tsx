"use client"

import type React from "react"

import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { motion } from "framer-motion"
import { Mail, MapPin, Phone } from "lucide-react"
import { CALENDLY_URL } from "@/constants"

export default function ContactPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <main className="h-screen w-screen overflow-auto relative">        
        {/* Main content */}
        <div className="relative z-10 min-h-screen w-full flex flex-col">
          <Navbar />

          <div className="flex-1 flex flex-col items-center justify-start pt-28 pb-16 px-4 md:px-6 max-w-7xl mx-auto w-full">
            {/* Contact Content */}
            <motion.div
              className="w-full max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Header */}
              <div className="text-center mb-12">
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-300"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Contact Us
                </motion.h1>
                <motion.p 
                  className="text-gray-300 text-lg max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  We&apos;re ready to help you transform your spatial data into strategic insights
                </motion.p>
              </div>

              {/* Contact Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Email */}
                <ContactCard 
                  icon={<Mail className="h-6 w-6 text-green-400" />}
                  title="Email Us"
                  content="info@gis-factory.com "
                  link="mailto:info@gisfactory.com"
                  delay={0.1}
                />
                
                {/* Phone */}
                <ContactCard 
                  icon={<Phone className="h-6 w-6 text-green-400" />}
                  title="Call Us"
                  content="+961 78 903 025"
                  link="tel:+96178903025"
                  delay={0.2}
                />
                
                {/* Location */}
                <ContactCard 
                  icon={<MapPin className="h-6 w-6 text-green-400" />}
                  title="Visit Us"
                  content="BDD - Beirut, Lebanon"
                  delay={0.3}
                />
              </div>

              {/* CTA Section */}
              <motion.div
                className="text-center glassmorphism bg-[#00000001] p-8 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <h3 className="text-xl font-medium text-green-400 mb-3">Ready to start your project?</h3>
                <p className="text-gray-300 mb-6">Our team is ready to provide the GIS expertise your organization needs</p>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center whitespace-nowrap bg-green-500 hover:bg-green-600 text-black font-medium rounded-full px-8 py-3 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,157,0.5)] relative overflow-hidden group"
                >
                  <span className="relative z-10">Schedule a Consultation</span>
                  <span className="absolute inset-0 bg-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
    </ThemeProvider>
  )
}

interface ContactCardProps {
  icon: React.ReactNode
  title: string
  content: string
  link?: string
  delay: number
}

function ContactCard({ icon, title, content, link, delay }: ContactCardProps) {
  const CardContent = () => (
    <>
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{content}</p>
    </>
  )

  return (
    <motion.div
      className="glassmorphism bg-[#00000001] p-6 rounded-xl border border-green-500/30 hover:border-green-400/50 transition-all duration-300 flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ 
        scale: 1.03, 
        boxShadow: "0 0 25px rgba(0,255,157,0.2)" 
      }}
    >
      {link ? (
        <a href={link} className="flex flex-col items-center w-full">
          <CardContent />
        </a>
      ) : (
        <CardContent />
      )}
    </motion.div>
  )
} 