import { candidates, orders, disputes } from '../data/mockData';
import { UserRole, QueryResponse, ChartData } from '../types';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';

export class QueryProcessor {
  private role: UserRole;

  constructor(role: UserRole) {
    this.role = role;
  }

  processQuery(query: string): QueryResponse {
    const queryLower = query.toLowerCase();
    
    // Pending checks queries
    if (queryLower.includes('pending') && (queryLower.includes('crim') || queryLower.includes('criminal'))) {
      return this.getPendingChecks('CRIM', queryLower);
    }
    
    if (queryLower.includes('pending') && queryLower.includes('edu')) {
      return this.getPendingChecks('EDU', queryLower);
    }
    
    if (queryLower.includes('pending') && queryLower.includes('emp')) {
      return this.getPendingChecks('EMP', queryLower);
    }
    
    // Average TAT queries
    if (queryLower.includes('average') && queryLower.includes('tat')) {
      return this.getAverageTAT(queryLower);
    }
    
    // Turnaround time queries
    if (queryLower.includes('turnaround') || queryLower.includes('tat')) {
      return this.getTurnaroundAnalysis(queryLower);
    }
    
    // Disputes queries
    if (queryLower.includes('dispute')) {
      return this.getDisputeAnalysis(queryLower);
    }
    
    // Status distribution
    if (queryLower.includes('status') && (queryLower.includes('distribution') || queryLower.includes('breakdown'))) {
      return this.getStatusDistribution();
    }
    
    // Completion rates
    if (queryLower.includes('completion') && queryLower.includes('rate')) {
      return this.getCompletionRates();
    }
    
    // Volume trends
    if (queryLower.includes('volume') || queryLower.includes('trend')) {
      return this.getVolumeTrends();
    }
    
    // Discrepancy analysis
    if (queryLower.includes('discrepan')) {
      return this.getDiscrepancyAnalysis();
    }
    
    // Regional analysis
    if (queryLower.includes('region')) {
      return this.getRegionalAnalysis();
    }
    
    // Default response with suggestions
    return this.getDefaultResponse();
  }

  private getPendingChecks(searchType: string, query: string): QueryResponse {
    let filteredOrders = orders.filter(order => 
      order.search_type === searchType && order.status === 'Pending'
    );

    // Filter by time period
    if (query.includes('this week')) {
      const weekStart = startOfWeek(new Date());
      const weekEnd = endOfWeek(new Date());
      filteredOrders = filteredOrders.filter(order => {
        const startDate = new Date(order.start_date);
        return startDate >= weekStart && startDate <= weekEnd;
      });
    }

    const tableData = filteredOrders.map(order => {
      const candidate = candidates.find(c => c.candidate_id === order.candidate_id);
      const daysWaiting = differenceInDays(new Date(), new Date(order.start_date));
      
      return this.role === 'Recruiter' ? {
        'Order ID': order.order_id,
        'Candidate': candidate?.name || 'Unknown',
        'Search Type': order.search_type,
        'Started': order.start_date,
        'Days Waiting': daysWaiting
      } : {
        'Order ID': order.order_id,
        'Search Type': order.search_type,
        'Started': order.start_date,
        'Days Waiting': daysWaiting,
        'Region': candidate?.region || 'Unknown'
      };
    });

    return {
      type: 'table',
      content: {
        headers: Object.keys(tableData[0] || {}),
        rows: tableData
      },
      summary: `Found ${filteredOrders.length} pending ${searchType} checks${query.includes('this week') ? ' this week' : ''}`
    };
  }

  private getAverageTAT(query: string): QueryResponse {
    const completedOrders = orders.filter(order => 
      order.status === 'Completed' && order.turnaround_time
    );

    let searchType = '';
    if (query.includes('edu')) searchType = 'EDU';
    else if (query.includes('crim')) searchType = 'CRIM';
    else if (query.includes('emp')) searchType = 'EMP';
    else if (query.includes('mvr')) searchType = 'MVR';
    else if (query.includes('dhs')) searchType = 'DHS';

    let filteredOrders = completedOrders;
    if (searchType) {
      filteredOrders = completedOrders.filter(order => order.search_type === searchType);
    }

    // Time period filtering
    if (query.includes('last quarter') || query.includes('quarter')) {
      const threeMonthsAgo = subDays(new Date(), 90);
      filteredOrders = filteredOrders.filter(order => 
        new Date(order.start_date) >= threeMonthsAgo
      );
    }

    const avgTAT = filteredOrders.reduce((sum, order) => sum + (order.turnaround_time || 0), 0) / filteredOrders.length;

    // Create chart data by search type
    const tatByType: { [key: string]: number[] } = {};
    filteredOrders.forEach(order => {
      if (!tatByType[order.search_type]) {
        tatByType[order.search_type] = [];
      }
      tatByType[order.search_type].push(order.turnaround_time || 0);
    });

    const chartLabels = Object.keys(tatByType);
    const chartData = chartLabels.map(type => 
      tatByType[type].reduce((sum, tat) => sum + tat, 0) / tatByType[type].length
    );

    const chart: ChartData = {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Average TAT (Days)',
          data: chartData,
          backgroundColor: [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'
          ].slice(0, chartLabels.length)
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Average Turnaround Time${searchType ? ` - ${searchType}` : ''}`
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Days'
            }
          }
        }
      }
    };

    return {
      type: 'chart',
      content: chart,
      summary: `Average TAT${searchType ? ` for ${searchType}` : ''}: ${avgTAT.toFixed(1)} days (based on ${filteredOrders.length} completed orders)`
    };
  }

  private getDisputeAnalysis(query: string): QueryResponse {
    let filteredDisputes = [...disputes];

    if (query.includes('unresolved') || query.includes('open')) {
      filteredDisputes = disputes.filter(dispute => 
        dispute.resolution_status === 'Open' || dispute.resolution_status === 'In Progress'
      );
      
      if (query.includes('7 days') || query.includes('week')) {
        const sevenDaysAgo = subDays(new Date(), 7);
        filteredDisputes = filteredDisputes.filter(dispute =>
          new Date(dispute.created_date) <= sevenDaysAgo
        );
      }
    }

    if (this.role === 'Compliance Officer') {
      const tableData = filteredDisputes.map(dispute => {
        const order = orders.find(o => o.order_id === dispute.order_id);
        const candidate = candidates.find(c => c.candidate_id === order?.candidate_id);
        const daysOpen = differenceInDays(new Date(), new Date(dispute.created_date));
        
        return {
          'Dispute ID': dispute.dispute_id,
          'Order ID': dispute.order_id,
          'Candidate': candidate?.name || 'Unknown',
          'Search Type': order?.search_type || 'Unknown',
          'Reason': dispute.reason,
          'Status': dispute.resolution_status,
          'Days Open': daysOpen,
          'Risk Level': daysOpen > 14 ? '🔴 High' : daysOpen > 7 ? '🟡 Medium' : '🟢 Low'
        };
      });

      return {
        type: 'table',
        content: {
          headers: Object.keys(tableData[0] || {}),
          rows: tableData
        },
        summary: `Found ${filteredDisputes.length} disputes${query.includes('unresolved') ? ' requiring attention' : ''}. ${filteredDisputes.filter(d => differenceInDays(new Date(), new Date(d.created_date)) > 14).length} are high-risk (>14 days old).`
      };
    }

    // For other roles, show aggregated data
    const statusCounts = filteredDisputes.reduce((acc, dispute) => {
      acc[dispute.resolution_status] = (acc[dispute.resolution_status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const chart: ChartData = {
      type: 'pie',
      data: {
        labels: Object.keys(statusCounts),
        datasets: [{
          data: Object.values(statusCounts),
          backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#8B5CF6']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Dispute Resolution Status Distribution'
          }
        }
      }
    };

    return {
      type: 'chart',
      content: chart,
      summary: `Dispute analysis: ${filteredDisputes.length} total disputes with varying resolution statuses.`
    };
  }

  private getStatusDistribution(): QueryResponse {
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const chart: ChartData = {
      type: 'doughnut',
      data: {
        labels: Object.keys(statusCounts),
        datasets: [{
          data: Object.values(statusCounts),
          backgroundColor: [
            '#6B7280', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Order Status Distribution'
          }
        }
      }
    };

    return {
      type: 'chart',
      content: chart,
      summary: `Status breakdown: ${orders.length} total orders across ${Object.keys(statusCounts).length} different statuses.`
    };
  }

  private getCompletionRates(): QueryResponse {
    const searchTypeCounts = orders.reduce((acc, order) => {
      if (!acc[order.search_type]) {
        acc[order.search_type] = { total: 0, completed: 0 };
      }
      acc[order.search_type].total++;
      if (order.status === 'Completed') {
        acc[order.search_type].completed++;
      }
      return acc;
    }, {} as { [key: string]: { total: number, completed: number } });

    const chartLabels = Object.keys(searchTypeCounts);
    const completionRates = chartLabels.map(type => 
      (searchTypeCounts[type].completed / searchTypeCounts[type].total) * 100
    );

    const chart: ChartData = {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Completion Rate (%)',
          data: completionRates,
          backgroundColor: '#10B981'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Completion Rates by Search Type'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Completion Rate (%)'
            }
          }
        }
      }
    };

    const overallRate = (orders.filter(o => o.status === 'Completed').length / orders.length) * 100;

    return {
      type: 'chart',
      content: chart,
      summary: `Overall completion rate: ${overallRate.toFixed(1)}%. Rates vary by search type with ${chartLabels[completionRates.indexOf(Math.max(...completionRates))]} having the highest rate.`
    };
  }

  private getTurnaroundAnalysis(query: string): QueryResponse {
    const completedOrders = orders.filter(order => 
      order.status === 'Completed' && order.turnaround_time
    );

    // Group by week for trend analysis
    const weeklyData: { [key: string]: number[] } = {};
    completedOrders.forEach(order => {
      const weekStart = format(startOfWeek(new Date(order.start_date!)), 'yyyy-MM-dd');
      if (!weeklyData[weekStart]) {
        weeklyData[weekStart] = [];
      }
      weeklyData[weekStart].push(order.turnaround_time!);
    });

    const sortedWeeks = Object.keys(weeklyData).sort();
    const avgTATByWeek = sortedWeeks.map(week => 
      weeklyData[week].reduce((sum, tat) => sum + tat, 0) / weeklyData[week].length
    );

    const chart: ChartData = {
      type: 'line',
      data: {
        labels: sortedWeeks.slice(-8), // Last 8 weeks
        datasets: [{
          label: 'Average TAT (Days)',
          data: avgTATByWeek.slice(-8),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Turnaround Time Trend (Last 8 Weeks)'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Days'
            }
          }
        }
      }
    };

    const currentTrend = avgTATByWeek.slice(-2);
    const trendDirection = currentTrend.length === 2 && currentTrend[1] > currentTrend[0] ? 'increasing' : 'stable/decreasing';

    return {
      type: 'chart',
      content: chart,
      summary: `TAT trend analysis shows ${trendDirection} turnaround times. Current average: ${avgTATByWeek[avgTATByWeek.length - 1]?.toFixed(1) || 'N/A'} days.`
    };
  }

  private getDiscrepancyAnalysis(): QueryResponse {
    const discrepancyOrders = orders.filter(order => order.status === 'Discrepancy Found');
    
    const searchTypeCounts = discrepancyOrders.reduce((acc, order) => {
      acc[order.search_type] = (acc[order.search_type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const chart: ChartData = {
      type: 'bar',
      data: {
        labels: Object.keys(searchTypeCounts),
        datasets: [{
          label: 'Discrepancies Found',
          data: Object.values(searchTypeCounts),
          backgroundColor: '#EF4444'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Discrepancies by Search Type'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Discrepancies'
            }
          }
        }
      }
    };

    const discrepancyRate = (discrepancyOrders.length / orders.length) * 100;

    return {
      type: 'chart',
      content: chart,
      summary: `Found ${discrepancyOrders.length} orders with discrepancies (${discrepancyRate.toFixed(1)}% of all orders). ${Object.keys(searchTypeCounts)[0] || 'N/A'} searches have the most discrepancies.`
    };
  }

  private getRegionalAnalysis(): QueryResponse {
    const regionalCounts = orders.reduce((acc, order) => {
      const candidate = candidates.find(c => c.candidate_id === order.candidate_id);
      const region = candidate?.region || 'Unknown';
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const chart: ChartData = {
      type: 'bar',
      data: {
        labels: Object.keys(regionalCounts),
        datasets: [{
          label: 'Orders by Region',
          data: Object.values(regionalCounts),
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Order Volume by Region'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Orders'
            }
          }
        }
      }
    };

    const topRegion = Object.keys(regionalCounts).reduce((a, b) => 
      regionalCounts[a] > regionalCounts[b] ? a : b
    );

    return {
      type: 'chart',
      content: chart,
      summary: `Regional analysis shows ${topRegion} has the highest order volume with ${regionalCounts[topRegion]} orders.`
    };
  }

  private getVolumeeTrends(): QueryResponse {
    // Group orders by month
    const monthlyData: { [key: string]: number } = {};
    orders.forEach(order => {
      const month = format(new Date(order.start_date), 'yyyy-MM');
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    const volumes = sortedMonths.map(month => monthlyData[month]);

    const chart: ChartData = {
      type: 'line',
      data: {
        labels: sortedMonths.slice(-6), // Last 6 months
        datasets: [{
          label: 'Order Volume',
          data: volumes.slice(-6),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Order Volume Trend (Last 6 Months)'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Orders'
            }
          }
        }
      }
    };

    const totalVolume = orders.length;
    const avgMonthlyVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;

    return {
      type: 'chart',
      content: chart,
      summary: `Volume trends show ${totalVolume} total orders with an average of ${avgMonthlyVolume.toFixed(0)} orders per month.`
    };
  }

  private getDefaultResponse(): QueryResponse {
    const suggestions = [
      "Show all pending CRIM checks this week",
      "What is the average TAT for EDU checks last quarter?",
      "List disputes unresolved for more than 7 days",
      "Show completion rates by search type",
      "Display turnaround time trends",
      "Analyze discrepancies by search type",
      "Show order volume by region"
    ];

    return {
      type: 'text',
      content: {
        message: "I can help you analyze background check data. Here are some example queries you can try:",
        suggestions
      },
      summary: "Provided query suggestions for background check analysis"
    };
  }
}