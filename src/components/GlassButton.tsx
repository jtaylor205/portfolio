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
        group relative w-16 h-16 rounded-2xl cursor-pointer
        bg-white/20 backdrop-blur-xl
        border border-white/30
        shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.2)]
        flex items-center justify-center
        transition-[background-color,box-shadow] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
        hover:bg-white/30 
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.3)]
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
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-white/10 to-transparent opacity-60" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center">
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