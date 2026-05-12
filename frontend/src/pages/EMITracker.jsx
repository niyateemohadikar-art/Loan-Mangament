import { useEffect, useState } from 'react';
import { loanAPI } from '../services/api';
import { HiOutlineClock, HiOutlineCheckCircle, HiOutlineExclamation } from 'react-icons/hi';

const EMITracker = () => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [emiSchedule, setEmiSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const { data } = await loanAPI.getMyLoans();
        const approvedLoans = data.data.filter(l => ['approved', 'disbursed'].includes(l.status));
        setLoans(approvedLoans);
        if (approvedLoans.length > 0) {
          setSelectedLoan(approvedLoans[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  useEffect(() => {
    const fetchEMI = async () => {
      if (!selectedLoan) return;
      try {
        const { data } = await loanAPI.getEMISchedule(selectedLoan);
        setEmiSchedule(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEMI();
  }, [selectedLoan]);

  if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

  const paidCount = emiSchedule.filter(e => e.payment_status === 'paid').length;
  const pendingCount = emiSchedule.filter(e => e.payment_status === 'pending').length;
  const overdueCount = emiSchedule.filter(e => e.payment_status === 'overdue').length;
  const totalPaid = emiSchedule.filter(e => e.payment_status === 'paid').reduce((s, e) => s + parseFloat(e.emi_amount), 0);
  const totalPending = emiSchedule.filter(e => e.payment_status !== 'paid').reduce((s, e) => s + parseFloat(e.emi_amount), 0);
  const progress = emiSchedule.length > 0 ? Math.round((paidCount / emiSchedule.length) * 100) : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">EMI Tracker</h1>
      <p className="text-slate-400 text-sm mb-8">Track your EMI payments and schedules</p>

      {loans.length === 0 ? (
        <div className="glass-card-static p-12 text-center">
          <HiOutlineClock className="text-5xl text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No active loans with EMI schedules</p>
        </div>
      ) : (
        <>
          {/* Loan Selector */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {loans.map(loan => (
              <button key={loan.id} onClick={() => setSelectedLoan(loan.id)}
                className={`flex-shrink-0 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  selectedLoan === loan.id
                    ? 'bg-primary-500/20 border-primary-500/40 text-primary-400'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}>
                <span className="capitalize">{loan.loan_type}</span> - ₹{Number(loan.loan_amount).toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-4 text-center">
              <HiOutlineCheckCircle className="text-2xl text-success-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{paidCount}</p>
              <p className="text-xs text-slate-400">Paid EMIs</p>
            </div>
            <div className="glass-card p-4 text-center">
              <HiOutlineClock className="text-2xl text-warning-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{pendingCount}</p>
              <p className="text-xs text-slate-400">Pending EMIs</p>
            </div>
            <div className="glass-card p-4 text-center">
              <HiOutlineExclamation className="text-2xl text-danger-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{overdueCount}</p>
              <p className="text-xs text-slate-400">Overdue EMIs</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-xl font-bold text-primary-400">₹{totalPaid.toLocaleString('en-IN')}</p>
              <p className="text-xs text-slate-400">Total Paid</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="glass-card-static p-5 mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-300">Repayment Progress</span>
              <span className="text-sm font-bold text-primary-400">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>₹{totalPaid.toLocaleString('en-IN')} paid</span>
              <span>₹{totalPending.toLocaleString('en-IN')} remaining</span>
            </div>
          </div>

          {/* EMI Table */}
          <div className="glass-card-static p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">EMI Schedule</h3>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr><th>#</th><th>Due Date</th><th>EMI</th><th>Principal</th><th>Interest</th><th>Balance</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {emiSchedule.map((emi) => (
                    <tr key={emi.id}>
                      <td className="font-mono">{emi.emi_number}</td>
                      <td>{new Date(emi.due_date).toLocaleDateString('en-IN')}</td>
                      <td className="font-medium">₹{Number(emi.emi_amount).toLocaleString('en-IN')}</td>
                      <td>₹{Number(emi.principal_component).toLocaleString('en-IN')}</td>
                      <td>₹{Number(emi.interest_component).toLocaleString('en-IN')}</td>
                      <td>₹{Number(emi.outstanding_balance).toLocaleString('en-IN')}</td>
                      <td><span className={`badge badge-${emi.payment_status}`}>{emi.payment_status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EMITracker;
