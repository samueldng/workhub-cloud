import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Window } from "@/components/os/Window";
import { Taskbar } from "@/components/os/Taskbar";
import { AppLauncher } from "@/components/os/AppLauncher";
import { TextEditor, TextEditorIcon } from "@/components/os/apps/TextEditor";
import { WebBrowser, WebBrowserIcon } from "@/components/os/apps/WebBrowser";
import { Terminal, TerminalAppIcon } from "@/components/os/apps/Terminal";
import { AppWindow } from "lucide-react";

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
  const [isTracking, setIsTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<any>(null);
  const [elapsed, setElapsed] = useState(0);
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
        setElapsed(
          (Date.now() - new Date(currentEntry.started_at).getTime()) / 1000
        );
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
      setElapsed(
        (Date.now() - new Date(data.started_at).getTime()) / 1000
      );
      
      // Auto-start tracking
      toast.success("Timer já estava ativo!");
    } else {
      // Start tracking automatically
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

  const handleLogout = async () => {
    if (isTracking && currentEntry) {
      const duration = Math.floor(
        (Date.now() - new Date(currentEntry.started_at).getTime()) / 1000
      );
      const earnings = ((duration / 3600) * (profile?.hourly_rate || 0)).toFixed(2);

      await supabase
        .from("time_entries")
        .update({
          ended_at: new Date().toISOString(),
          duration_seconds: duration,
          earnings: parseFloat(earnings),
        })
        .eq("id", currentEntry.id);

      toast.success(`Timer parado! Ganho: R$ ${earnings}`);
    }

    await supabase.auth.signOut();
    navigate("/auth");
  };

  const launchApp = (appId: string) => {
    const appConfigs: Record<string, { title: string; icon: React.ReactNode }> = {
      "text-editor": { title: "Editor de Texto", icon: TextEditorIcon },
      browser: { title: "Navegador Web", icon: WebBrowserIcon },
      terminal: { title: "Terminal", icon: TerminalAppIcon },
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

  const renderAppContent = (appId: string) => {
    switch (appId) {
      case "text-editor":
        return <TextEditor />;
      case "browser":
        return <WebBrowser />;
      case "terminal":
        return <Terminal />;
      default:
        return <div>App not found</div>;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background relative">
      {/* Desktop Area */}
      <div className="h-full pb-12 relative">
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

        {showLauncher && (
          <Window
            id="launcher"
            title="Aplicativos"
            icon={<AppWindow className="h-4 w-4" />}
            onClose={() => setShowLauncher(false)}
            onMinimize={() => setShowLauncher(false)}
            isActive={true}
            onFocus={() => {}}
            defaultPosition={{ x: window.innerWidth / 2 - 300, y: 100 }}
            defaultSize={{ width: 600, height: 400 }}
          >
            <AppLauncher
              onLaunchApp={launchApp}
              onClose={() => setShowLauncher(false)}
            />
          </Window>
        )}
      </div>

      {/* Taskbar */}
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
