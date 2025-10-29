import { Clock, LogOut, Plus, AppWindow, Search, Wifi, Volume2 } from "lucide-react";
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
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-gray-900/80 backdrop-blur-md flex items-center justify-between px-4 z-50 border-t border-gray-700/50">
      <div className="flex items-center gap-2">
        {/* Windows 11 Style Start Button */}
        <button
          className="w-10 h-10 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all"
          onClick={onNewApp}
        >
          <AppWindow className="h-5 w-5 text-white" />
        </button>
        
        {/* Windows 11 Style Search Bar */}
        <div className="hidden md:flex items-center h-10 px-4 bg-gray-700/30 rounded-md border border-gray-600/50 text-gray-300 text-sm ml-2">
          <Search className="h-4 w-4 mr-2" />
          <span>Type here to search</span>
        </div>
        
        <div className="flex items-center gap-1 ml-2">
          {openApps.map((app) => (
            <button
              key={app.id}
              className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-gray-700/50 transition-colors"
              onClick={() => onAppClick(app.id)}
            >
              <div className="text-white text-lg">{app.icon}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Windows 11 Style System Tray */}
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded-sm bg-gray-700/50 flex items-center justify-center">
            <Wifi className="h-4 w-4 text-gray-300" />
          </div>
          <div className="w-6 h-6 rounded-sm bg-gray-700/50 flex items-center justify-center">
            <Volume2 className="h-4 w-4 text-gray-300" />
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-white text-sm">
          <Clock className="h-4 w-4" />
          <span>{formatTime(elapsedTime)}</span>
        </div>
        
        <button
          className="w-10 h-10 rounded-md hover:bg-gray-700/50 transition-colors flex items-center justify-center"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
}