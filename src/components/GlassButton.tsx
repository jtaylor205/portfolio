import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
}

export default function GlassButton({ children, onClick, className = "", icon }: GlassButtonProps) {
  return (
    <motion.button
      className={`
        group relative z-0 w-16 h-16 rounded-2xl cursor-pointer
        flex items-center justify-center
        hover:bg-white/[0.05] transition-colors duration-200
        active:scale-95
        ${className}
      `}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{
        scale: 1.05,
        y: -2,
        transition: {
          type: "tween",
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }
      }}
      whileTap={{
        scale: 0.95,
        y: 0,
        transition: { duration: 0.1 }
      }}
      onClick={onClick}
    >
      {/* Frosted glass background */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          borderRadius: 'inherit',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          background: 'rgba(255,255,255,0.10)',
          pointerEvents: 'none',
        }}
      />
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          borderRadius: 'inherit',
          border: '1px solid rgba(255,255,255,0.22)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28), 0 8px 32px rgba(0,0,0,0.12)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div className="relative flex items-center justify-center">
        {icon || (
          // Default home icon like in the image
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-gray-700"
          >
            <path 
              d="M3 9.5L12 2L21 9.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.5Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M9 21V12H15V21" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        )}
        {children}
      </div>
    </motion.button>
  );
}