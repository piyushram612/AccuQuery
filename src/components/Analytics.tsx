import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { orders, disputes, candidates } from '../data/mockData';
import ChartDisplay from './ChartDisplay';
import { ChartData } from '../types';

const Analytics: React.FC = () => {
  // Calculate key metrics
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === 'Completed').length;
  const pendingOrders = orders.filter(order => order.status === 'Pending').length;
  const openDisputes = disputes.filter(dispute => 
    dispute.resolution_status === 'Open' || dispute.resolution_status === 'In Progress'
  ).length;
  
  const completionRate = (completedOrders / totalOrders) * 100;
  const averageTAT = orders
    .filter(order => order.turnaround_time)
    .reduce((sum, order) => sum + (order.turnaround_time || 0), 0) / 
    orders.filter(order => order.turnaround_time).length;

  // Chart data for search type distribution
  const searchTypeChart: ChartData = {
    type: 'doughnut',
    data: {
      labels: ['CRIM', 'EDU', 'EMP', 'MVR', 'DHS'],
      datasets: [{
        data: [
          orders.filter(o => o.search_type === 'CRIM').length,
          orders.filter(o => o.search_type === 'EDU').length,
          orders.filter(o => o.search_type === 'EMP').length,
          orders.filter(o => o.search_type === 'MVR').length,
          orders.filter(o => o.search_type === 'DHS').length,
        ],
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'
        ]
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Orders by Search Type'
        }
      }
    }
  };

  // Status distribution chart
  const statusChart: ChartData = {
    type: 'bar',
    data: {
      labels: ['Draft', 'Pending', 'Completed', 'Discrepancy Found', 'Dispute'],
      datasets: [{
        label: 'Number of Orders',
        data: [
          orders.filter(o => o.status === 'Draft').length,
          orders.filter(o => o.status === 'Pending').length,
          orders.filter(o => o.status === 'Completed').length,
          orders.filter(o => o.status === 'Discrepancy Found').length,
          orders.filter(o => o.status === 'Dispute').length,
        ],
        backgroundColor: ['#6B7280', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6']
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Order Status Distribution'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Comprehensive overview of background screening metrics and trends
        </p>
      </div>

      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{completionRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average TAT</p>
                <p className="text-2xl font-semibold text-gray-900">{averageTAT.toFixed(1)} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Open Disputes</p>
                <p className="text-2xl font-semibold text-gray-900">{openDisputes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <ChartDisplay chartData={searchTypeChart} />
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <ChartDisplay chartData={statusChart} />
          </div>
        </div>

        {/* Additional Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Regions</h3>
            <div className="space-y-3">
              {Object.entries(
                candidates.reduce((acc, candidate) => {
                  acc[candidate.region] = (acc[candidate.region] || 0) + 1;
                  return acc;
                }, {} as { [key: string]: number })
              )
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([region, count]) => (
                  <div key={region} className="flex justify-between">
                    <span className="text-sm text-gray-600">{region}</span>
                    <span className="text-sm font-medium">{count} candidates</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">{completedOrders} orders completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">{pendingOrders} orders pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm">{openDisputes} disputes open</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Fastest TAT</span>
                <span className="text-sm font-medium">1 day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Slowest TAT</span>
                <span className="text-sm font-medium">14 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Most Common</span>
                <span className="text-sm font-medium">CRIM checks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;