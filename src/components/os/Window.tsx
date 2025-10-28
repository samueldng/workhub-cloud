import { ReactNode, useState } from "react";
import { Rnd } from "react-rnd";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";
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
      className={`rounded-lg overflow-hidden shadow-2xl ${
        isActive ? "z-50" : "z-40"
      }`}
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
      <div className="h-full flex flex-col bg-[hsl(var(--window-bg))] border border-[hsl(var(--window-border))]">
        <div className="window-header flex items-center justify-between px-4 py-2 bg-[hsl(var(--window-header))] border-b border-[hsl(var(--window-border))] cursor-move">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-medium text-foreground">{title}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-muted"
              onClick={onMinimize}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-muted"
              onClick={handleMaximize}
            >
              {isMaximized ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-destructive hover:text-destructive-foreground"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </Rnd>
  );
}
