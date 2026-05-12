import { useEffect, useState } from 'react';
import { loanAPI } from '../services/api';
import { generateEMISchedulePDF, generateSanctionLetterPDF } from '../utils/pdfGenerator';
import { HiOutlineDocumentText, HiOutlineDownload, HiOutlineEye } from 'react-icons/hi';

const MyLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [loanDetail, setLoanDetail] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const { data } = await loanAPI.getMyLoans();
        setLoans(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const viewLoanDetail = async (id) => {
    try {
      const { data } = await loanAPI.getLoanById(id);
      setLoanDetail(data.data);
      setSelectedLoan(id);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">My Loans</h1>
      <p className="text-slate-400 text-sm mb-8">View and manage all your loan applications</p>

      {loans.length === 0 ? (
        <div className="glass-card-static p-12 text-center">
          <HiOutlineDocumentText className="text-5xl text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-lg">No loan applications found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <div key={loan.id} className="glass-card p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-primary-400 font-mono text-sm">#{loan.id}</span>
                    <span className={`badge badge-${loan.status}`}>{loan.status?.replace('_', ' ')}</span>
                    <span className="text-xs text-slate-500 capitalize bg-white/5 px-2 py-0.5 rounded">{loan.loan_type}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    <div>
                      <p className="text-[11px] text-slate-500">Loan Amount</p>
                      <p className="text-sm font-semibold text-white">₹{Number(loan.loan_amount).toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">Interest Rate</p>
                      <p className="text-sm font-semibold text-white">{loan.interest_rate}% p.a.</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">Monthly EMI</p>
                      <p className="text-sm font-semibold text-primary-400">₹{Number(loan.monthly_emi || 0).toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">Tenure</p>
                      <p className="text-sm font-semibold text-white">{loan.tenure_months} months</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => viewLoanDetail(loan.id)} className="btn-outline text-xs py-2 px-3 flex items-center gap-1">
                    <HiOutlineEye /> Details
                  </button>
                  {loan.status === 'approved' && (
                    <button onClick={() => generateSanctionLetterPDF(loan)} className="btn-primary text-xs py-2 px-3 flex items-center gap-1">
                      <HiOutlineDownload /> Sanction Letter
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded detail */}
              {selectedLoan === loan.id && loanDetail && (
                <div className="mt-5 pt-5 border-t border-white/5 animate-fadeInUp">
                  {loan.officer_remarks && (
                    <div className="mb-4 p-3 rounded-lg bg-primary-500/10">
                      <p className="text-xs text-slate-400">Officer Remarks:</p>
                      <p className="text-sm text-white">{loan.officer_remarks}</p>
                    </div>
                  )}
                  {loan.rejection_reason && (
                    <div className="mb-4 p-3 rounded-lg bg-danger-500/10">
                      <p className="text-xs text-slate-400">Rejection Reason:</p>
                      <p className="text-sm text-danger-400">{loan.rejection_reason}</p>
                    </div>
                  )}

                  {/* EMI Schedule */}
                  {loanDetail.emi_schedule?.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-slate-300">EMI Schedule</h4>
                        <button onClick={() => generateEMISchedulePDF(loan, loanDetail.emi_schedule)}
                          className="btn-outline text-xs py-1 px-3 flex items-center gap-1">
                          <HiOutlineDownload /> Download PDF
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="data-table text-xs">
                          <thead>
                            <tr><th>#</th><th>Due Date</th><th>EMI</th><th>Principal</th><th>Interest</th><th>Balance</th><th>Status</th></tr>
                          </thead>
                          <tbody>
                            {loanDetail.emi_schedule.slice(0, 12).map((e) => (
                              <tr key={e.id}>
                                <td>{e.emi_number}</td>
                                <td>{new Date(e.due_date).toLocaleDateString('en-IN')}</td>
                                <td>₹{Number(e.emi_amount).toLocaleString('en-IN')}</td>
                                <td>₹{Number(e.principal_component).toLocaleString('en-IN')}</td>
                                <td>₹{Number(e.interest_component).toLocaleString('en-IN')}</td>
                                <td>₹{Number(e.outstanding_balance).toLocaleString('en-IN')}</td>
                                <td><span className={`badge badge-${e.payment_status}`}>{e.payment_status}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {loanDetail.emi_schedule.length > 12 && (
                          <p className="text-xs text-slate-500 text-center mt-2">Showing 12 of {loanDetail.emi_schedule.length} EMIs. Download PDF for full schedule.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  {loanDetail.documents?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-slate-300 mb-2">Uploaded Documents</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {loanDetail.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                            <HiOutlineDocumentText className="text-primary-400" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-white truncate">{doc.file_name}</p>
                              <p className="text-[10px] text-slate-500 capitalize">{doc.document_type?.replace('_', ' ')} • {doc.is_verified ? '✅ Verified' : '⏳ Pending'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button onClick={() => { setSelectedLoan(null); setLoanDetail(null); }} className="mt-4 text-xs text-slate-400 hover:text-white">
                    ▲ Collapse
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLoans;
