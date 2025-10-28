import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, FileText } from "lucide-react";
import { toast } from "sonner";

export function TextEditor() {
  const [content, setContent] = useState("");

  const handleSave = () => {
    // Aqui você pode integrar com Supabase para salvar o documento
    toast.success("Documento salvo!");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b border-border flex items-center gap-2">
        <Button size="sm" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Salvar
        </Button>
      </div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Digite seu texto aqui..."
        className="flex-1 resize-none border-0 rounded-none focus-visible:ring-0 font-mono"
      />
    </div>
  );
}

export const TextEditorIcon = <FileText className="h-4 w-4" />;
