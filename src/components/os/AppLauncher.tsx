import { FileText, Globe, Terminal, Calculator, Calendar, Clock, Chrome, Table, Code, AppWindow } from "lucide-react";
import { motion } from "framer-motion";

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
  {
    id: "time-tracker",
    name: "Time Tracker",
    icon: <Clock className="h-8 w-8" />,
    description: "Controle de tempo e ganhos",
  },
  {
    id: "chrome",
    name: "Google Chrome",
    icon: <Chrome className="h-8 w-8" />,
    description: "Navegador web Chrome",
  },
  {
    id: "word",
    name: "Microsoft Word",
    icon: <FileText className="h-8 w-8" />,
    description: "Editor de documentos",
  },
  {
    id: "excel",
    name: "Microsoft Excel",
    icon: <Table className="h-8 w-8" />,
    description: "Planilhas eletrônicas",
  },
  {
    id: "ide",
    name: "IDE",
    icon: <Code className="h-8 w-8" />,
    description: "Ambiente de desenvolvimento",
  },
];

interface AppLauncherProps {
  onLaunchApp: (appId: string) => void;
  onClose: () => void;
}

export function AppLauncher({ onLaunchApp, onClose }: AppLauncherProps) {
  return (
    <div className="p-4">
      {/* Windows 11 Style Pinned Apps Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3 text-gray-600 uppercase tracking-wide">Pinned</h3>
        <div className="grid grid-cols-6 gap-3">
          {availableApps.slice(0, 6).map((app) => (
            <motion.div
              key={app.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
              onClick={() => {
                onLaunchApp(app.id);
                onClose();
              }}
            >
              <div className="p-3 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-300 hover:border-blue-400 transition-all duration-200 relative overflow-hidden group shadow-md">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors duration-200">
                    <div className="text-blue-500 group-hover:text-blue-600 transition-colors duration-200">{app.icon}</div>
                  </div>
                  <div className="font-medium text-gray-800 text-xs truncate w-full">{app.name}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Windows 11 Style All Apps Section */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-600 uppercase tracking-wide">All Apps</h3>
        <div className="grid grid-cols-4 gap-2">
          {availableApps.map((app) => (
            <motion.div
              key={app.id}
              whileHover={{ backgroundColor: '#f3f4f6' }}
              className="cursor-pointer p-2 rounded flex items-center gap-3 hover:bg-gray-100 transition-colors"
              onClick={() => {
                onLaunchApp(app.id);
                onClose();
              }}
            >
              <div className="p-2 rounded-lg bg-gray-100">
                <div className="text-blue-500">{app.icon}</div>
              </div>
              <span className="text-gray-800 text-sm">{app.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}