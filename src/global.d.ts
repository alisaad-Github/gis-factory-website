import { MotionProps as OriginalMotionProps } from "framer-motion";

declare module "framer-motion" {
  interface MotionProps extends OriginalMotionProps {
    className?: string;
    onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave?: () => void;
    onMouseEnter?: () => void;
    onMouseDown?: () => void;
    onMouseUp?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }
}