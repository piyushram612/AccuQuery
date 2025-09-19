import React from 'react';
import { QueryResponse } from '../types';
import ChartDisplay from './ChartDisplay';

interface ResponseDisplayProps {
  response: QueryResponse;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response }) => {
  if (response.type === 'text') {
    return (
      <div className="mt-3 p-4 bg-blue-50 rounded-lg">
        <p className="text-gray-800 mb-3">{response.content.message}</p>
        {response.content.suggestions && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Suggested queries:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {response.content.suggestions.map((suggestion: string, index: number) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  if (response.type === 'table') {
    return (
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
          <thead className="bg-gray-50">
            <tr>
              {response.content.headers.map((header: string, index: number) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {response.content.rows.map((row: any, rowIndex: number) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {response.content.headers.map((header: string, colIndex: number) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row[header] || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {response.content.rows.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No data found matching your query.
          </div>
        )}
      </div>
    );
  }

  if (response.type === 'chart') {
    return (
      <div className="mt-3">
        <ChartDisplay chartData={response.content} />
      </div>
    );
  }

  return null;
};

export default ResponseDisplay;