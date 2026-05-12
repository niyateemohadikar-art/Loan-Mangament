import { useEffect, useState } from 'react';
import { paymentAPI, loanAPI } from '../services/api';
import { generatePaymentReceiptPDF } from '../utils/pdfGenerator';
import { useSelector } from 'react-redux';
import { HiOutlineCreditCard, HiOutlineDownload, HiOutlineCurrencyRupee } from 'react-icons/hi';

const Payments = () => {
  const { user } = useSelector(state => state.auth);
  const [payments, setPayments] = useState([]);
  const [loans, setLoans] = useState([]);
  const [emiSchedule, setEmiSchedule] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payingEmi, setPayingEmi] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: payData } = await paymentAPI.getHistory();
        setPayments(payData.data);

        if (user?.role === 'borrower') {
          const { data: loanData } = await loanAPI.getMyLoans();
          const approved = loanData.data.filter(l => ['approved', 'disbursed'].includes(l.status));
          setLoans(approved);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchEMIs = async () => {
      if (!selectedLoan) { setEmiSchedule([]); return; }
      try {
        const { data } = await loanAPI.getEMISchedule(selectedLoan);
        setEmiSchedule(data.data.filter(e => e.payment_status !== 'paid'));
      } catch (err) {
        console.error(err);
      }
    };
    fetchEMIs();
  }, [selectedLoan]);

  const handlePayEMI = async (emi) => {
    setPayingEmi(emi.id);
    try {
      const { data } = await paymentAPI.createSession({
        emi_id: emi.id,
        loan_id: selectedLoan,
        amount: parseFloat(emi.emi_amount),
      });
      if (data.data.url) {
        window.location.href = data.data.url;
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Payment initiation failed');
    } finally {
      setPayingEmi(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">
        {user?.role === 'admin' ? 'All Payments' : 'Payments'}
      </h1>
      <p className="text-slate-400 text-sm mb-8">
        {user?.role === 'borrower' ? 'Make EMI payments and view transaction history' : 'View all payment transactions'}
      </p>

      {/* Pay EMI Section (borrower only) */}
      {user?.role === 'borrower' && loans.length > 0 && (
        <div className="glass-card-static p-6 mb-8">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <HiOutlineCreditCard /> Pay EMI
          </h3>
          
          <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
            {loans.map(loan => (
              <button key={loan.id} onClick={() => setSelectedLoan(loan.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl border text-xs font-medium transition-all ${
                  selectedLoan === loan.id
                    ? 'bg-primary-500/20 border-primary-500/40 text-primary-400'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}>
                <span className="capitalize">{loan.loan_type}</span> #{loan.id}
              </button>
            ))}
          </div>

          {emiSchedule.length > 0 ? (
            <div className="space-y-2">
              {emiSchedule.slice(0, 5).map(emi => (
                <div key={emi.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-all">
                  <div>
                    <p className="text-sm text-white font-medium">EMI #{emi.emi_number}</p>
                    <p className="text-xs text-slate-400">Due: {new Date(emi.due_date).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold text-white">₹{Number(emi.emi_amount).toLocaleString('en-IN')}</p>
                    <button onClick={() => handlePayEMI(emi)} disabled={payingEmi === emi.id}
                      className="btn-primary text-xs py-2 px-4">
                      {payingEmi === emi.id ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <><HiOutlineCurrencyRupee /> Pay Now</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedLoan ? (
            <p className="text-sm text-slate-500 text-center py-4">No pending EMIs for this loan</p>
          ) : (
            <p className="text-sm text-slate-500 text-center py-4">Select a loan to view pending EMIs</p>
          )}
        </div>
      )}

      {/* Payment History */}
      <div className="glass-card-static p-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Payment History</h3>
        {payments.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No payment records found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  {user?.role !== 'borrower' && <th>Borrower</th>}
                  <th>Loan Type</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id}>
                    <td className="font-mono text-primary-400">#{payment.id}</td>
                    {user?.role !== 'borrower' && <td className="text-white">{payment.borrower_name}</td>}
                    <td className="capitalize">{payment.loan_type}</td>
                    <td className="font-medium">₹{Number(payment.amount).toLocaleString('en-IN')}</td>
                    <td className="capitalize">{payment.payment_method || 'Online'}</td>
                    <td><span className={`badge badge-${payment.payment_status}`}>{payment.payment_status}</span></td>
                    <td className="text-xs text-slate-500">{new Date(payment.payment_date).toLocaleDateString('en-IN')}</td>
                    <td>
                      {payment.payment_status === 'completed' && (
                        <button onClick={() => generatePaymentReceiptPDF(payment, {})}
                          className="text-primary-400 hover:text-primary-300" title="Download Receipt">
                          <HiOutlineDownload />
                        </button>
                      )}
                    </td>
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

export default Payments;
