"use client"

import { useEffect, useRef } from "react"

export function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const title = titleRef.current
    const subtitle = subtitleRef.current

    if (title && subtitle) {
      const titleText = title.innerText
      const subtitleText = subtitle.innerText

      title.innerHTML = ""
      subtitle.innerHTML = ""

      // Animate title text
      Array.from(titleText).forEach((char, i) => {
        const span = document.createElement("span")
        span.innerText = char
        span.style.opacity = "0"
        span.style.transform = "translateY(20px)"
        span.style.display = char === " " ? "inline" : "inline-block"
        span.style.transition = `opacity 0.5s ease, transform 0.5s ease`
        span.style.transitionDelay = `${i * 0.05}s`

        setTimeout(() => {
          span.style.opacity = "1"
          span.style.transform = "translateY(0)"
        }, 100)

        title.appendChild(span)
      })

      // Animate subtitle text with delay
      setTimeout(() => {
        Array.from(subtitleText).forEach((char, i) => {
          const span = document.createElement("span")
          span.innerText = char
          span.style.opacity = "0"
          span.style.transform = "translateY(10px)"
          span.style.display = char === " " ? "inline" : "inline-block"
          span.style.transition = `opacity 0.3s ease, transform 0.3s ease`
          span.style.transitionDelay = `${i * 0.01}s`

          setTimeout(() => {
            span.style.opacity = "1"
            span.style.transform = "translateY(0)"
          }, 100)

          subtitle.appendChild(span)
        })
      }, 500)
    }
  }, [])

  return (
    <section className="h-[calc(100vh-80px)] flex items-center px-6 md:px-12">
      <div className="max-w-4xl">
        <h1 ref={titleRef} className="text-4xl md:text-6xl font-bold text-green-400 mb-6 leading-tight">
          Your GIS and Data Solutions Partner
        </h1>
        <p ref={subtitleRef} className="text-gray-300 text-lg md:text-xl max-w-2xl">
          Harness the latest advancements in GIS technology and data solutions to elevate your projects to new heights
        </p>

        <div className="mt-12 relative">
          <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-12 bg-green-400/20 rounded-full">
            <div className="w-2 h-4 bg-green-400 rounded-full animate-pulse-slow" />
          </div>
          <p className="text-gray-400 pl-4 border-l border-green-400/30 max-w-lg">
            Transforming complex spatial data into actionable insights through cutting-edge technology and expert
            analysis
          </p>
        </div>
      </div>
    </section>
  )
}

