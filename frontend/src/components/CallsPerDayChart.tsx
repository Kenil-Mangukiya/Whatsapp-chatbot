import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getCallsPerDay, CallsPerDayItem } from '../services/apis/callAPI';
import { Calendar, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

interface CallsPerDayChartProps {
  isActive?: boolean;
}

const CallsPerDayChart: React.FC<CallsPerDayChartProps> = ({ isActive }) => {
  const [data, setData] = useState<CallsPerDayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'7d' | '30d' | '90d' | 'all' | 'custom'>('30d');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showCustomFilter, setShowCustomFilter] = useState(false);

  useEffect(() => {
    if (isActive) {
      fetchCallsPerDay();
    }
  }, [isActive, filter, startDate, endDate]);

  const fetchCallsPerDay = async () => {
    try {
      setLoading(true);
      
      let start: string | undefined;
      let end: string | undefined;
      
      if (filter === 'custom') {
        start = startDate || undefined;
        end = endDate || undefined;
      } else if (filter !== 'all') {
        const endDateObj = new Date();
        const startDateObj = new Date();
        
        if (filter === '7d') {
          startDateObj.setDate(endDateObj.getDate() - 7);
        } else if (filter === '30d') {
          startDateObj.setDate(endDateObj.getDate() - 30);
        } else if (filter === '90d') {
          startDateObj.setDate(endDateObj.getDate() - 90);
        }
        
        start = startDateObj.toISOString().split('T')[0];
        end = endDateObj.toISOString().split('T')[0];
      }
      
      const response = await getCallsPerDay(start, end);
      if (response.data) {
        setData(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching calls per day:', error);
      toast.error(error.message || 'Failed to fetch call data');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="chart-tooltip-label">{formatDate(payload[0].payload.date)}</p>
          <p className="chart-tooltip-value">
            <span className="chart-tooltip-count">{payload[0].value}</span> calls
          </p>
        </div>
      );
    }
    return null;
  };

  // Get color for bars based on count
  const getBarColor = (count: number): string => {
    if (count === 0) return '#E5E7EB';
    if (count < 5) return '#818CF8';
    if (count < 10) return '#6366F1';
    return '#4F46E5';
  };

  return (
    <div className="calls-per-day-chart-container">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Calls Per Day</h3>
          <p className="chart-subtitle">Daily call volume overview</p>
        </div>
        <div className="chart-filters">
          <button
            className={`filter-btn ${filter === '7d' ? 'active' : ''}`}
            onClick={() => setFilter('7d')}
          >
            7 Days
          </button>
          <button
            className={`filter-btn ${filter === '30d' ? 'active' : ''}`}
            onClick={() => setFilter('30d')}
          >
            30 Days
          </button>
          <button
            className={`filter-btn ${filter === '90d' ? 'active' : ''}`}
            onClick={() => setFilter('90d')}
          >
            90 Days
          </button>
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Time
          </button>
          <button
            className={`filter-btn ${filter === 'custom' ? 'active' : ''}`}
            onClick={() => {
              setFilter('custom');
              setShowCustomFilter(!showCustomFilter);
            }}
          >
            <Calendar size={16} />
            Custom
          </button>
        </div>
      </div>

      {showCustomFilter && filter === 'custom' && (
        <div className="custom-date-filter">
          <div className="date-input-group">
            <label>
              <Calendar size={16} />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />
          </div>
          <div className="date-input-group">
            <label>
              <Calendar size={16} />
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
            />
          </div>
          <button
            className="apply-filter-btn"
            onClick={fetchCallsPerDay}
          >
            <Filter size={16} />
            Apply Filter
          </button>
        </div>
      )}

      <div className="chart-wrapper">
        {loading ? (
          <div className="chart-loading">
            <div className="loading-spinner"></div>
            <p>Loading chart data...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="chart-empty">
            <p>No call data available for the selected period</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                label={{ value: 'Number of Calls', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                radius={[8, 8, 0, 0]}
                onMouseEnter={(data, index) => {
                  // Add hover effect
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.count)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default CallsPerDayChart;


