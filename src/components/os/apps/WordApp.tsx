import { FileText } from "lucide-react";

export const WordAppIcon = <FileText className="h-4 w-4" />;

export function WordApp() {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-[hsl(var(--window-header))] p-2 flex items-center border-b border-[hsl(var(--window-border))]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 mx-4 bg-[hsl(var(--window-bg))] rounded px-3 py-1 text-sm">
          Documento1.docx
        </div>
      </div>
      <div className="flex-1 bg-white p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Documento sem título</h1>
          <div className="space-y-4 text-gray-800">
            <p>Bem-vindo ao Microsoft Word integrado ao Workhour Cloud!</p>
            <p>Este é um editor de texto simulado que permite criar e editar documentos.</p>
            <p className="mt-8">Recursos disponíveis:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Formatação de texto</li>
              <li>Listas e tabelas</li>
              <li>Inserção de imagens</li>
              <li>Verificação ortográfica</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}