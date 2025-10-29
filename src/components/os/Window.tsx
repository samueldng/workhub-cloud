import { ReactNode, useState } from "react";
import { Rnd } from "react-rnd";
import { X, Minus, Maximize2, Minimize2, Minimize, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WindowProps {
  id: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  onClose: () => void;
  onMinimize: () => void;
  isActive: boolean;
  onFocus: () => void;
  className?: string; // Add className prop for additional styling
}

export function Window({
  title,
  icon,
  children,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 800, height: 600 },
  onClose,
  onMinimize,
  isActive,
  onFocus,
  className = "", // Destructure className with default empty string
}: WindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousState, setPreviousState] = useState(defaultPosition);

  const handleMaximize = () => {
    if (!isMaximized) {
      setIsMaximized(true);
    } else {
      setIsMaximized(false);
    }
  };

  return (
    <Rnd
      default={{
        ...defaultPosition,
        ...defaultSize,
      }}
      minWidth={400}
      minHeight={300}
      bounds="parent"
      dragHandleClassName="window-header"
      className={`rounded-md overflow-hidden shadow-xl ${isActive ? "z-50" : "z-40"} ${className}`}
      style={{
        position: isMaximized ? "fixed" : "absolute",
        inset: isMaximized ? 0 : undefined,
        width: isMaximized ? "100%" : undefined,
        height: isMaximized ? "calc(100% - 48px)" : undefined,
        top: isMaximized ? 0 : undefined,
        left: isMaximized ? 0 : undefined,
      }}
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      onMouseDown={onFocus}
    >
      <div className="h-full flex flex-col bg-white rounded-md overflow-hidden relative border border-gray-300">
        {/* Windows 11 Style Window Header */}
        <div className="window-header flex items-center justify-between px-2 py-1.5 bg-gray-100 border-b border-gray-300 cursor-move relative">
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              <button 
                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
                onClick={onClose}
              >
                <X className="h-3 w-3 text-gray-600" />
              </button>
              <button 
                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
                onClick={onMinimize}
              >
                <Minus className="h-3 w-3 text-gray-600" />
              </button>
              <button 
                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
                onClick={handleMaximize}
              >
                <Maximize2 className="h-3 w-3 text-gray-600" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              {icon}
              <span className="text-sm font-medium text-gray-800">{title}</span>
            </div>
          </div>
          
          {/* Windows 11 Style Window Controls */}
          <div className="flex gap-1">
            <button className="w-6 h-6 rounded hover:bg-gray-200 flex items-center justify-center">
              <Minimize className="h-3 w-3 text-gray-600" />
            </button>
            <button className="w-6 h-6 rounded hover:bg-gray-200 flex items-center justify-center">
              <Maximize className="h-3 w-3 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-white">{children}</div>
      </div>
    </Rnd>
  );
}