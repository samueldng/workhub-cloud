import { Chrome } from "lucide-react";

export const ChromeAppIcon = <Chrome className="h-4 w-4" />;

export function ChromeApp() {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-[hsl(var(--window-header))] p-2 flex items-center border-b border-[hsl(var(--window-border))]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 mx-4 bg-[hsl(var(--window-bg))] rounded px-3 py-1 text-sm">
          https://www.google.com
        </div>
      </div>
      <div className="flex-1 bg-white flex items-center justify-center">
        <div className="text-center">
          <Chrome className="h-16 w-16 mx-auto text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Google Chrome</h2>
          <p className="text-gray-600">Navegador Web</p>
        </div>
      </div>
    </div>
  );
}