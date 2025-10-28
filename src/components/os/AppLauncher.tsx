import { FileText, Globe, Terminal, Calculator, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

interface App {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const availableApps: App[] = [
  {
    id: "text-editor",
    name: "Editor de Texto",
    icon: <FileText className="h-8 w-8" />,
    description: "Editor de texto simples",
  },
  {
    id: "browser",
    name: "Navegador",
    icon: <Globe className="h-8 w-8" />,
    description: "Navegador web simulado",
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: <Terminal className="h-8 w-8" />,
    description: "Terminal de comandos",
  },
];

interface AppLauncherProps {
  onLaunchApp: (appId: string) => void;
  onClose: () => void;
}

export function AppLauncher({ onLaunchApp, onClose }: AppLauncherProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Aplicativos</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {availableApps.map((app) => (
          <Card
            key={app.id}
            className="p-4 cursor-pointer hover:bg-accent transition-colors"
            onClick={() => {
              onLaunchApp(app.id);
              onClose();
            }}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className="text-primary">{app.icon}</div>
              <div className="font-medium">{app.name}</div>
              <div className="text-xs text-muted-foreground">{app.description}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
