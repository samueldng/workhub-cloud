import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Window } from "@/components/os/Window";
import { Taskbar } from "@/components/os/Taskbar";
import { AppLauncher } from "@/components/os/AppLauncher";
import { TextEditor, TextEditorIcon } from "@/components/os/apps/TextEditor";
import { WebBrowser, WebBrowserIcon } from "@/components/os/apps/WebBrowser";
import { Terminal, TerminalAppIcon } from "@/components/os/apps/Terminal";
import { TimeTrackerWidget } from "@/components/os/TimeTrackerWidget";
import { ChromeApp, ChromeAppIcon } from "@/components/os/apps/ChromeApp";
import { WordApp, WordAppIcon } from "@/components/os/apps/WordApp";
import { ExcelApp, ExcelAppIcon } from "@/components/os/apps/ExcelApp";
import { IDEApp, IDEAppIcon } from "@/components/os/apps/IDEApp";
import { AppWindow, Clock, X } from "lucide-react";

interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon: React.ReactNode;
  isMinimized: boolean;
}

export default function Desktop() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<any>(null);
  const [showLauncher, setShowLauncher] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadProfile(session.user.id);
        checkActiveEntry(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    let interval: any;
    if (isTracking && currentEntry) {
      interval = setInterval(() => {
        setElapsed((Date.now() - new Date(currentEntry.started_at).getTime()) / 1000);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, currentEntry]);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data);
  };

  const checkActiveEntry = async (userId: string) => {
    const { data } = await supabase
      .from("time_entries")
      .select("*")
      .eq("user_id", userId)
      .is("ended_at", null)
      .maybeSingle();

    if (data) {
      setCurrentEntry(data);
      setIsTracking(true);
      setElapsed((Date.now() - new Date(data.started_at).getTime()) / 1000);
      toast.success("Timer já estava ativo!");
    } else {
      // Start tracking automatically when user logs in
      startTracking(userId);
    }
  };

  const startTracking = async (userId: string) => {
    const { data, error } = await supabase
      .from("time_entries")
      .insert({ user_id: userId })
      .select()
      .single();

    if (error) {
      toast.error("Erro ao iniciar timer");
      return;
    }
    setCurrentEntry(data);
    setIsTracking(true);
    toast.success("Timer iniciado!");
  };

  const launchApp = (appId: string) => {
    const appConfigs: Record<string, { title: string; icon: React.ReactNode }> = {
      "text-editor": { title: "Editor de Texto", icon: TextEditorIcon },
      browser: { title: "Navegador Web", icon: WebBrowserIcon },
      terminal: { title: "Terminal", icon: TerminalAppIcon },
      "time-tracker": { title: "Time Tracker", icon: <Clock className="h-4 w-4" /> },
      chrome: { title: "Google Chrome", icon: ChromeAppIcon },
      word: { title: "Microsoft Word", icon: WordAppIcon },
      excel: { title: "Microsoft Excel", icon: ExcelAppIcon },
      ide: { title: "IDE", icon: IDEAppIcon },
    };

    const config = appConfigs[appId];
    if (!config) return;

    const newWindow: WindowState = {
      id: `${appId}-${Date.now()}`,
      appId,
      title: config.title,
      icon: config.icon,
      isMinimized: false,
    };

    setWindows([...windows, newWindow]);
    setActiveWindowId(newWindow.id);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(windows[windows.length - 2]?.id || null);
    }
  };

  const minimizeWindow = (id: string) => {
    setWindows(
      windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  };

  const restoreWindow = (id: string) => {
    setWindows(
      windows.map((w) => (w.id === id ? { ...w, isMinimized: false } : w))
    );
    setActiveWindowId(id);
  };

  const handleTrackingChange = (isTracking: boolean) => {
    // This could be used to update other parts of the UI based on tracking state
  };

  const renderAppContent = (appId: string) => {
    switch (appId) {
      case "text-editor":
        return <TextEditor />;
      case "browser":
        return <WebBrowser />;
      case "terminal":
        return <Terminal />;
      case "time-tracker":
        return <div className="p-4">
          <TimeTrackerWidget profile={profile} onTrackingChange={handleTrackingChange} />
        </div>;
      case "chrome":
        return <ChromeApp />;
      case "word":
        return <WordApp />;
      case "excel":
        return <ExcelApp profile={profile} />;
      case "ide":
        return <IDEApp />;
      default:
        return <div>App not found</div>;
    }
  };

  const handleLogout = async () => {
    // Stop tracking if it's active
    if (isTracking && currentEntry) {
      const duration = Math.floor((Date.now() - new Date(currentEntry.started_at).getTime()) / 1000);
      const earnings = ((duration / 3600) * (profile?.hourly_rate || 25)).toFixed(2);

      await supabase
        .from("time_entries")
        .update({
          ended_at: new Date().toISOString(),
          duration_seconds: duration,
          earnings: parseFloat(earnings)
        })
        .eq("id", currentEntry.id);

      toast.success(`Timer parado! Ganho: R$ ${earnings}`);
    }

    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 relative">
      {/* Windows 11 Style Desktop Background */}
      <div className="absolute inset-0 bg-[url('https://win11.blueedge.me/img/wallpaper.jpg')] bg-cover bg-center opacity-80"></div>
      
      {/* Desktop Area */}
      <div className="h-full pb-12 relative">
        {/* Windows 11 Style Start Menu */}
        <AnimatePresence>
          {showLauncher && (
            <motion.div 
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLauncher(false)}
            >
              <motion.div 
                className="relative"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative bg-gray-50/90 backdrop-blur-xl rounded-lg overflow-hidden shadow-2xl w-[400px] max-h-[600px] border border-gray-300/50">
                  <div className="p-4 max-h-[600px] overflow-y-auto bg-gray-50/80">
                    <AppLauncher
                      onLaunchApp={launchApp}
                      onClose={() => setShowLauncher(false)}
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Default Time Tracker Widget - Windows 11 Style */}
        <div className="absolute top-6 right-6 z-20">
          <div className="relative bg-white/90 rounded-lg overflow-hidden shadow-lg border border-gray-300/50 backdrop-blur-sm">
            <TimeTrackerWidget profile={profile} onTrackingChange={handleTrackingChange} />
          </div>
        </div>

        {windows
          .filter((w) => !w.isMinimized)
          .map((window) => (
            <Window
              key={window.id}
              id={window.id}
              title={window.title}
              icon={window.icon}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              isActive={activeWindowId === window.id}
              onFocus={() => setActiveWindowId(window.id)}
            >
              {renderAppContent(window.appId)}
            </Window>
          ))}
      </div>

      {/* Windows 11 Style Taskbar */}
      <Taskbar
        elapsedTime={elapsed}
        onLogout={handleLogout}
        openApps={windows
          .filter((w) => !w.isMinimized)
          .map((w) => ({ id: w.id, title: w.title, icon: w.icon }))}
        onAppClick={restoreWindow}
        onNewApp={() => setShowLauncher(true)}
      />
    </div>
  );
}