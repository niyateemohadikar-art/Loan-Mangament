import { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await adminAPI.getDashboardStats();
        setStats(data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;
  if (!stats) return <p className="text-slate-400 text-center py-20">Failed to load analytics</p>;

  const statusData = stats.loanStats?.map(s => ({
    name: s.status?.replace('_', ' ').charAt(0).toUpperCase() + s.status?.replace('_', ' ').slice(1),
    count: parseInt(s.count),
    amount: parseFloat(s.total_amount || 0),
  })) || [];

  const typeData = stats.loanTypeDistribution?.map(d => ({
    name: d.loan_type?.charAt(0).toUpperCase() + d.loan_type?.slice(1),
    value: parseInt(d.count),
    amount: parseFloat(d.total_amount || 0),
  })) || [];

  const trendData = stats.loanTrend?.reverse().map(t => ({
    month: t.month?.substring(5),
    applications: parseInt(t.applications),
    approved: parseInt(t.approved),
    rejected: parseInt(t.rejected),
  })) || [];

  const collectionData = stats.collections?.reverse().map(c => ({
    month: c.month?.substring(5),
    amount: parseFloat(c.total) / 1000,
  })) || [];

  const emiStatusData = stats.emiStats?.map(e => ({
    name: e.payment_status?.charAt(0).toUpperCase() + e.payment_status?.slice(1),
    value: parseInt(e.count),
  })) || [];

  const tooltipStyle = { background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0', fontSize: '12px' };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Analytics & Reports</h1>
      <p className="text-slate-400 text-sm mb-8">Comprehensive analytics and visual reports</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Loan Status Distribution */}
        <div className="glass-card-static p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Loan Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Loan Type Distribution */}
        <div className="glass-card-static p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Loan Type Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" innerRadius={65} outerRadius={110} paddingAngle={4} dataKey="value" label={({name, percent}) => `${name} ${(percent*100).toFixed(0)}%`}>
                {typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Application Trend */}
        <div className="glass-card-static p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Application Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="approved" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Collections */}
        <div className="glass-card-static p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Monthly Collections (₹ in K)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={collectionData}>
              <defs>
                <linearGradient id="colorCollection" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="amount" stroke="#8b5cf6" fill="url(#colorCollection)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* EMI Status */}
        <div className="glass-card-static p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">EMI Payment Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={emiStatusData} cx="50%" cy="50%" outerRadius={110} dataKey="value"
                label={({name, percent}) => `${name} ${(percent*100).toFixed(0)}%`}>
                {emiStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
