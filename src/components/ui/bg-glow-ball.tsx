import { cn } from "@/lib/utils";

interface BgGlowBallProps {
  size: string; // e.g., "w-[400px] h-[400px]"
  intensity: number; // Alpha value, e.g., 0.15
  color: "green" | "teal";
  className?: string; // For positioning: "absolute top-10 left-20"
}

// RGB values for the colors
const colorMap = {
  green: "0, 255, 157",
  teal: "13, 148, 136", // Approx teal-500
};

export function BgGlowBall({
  size,
  intensity,
  color,
  className,
}: BgGlowBallProps) {
  const rgb = colorMap[color];

  // Define the radial gradient style using the selected color and intensity
  const gradientStyle = {
    background: `
      radial-gradient(circle at center, rgba(${rgb}, ${intensity}) 0%, rgba(${rgb}, 0) 70%)
    `,
  };

  return (
    <div
      className={cn(
        "rounded-full pointer-events-none absolute -z-10", // Base styles + ensures it's behind content
        size, // Apply size class
        className // Apply positioning classes
      )}
      style={gradientStyle} // Apply the calculated gradient
    />
  );
} 