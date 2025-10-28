import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock, BarChart3, Globe, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Clock className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent">
            Workhour Cloud
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Plataforma completa para trabalho remoto com área de trabalho virtual,
            rastreamento de tempo e cálculo automático de ganhos.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
              Começar Agora
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-lg px-8">
              Fazer Login
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 rounded-lg bg-card border border-border hover:border-primary transition-colors">
            <BarChart3 className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Time Tracking</h3>
            <p className="text-muted-foreground">
              Rastreie seu tempo de trabalho com precisão e calcule seus ganhos automaticamente.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card border border-border hover:border-accent transition-colors">
            <Globe className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-2">Workspace Virtual</h3>
            <p className="text-muted-foreground">
              Área de trabalho completa no navegador com aplicativos integrados e janelas arrastáveis.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card border border-border hover:border-success transition-colors">
            <Zap className="h-12 w-12 text-success mb-4" />
            <h3 className="text-xl font-semibold mb-2">Modo Foco</h3>
            <p className="text-muted-foreground">
              Aumente sua produtividade com timer Pomodoro e relatórios detalhados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
