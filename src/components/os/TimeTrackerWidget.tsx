import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Play, Pause, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatTime } from "@/lib/utils";
import { toast } from "sonner";

interface TimeTrackerWidgetProps {
  profile: any;
  onTrackingChange?: (isTracking: boolean) => void;
}

export function TimeTrackerWidget({ profile, onTrackingChange }: TimeTrackerWidgetProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<any>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    checkActiveEntry();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isTracking && currentEntry) {
      interval = setInterval(() => {
        setElapsed((Date.now() - new Date(currentEntry.started_at).getTime()) / 1000);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, currentEntry]);

  const checkActiveEntry = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from("time_entries")
      .select("*")
      .eq("user_id", session.user.id)
      .is("ended_at", null)
      .maybeSingle();

    if (data) {
      setCurrentEntry(data);
      setIsTracking(true);
      setElapsed((Date.now() - new Date(data.started_at).getTime()) / 1000);
      onTrackingChange?.(true);
    }
  };

  const startTracking = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("time_entries")
      .insert({ user_id: session.user.id })
      .select()
      .single();
    
    if (error) {
      toast.error("Erro ao iniciar timer");
      return;
    }
    setCurrentEntry(data);
    setIsTracking(true);
    onTrackingChange?.(true);
    toast.success("Timer iniciado!");
  };

  const stopTracking = async () => {
    if (!currentEntry) return;

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

    setIsTracking(false);
    setCurrentEntry(null);
    setElapsed(0);
    onTrackingChange?.(false);
    toast.success(`Timer parado! Ganho: R$ ${earnings}`);
  };

  return (
    <Card className="p-4 bg-card border-border w-80 backdrop-blur-sm bg-opacity-90">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Time Tracker
        </h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Tempo</p>
            <p className="text-lg font-mono">{formatTime(elapsed)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Valor/Hora</p>
            <p className="text-lg">R$ {profile?.hourly_rate || 25}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-muted-foreground">Ganho</p>
            <p className="text-lg">R$ {((elapsed / 3600) * (profile?.hourly_rate || 25)).toFixed(2)}</p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={isTracking ? stopTracking : startTracking}
          className="w-full"
        >
          {isTracking ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pausar
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Iniciar
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}