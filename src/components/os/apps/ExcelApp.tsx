import { Table } from "lucide-react";

export const ExcelAppIcon = <Table className="h-4 w-4" />;

interface ExcelAppProps {
  profile?: {
    hourly_rate?: number;
  };
}

export function ExcelApp({ profile }: ExcelAppProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-[hsl(var(--window-header))] p-2 flex items-center border-b border-[hsl(var(--window-border))]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 mx-4 bg-[hsl(var(--window-bg))] rounded px-3 py-1 text-sm">
          Planilha1.xlsx
        </div>
      </div>
      <div className="flex-1 bg-white p-4">
        <div className="overflow-auto h-full">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-100"></th>
                <th className="border p-2 bg-gray-100">A</th>
                <th className="border p-2 bg-gray-100">B</th>
                <th className="border p-2 bg-gray-100">C</th>
                <th className="border p-2 bg-gray-100">D</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(20)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border p-2 bg-gray-100 font-bold">{rowIndex + 1}</td>
                  {[...Array(4)].map((_, colIndex) => (
                    <td key={colIndex} className="border p-2">
                      {rowIndex === 0 && colIndex === 0 ? "Nome" : 
                       rowIndex === 0 && colIndex === 1 ? "Valor/Hora" : 
                       rowIndex === 0 && colIndex === 2 ? "Horas Trabalhadas" : 
                       rowIndex === 0 && colIndex === 3 ? "Total" : 
                       rowIndex === 1 && colIndex === 0 ? "Trabalho 1" : 
                       rowIndex === 1 && colIndex === 1 ? `R$ ${(profile?.hourly_rate || 25)}` : 
                       rowIndex === 1 && colIndex === 2 ? "8" : 
                       rowIndex === 1 && colIndex === 3 ? `R$ ${8 * (profile?.hourly_rate || 25)}` : 
                       ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}