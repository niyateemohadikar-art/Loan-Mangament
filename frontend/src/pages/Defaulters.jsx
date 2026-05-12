import { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import { HiOutlineExclamation, HiOutlineMail } from 'react-icons/hi';

const Defaulters = () => {
  const [defaulters, setDefaulters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDefaulters = async () => {
      try {
        const { data } = await adminAPI.getDefaulters();
        setDefaulters(data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchDefaulters();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Defaulter Management</h1>
      <p className="text-slate-400 text-sm mb-8">Monitor overdue EMIs and manage defaulters</p>

      {defaulters.length === 0 ? (
        <div className="glass-card-static p-12 text-center">
          <HiOutlineExclamation className="text-5xl text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-lg">No active defaulters 🎉</p>
          <p className="text-sm text-slate-500">All EMI payments are up to date</p>
        </div>
      ) : (
        <div className="space-y-4">
          {defaulters.map(d => (
            <div key={d.id} className="glass-card p-5 border-l-4 border-danger-500">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white font-semibold">{d.borrower_name}</span>
                    <span className="text-xs text-slate-500">{d.email}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    <div>
                      <p className="text-[11px] text-slate-500">Loan Type</p>
                      <p className="text-sm text-white capitalize">{d.loan_type}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">Overdue Amount</p>
                      <p className="text-sm font-bold text-danger-400">₹{Number(d.overdue_amount).toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">Days Overdue</p>
                      <p className={`text-sm font-bold ${d.days_overdue > 30 ? 'text-danger-400' : d.days_overdue > 15 ? 'text-warning-400' : 'text-white'}`}>
                        {d.days_overdue} days
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">Penalty</p>
                      <p className="text-sm text-warning-400">₹{Number(d.penalty_amount || 0).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="btn-outline text-xs py-2 px-3 flex items-center gap-1">
                    <HiOutlineMail /> Send Reminder
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Defaulters;
