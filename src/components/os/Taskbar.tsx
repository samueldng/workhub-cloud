import { Clock, LogOut, Plus, AppWindow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";

interface TaskbarProps {
  elapsedTime: number;
  onLogout: () => void;
  openApps: Array<{ id: string; title: string; icon: React.ReactNode }>;
  onAppClick: (id: string) => void;
  onNewApp: () => void;
}

export function Taskbar({ elapsedTime, onLogout, openApps, onAppClick, onNewApp }: TaskbarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-[hsl(var(--taskbar-bg))] border-t border-[hsl(var(--window-border))] flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-[hsl(var(--taskbar-foreground))] hover:bg-[hsl(var(--taskbar-hover))]"
          onClick={onNewApp}
        >
          <AppWindow className="h-4 w-4 mr-2" />
          Apps
        </Button>
        
        <div className="flex items-center gap-2">
          {openApps.map((app) => (
            <Button
              key={app.id}
              variant="ghost"
              size="sm"
              className="text-[hsl(var(--taskbar-foreground))] hover:bg-[hsl(var(--taskbar-hover))]"
              onClick={() => onAppClick(app.id)}
            >
              {app.icon}
              <span className="ml-2 max-w-32 truncate">{app.title}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-[hsl(var(--taskbar-foreground))]">
          <Clock className="h-4 w-4" />
          <span className="font-mono text-sm">{formatTime(elapsedTime)}</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-[hsl(var(--taskbar-foreground))] hover:bg-[hsl(var(--taskbar-hover))]"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
