import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface SentimentPieChartProps {
  sentimentCounts: {
    Positive: number;
    Negative: number;
    Neutral: number;
    Unknown: number;
  };
  loading?: boolean;
}

const SentimentPieChart: React.FC<SentimentPieChartProps> = ({ sentimentCounts, loading = false }) => {
  // Calculate total for percentages
  const total = sentimentCounts.Positive + sentimentCounts.Negative + 
                sentimentCounts.Neutral + sentimentCounts.Unknown;

  // Prepare data for pie chart
  const data = [
    {
      name: 'Positive',
      value: sentimentCounts.Positive,
      percentage: total > 0 ? Math.round((sentimentCounts.Positive / total) * 100) : 0,
      color: '#10B981' // Green
    },
    {
      name: 'Negative',
      value: sentimentCounts.Negative,
      percentage: total > 0 ? Math.round((sentimentCounts.Negative / total) * 100) : 0,
      color: '#EF4444' // Red
    },
    {
      name: 'Neutral',
      value: sentimentCounts.Neutral,
      percentage: total > 0 ? Math.round((sentimentCounts.Neutral / total) * 100) : 0,
      color: '#3B82F6' // Blue
    },
    {
      name: 'Unknown',
      value: sentimentCounts.Unknown,
      percentage: total > 0 ? Math.round((sentimentCounts.Unknown / total) * 100) : 0,
      color: '#6B7280' // Gray
    }
  ].filter(item => item.value > 0); // Only show sentiments with values > 0

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="sentiment-chart-tooltip">
          <p className="sentiment-tooltip-label">{data.name}</p>
          <p className="sentiment-tooltip-value">
            <span className="sentiment-tooltip-count">{data.value}</span> calls
          </p>
          <p className="sentiment-tooltip-percentage">
            {data.payload.percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label function with better visibility
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value, payload }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Use white text with strong shadow for better visibility on all colors
    return (
      <text
        x={x}
        y={y}
        fill="#FFFFFF"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="15"
        fontWeight="800"
        className="pie-chart-label"
        style={{
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.6), -1px -1px 2px rgba(0, 0, 0, 0.5)',
          stroke: 'rgba(0, 0, 0, 0.3)',
          strokeWidth: '0.5px',
          paintOrder: 'stroke fill'
        }}
      >
        {`${name} ${payload.percentage}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="sentiment-pie-chart-container">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Sentiment Distribution</h3>
            <p className="chart-subtitle">Customer sentiment breakdown</p>
          </div>
        </div>
        <div className="chart-loading">
          <div className="loading-spinner"></div>
          <p>Loading sentiment data...</p>
        </div>
      </div>
    );
  }

  if (total === 0 || data.length === 0) {
    return (
      <div className="sentiment-pie-chart-container">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Sentiment Distribution</h3>
            <p className="chart-subtitle">Customer sentiment breakdown</p>
          </div>
        </div>
        <div className="chart-empty">
          <p>No sentiment data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sentiment-pie-chart-container">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Sentiment Distribution</h3>
          <p className="chart-subtitle">Customer sentiment breakdown</p>
        </div>
      </div>

      <div className="pie-chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={140}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={entry.color}
                  strokeWidth={2}
                  style={{
                    filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={80}
              formatter={(value, entry: any) => (
                <span style={{ 
                  color: '#1F2937', 
                  fontWeight: 700,
                  fontSize: '14px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
                }}>
                  <span style={{ color: entry.color, fontWeight: 800 }}>{value}</span>
                  {`: ${entry.payload.value} (${entry.payload.percentage}%)`}
                </span>
              )}
              iconType="circle"
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="sentiment-summary-stats">
        {data.map((item, index) => (
          <div key={index} className="sentiment-stat-item" style={{ borderLeftColor: item.color }}>
            <div className="sentiment-stat-header">
              <span className="sentiment-stat-label">{item.name}</span>
              <span className="sentiment-stat-badge" style={{ backgroundColor: item.color }}>
                {item.percentage}%
              </span>
            </div>
            <div className="sentiment-stat-value">{item.value} calls</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentimentPieChart;


    </div>
  );
};

export default SentimentPieChart;

