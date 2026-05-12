import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { loanAPI, adminAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { HiOutlineCurrencyRupee, HiOutlineDocumentText, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineExclamation, HiOutlineUsers, HiOutlineTrendingUp, HiOutlineClock } from 'react-icons/hi';

const StatCard = ({ icon: Icon, label, value, subValue, color, delay }) => (
  <div className="glass-card p-5 animate-fadeInUp" style={{ animationDelay: `${delay}ms` }}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-white mt-2">{value}</p>
        {subValue && <p className="text-xs text-slate-500 mt-1">{subValue}</p>}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="text-xl text-white" />
      </div>
    </div>
  </div>
);

const COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4'];

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [myLoans, setMyLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === 'admin') {
          const { data } = await adminAPI.getDashboardStats();
          setStats(data.data);
        } else if (user?.role === 'borrower') {
          const { data } = await loanAPI.getMyLoans();
          setMyLoans(data.data);
        } else {
          const { data } = await loanAPI.getAllLoans({});
          setMyLoans(data.data);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="spinner" />
      </div>
    );
  }

  // === ADMIN DASHBOARD ===
  if (user?.role === 'admin' && stats) {
    const totalUsers = stats.users?.reduce((acc, u) => acc + parseInt(u.total), 0) || 0;
    const totalLoans = stats.loanStats?.reduce((acc, s) => acc + parseInt(s.count), 0) || 0;
    const approvedLoans = stats.loanStats?.find(s => s.status === 'approved');
    const rejectedLoans = stats.loanStats?.find(s => s.status === 'rejected');

    const pieData = stats.loanTypeDistribution?.map(d => ({
      name: d.loan_type?.charAt(0).toUpperCase() + d.loan_type?.slice(1),
      value: parseInt(d.count)
    })) || [];

    const trendData = stats.loanTrend?.reverse().map(t => ({
      month: t.month,
      applications: parseInt(t.applications),
      approved: parseInt(t.approved),
      rejected: parseInt(t.rejected),
    })) || [];

    const collectionData = stats.collections?.reverse().map(c => ({
      month: c.month,
      amount: parseFloat(c.total),
    })) || [];

    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Complete system overview and analytics</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={HiOutlineUsers} label="Total Users" value={totalUsers} color="bg-gradient-to-br from-primary-500 to-primary-700" delay={0} />
          <StatCard icon={HiOutlineDocumentText} label="Total Loans" value={totalLoans} color="bg-gradient-to-br from-accent-500 to-accent-700" delay={100} />
          <StatCard icon={HiOutlineCurrencyRupee} label="Total Disbursed" value={`₹${Number(stats.totalDisbursed || 0).toLocaleString('en-IN')}`} color="bg-gradient-to-br from-success-500 to-success-600" delay={200} />
          <StatCard icon={HiOutlineExclamation} label="Active Defaulters" value={stats.defaulterCount || 0} color="bg-gradient-to-br from-danger-500 to-danger-600" delay={300} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StatCard icon={HiOutlineCheckCircle} label="Approved Loans" value={approvedLoans?.count || 0} subValue={`₹${Number(approvedLoans?.total_amount || 0).toLocaleString('en-IN')}`} color="bg-gradient-to-br from-success-500 to-success-600" delay={400} />
          <StatCard icon={HiOutlineXCircle} label="Rejected Loans" value={rejectedLoans?.count || 0} color="bg-gradient-to-br from-danger-500 to-danger-600" delay={500} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card-static p-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Loan Applications Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0' }} />
                <Bar dataKey="applications" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="approved" fill="#22c55e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="rejected" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card-static p-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Loan Type Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {pieData.map((entry, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  {entry.name} ({entry.value})
                </div>
              ))}
            </div>
          </div>
        </div>

        {collectionData.length > 0 && (
          <div className="glass-card-static p-6 mb-8">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Monthly Collections</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={collectionData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0' }} formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Collection']} />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" fill="url(#colorAmt)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent loans */}
        <div className="glass-card-static p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Recent Loan Applications</h3>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th><th>Borrower</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentLoans?.map((loan) => (
                  <tr key={loan.id}>
                    <td className="font-mono text-primary-400">#{loan.id}</td>
                    <td className="text-white">{loan.borrower_name}</td>
                    <td className="capitalize">{loan.loan_type}</td>
                    <td className="font-medium">₹{Number(loan.loan_amount).toLocaleString('en-IN')}</td>
                    <td><span className={`badge badge-${loan.status}`}>{loan.status}</span></td>
                    <td className="text-slate-500 text-xs">{new Date(loan.created_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // === BORROWER / OFFICER DASHBOARD ===
  const activeLoans = myLoans.filter(l => ['approved', 'disbursed'].includes(l.status));
  const pendingLoans = myLoans.filter(l => ['submitted', 'under_review'].includes(l.status));
  const totalAmount = activeLoans.reduce((sum, l) => sum + parseFloat(l.loan_amount || 0), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          {user?.role === 'loan_officer' ? 'Officer Dashboard' : 'Welcome back,'} {user?.role !== 'loan_officer' && <span className="text-primary-400">{user?.name?.split(' ')[0]}</span>}
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {user?.role === 'loan_officer' ? 'Review and manage loan applications' : 'Here\'s your loan overview'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={HiOutlineDocumentText} label="Total Applications" value={myLoans.length} color="bg-gradient-to-br from-primary-500 to-primary-700" delay={0} />
        <StatCard icon={HiOutlineCheckCircle} label="Active Loans" value={activeLoans.length} color="bg-gradient-to-br from-success-500 to-success-600" delay={100} />
        <StatCard icon={HiOutlineClock} label="Pending" value={pendingLoans.length} color="bg-gradient-to-br from-warning-500 to-warning-600" delay={200} />
        <StatCard icon={HiOutlineCurrencyRupee} label={user?.role === 'loan_officer' ? 'Total Value' : 'Active Amount'} value={`₹${totalAmount.toLocaleString('en-IN')}`} color="bg-gradient-to-br from-accent-500 to-accent-700" delay={300} />
      </div>

      {user?.role === 'borrower' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link to="/apply-loan" className="glass-card p-6 flex items-center gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HiOutlineDocumentText className="text-2xl text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Apply for New Loan</h3>
              <p className="text-sm text-slate-400">Get started with your loan application</p>
            </div>
          </Link>
          <Link to="/emi-tracker" className="glass-card p-6 flex items-center gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HiOutlineTrendingUp className="text-2xl text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">EMI Tracker</h3>
              <p className="text-sm text-slate-400">View your EMI schedule and payments</p>
            </div>
          </Link>
        </div>
      )}

      {/* Recent loans list */}
      <div className="glass-card-static p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">
          {user?.role === 'loan_officer' ? 'Applications to Review' : 'Your Loan Applications'}
        </h3>
        {myLoans.length === 0 ? (
          <div className="text-center py-12">
            <HiOutlineDocumentText className="text-5xl text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No loan applications yet</p>
            {user?.role === 'borrower' && (
              <Link to="/apply-loan" className="btn-primary mt-4 inline-flex">Apply Now</Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  {user?.role !== 'borrower' && <th>Borrower</th>}
                  <th>Type</th><th>Amount</th><th>Tenure</th><th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {myLoans.slice(0, 10).map((loan) => (
                  <tr key={loan.id} className="cursor-pointer">
                    <td className="font-mono text-primary-400">
                      <Link to={user?.role === 'borrower' ? `/my-loans` : `/loan-applications`}>#{loan.id}</Link>
                    </td>
                    {user?.role !== 'borrower' && <td className="text-white">{loan.borrower_name}</td>}
                    <td className="capitalize">{loan.loan_type}</td>
                    <td className="font-medium">₹{Number(loan.loan_amount).toLocaleString('en-IN')}</td>
                    <td>{loan.tenure_months} mo</td>
                    <td><span className={`badge badge-${loan.status}`}>{loan.status?.replace('_', ' ')}</span></td>
                    <td className="text-slate-500 text-xs">{new Date(loan.created_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
