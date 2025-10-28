import { Code } from "lucide-react";

export const IDEAppIcon = <Code className="h-4 w-4" />;

export function IDEApp() {
  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-300">
      <div className="bg-gray-800 p-2 flex items-center border-b border-gray-700">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 mx-4 text-sm">
          <span className="text-blue-400">src/</span>
          <span className="text-yellow-400">main.tsx</span>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-gray-800 border-r border-gray-700 p-2">
          <div className="font-semibold mb-2">EXPLORER</div>
          <div className="text-sm space-y-1">
            <div className="text-blue-400">workhour-cloud</div>
            <div className="ml-4">src</div>
            <div className="ml-8 text-yellow-400">components</div>
            <div className="ml-8 text-yellow-400">pages</div>
            <div className="ml-8">main.tsx</div>
            <div className="ml-8 text-yellow-400">styles</div>
            <div className="ml-4">public</div>
            <div className="ml-4">package.json</div>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="bg-gray-800 p-2 text-sm border-b border-gray-700">
            <span className="text-blue-400">main.tsx</span>
          </div>
          <div className="flex-1 font-mono text-sm p-4 overflow-auto">
            <div><span className="text-purple-400">import</span> {"{"} createRoot {"}"} <span className="text-purple-400">from</span> <span className="text-green-400">"react-dom/client"</span>;</div>
            <div><span className="text-purple-400">import</span> App <span className="text-purple-400">from</span> <span className="text-green-400">"./App"</span>;</div>
            <div><span className="text-purple-400">import</span> <span className="text-green-400">"./index.css"</span>;</div>
            <div></div>
            <div>createRoot(document.getElementById(<span className="text-green-400">"root"</span>)!).render(&lt;App /&gt;);</div>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 p-2 text-xs border-t border-gray-700 flex justify-between">
        <div>Ln 7, Col 15</div>
        <div>TypeScript</div>
        <div>UTF-8</div>
      </div>
    </div>
  );
}