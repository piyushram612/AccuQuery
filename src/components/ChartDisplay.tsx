import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { ChartData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

interface ChartDisplayProps {
  chartData: ChartData;
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({ chartData }) => {
  const renderChart = () => {
    const { type, data, options } = chartData;

    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        ...options?.plugins,
      },
      ...options,
    };

    switch (type) {
      case 'bar':
        return <Bar data={data} options={defaultOptions} />;
      case 'line':
        return <Line data={data} options={defaultOptions} />;
      case 'pie':
        return <Pie data={data} options={defaultOptions} />;
      case 'doughnut':
        return <Doughnut data={data} options={defaultOptions} />;
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow" style={{ height: '400px' }}>
      {renderChart()}
    </div>
  );
};

export default ChartDisplay;