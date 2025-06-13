import React from 'react';
import GlassCard from './GlassCard';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  className?: string;
}

const Table: React.FC<TableProps> = ({ columns, data, className = '' }) => {
  return (
    <GlassCard className={className}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200/50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left py-4 px-6 text-sm font-semibold text-slate-700"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="border-b border-slate-200/30 hover:bg-white/50 transition-colors duration-200"
              >
                {columns.map((column) => (
                  <td key={column.key} className="py-4 px-6 text-sm text-slate-600">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

export default Table;