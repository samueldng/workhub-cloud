import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Play, Pause, LogOut, DollarSign, MonitorPlay } from "lucide-react";
import { toast } from "sonner";
import { formatTime } from "@/lib/utils";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<any>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
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
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    setProfile(data);
  };

  const startTracking = async () => {
    const { data, error } = await supabase
      .from("time_entries")
      .insert({ user_id: user.id })
      .select()
      .single();
    
    if (error) {
      toast.error("Erro ao iniciar");
      return;
    }
    setCurrentEntry(data);
    setIsTracking(true);
    toast.success("Timer iniciado!");
  };

  const stopTracking = async () => {
    const duration = Math.floor((Date.now() - new Date(currentEntry.started_at).getTime()) / 1000);
    const earnings = ((duration / 3600) * (profile?.hourly_rate || 0)).toFixed(2);

    await supabase
      .from("time_entries")
      .update({
        ended_at: new Date().toISOString(),
        duration_seconds: duration,
        earnings: parseFloat(earnings)
      })
      .eq("id", currentEntry.id);

    setIsTracking(false);
    setCurrentEntry(null);
    setElapsed(0);
    toast.success(`Timer parado! Ganho: R$ ${earnings}`);
  };


  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold">Workhour Cloud</h1>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/desktop")}>
              <MonitorPlay className="mr-2 h-4 w-4" />
              Área de Trabalho
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tempo Total</p>
                <p className="text-3xl font-bold mt-2">{formatTime(elapsed)}</p>
              </div>
              <Clock className="h-10 w-10 text-primary" />
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valor/Hora</p>
                <p className="text-3xl font-bold mt-2">R$ {profile?.hourly_rate || 0}</p>
              </div>
              <DollarSign className="h-10 w-10 text-success" />
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ganho Atual</p>
                <p className="text-3xl font-bold mt-2">
                  R$ {((elapsed / 3600) * (profile?.hourly_rate || 0)).toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-accent" />
            </div>
          </Card>
        </div>

        <Card className="p-8 bg-card border-border text-center">
          <h2 className="text-2xl font-semibold mb-6">Controle de Tempo</h2>
          <div className="text-6xl font-mono font-bold mb-8 text-primary">
            {formatTime(elapsed)}
          </div>
          <Button
            size="lg"
            onClick={isTracking ? stopTracking : startTracking}
            className="w-48 h-14 text-lg"
          >
            {isTracking ? (
              <>
                <Pause className="mr-2 h-6 w-6" />
                Pausar
              </>
            ) : (
              <>
                <Play className="mr-2 h-6 w-6" />
                Iniciar
              </>
            )}
          </Button>
        </Card>
      </div>
    </div>
  );
}
