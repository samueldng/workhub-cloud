import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe, ArrowLeft, ArrowRight, RotateCw } from "lucide-react";

export function WebBrowser() {
  const [url, setUrl] = useState("https://example.com");

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b border-border flex items-center gap-2">
        <Button size="sm" variant="ghost">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost">
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost">
          <RotateCw className="h-4 w-4" />
        </Button>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
          placeholder="Digite uma URL..."
        />
      </div>
      <div className="flex-1 bg-muted flex items-center justify-center">
        <div className="text-center">
          <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Navegador Web Simulado</p>
          <p className="text-sm text-muted-foreground mt-2">
            Em produção, você pode integrar com iframe ou webview
          </p>
        </div>
      </div>
    </div>
  );
}

export const WebBrowserIcon = <Globe className="h-4 w-4" />;
