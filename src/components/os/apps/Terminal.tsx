import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Terminal as TerminalIcon } from "lucide-react";

export function Terminal() {
  const [history, setHistory] = useState<string[]>([
    "Workhour Cloud Terminal v1.0.0",
    "Digite 'help' para ver os comandos disponíveis",
    "",
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let output = "";

    switch (trimmed) {
      case "help":
        output = `Comandos disponíveis:
  help    - Mostra esta mensagem
  clear   - Limpa o terminal
  time    - Mostra o tempo trabalhado
  about   - Sobre o Workhour Cloud`;
        break;
      case "clear":
        setHistory([]);
        return;
      case "time":
        output = "Tempo trabalhado: verificar no dashboard";
        break;
      case "about":
        output = "Workhour Cloud - Plataforma de trabalho remoto";
        break;
      default:
        output = `Comando não encontrado: ${cmd}`;
    }

    setHistory([...history, `$ ${cmd}`, output, ""]);
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
    }
  };

  return (
    <div className="h-full flex flex-col bg-card p-4 font-mono text-sm">
      <div className="flex-1 overflow-auto">
        {history.map((line, i) => (
          <div key={i} className="text-foreground whitespace-pre-wrap">
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
        <span className="text-primary">$</span>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-0 focus-visible:ring-0 p-0"
          autoFocus
        />
      </form>
    </div>
  );
}

export const TerminalAppIcon = <TerminalIcon className="h-4 w-4" />;
