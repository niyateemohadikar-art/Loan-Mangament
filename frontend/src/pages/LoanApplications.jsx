import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllLoans } from '../store/store';
import { loanAPI } from '../services/api';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineEye, HiOutlineSearch } from 'react-icons/hi';

const LoanApplications = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { allLoans, loading, pagination } = useSelector(state => state.loans);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [loanDetail, setLoanDetail] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    dispatch(fetchAllLoans({ status: statusFilter || undefined }));
  }, [dispatch, statusFilter]);

  const viewDetail = async (id) => {
    try {
      const { data } = await loanAPI.getLoanById(id);
      setLoanDetail(data.data);
      setSelectedLoan(id);
    } catch (err) { console.error(err); }
  };

  const handleReview = async (id) => {
    setActionLoading(true);
    try {
      await loanAPI.reviewLoan(id);
      dispatch(fetchAllLoans({ status: statusFilter || undefined }));
      setSelectedLoan(null);
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    finally { setActionLoading(false); }
  };

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      await loanAPI.approveLoan(id, { officer_remarks: remarks });
      dispatch(fetchAllLoans({ status: statusFilter || undefined }));
      setSelectedLoan(null);
      setRemarks('');
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    finally { setActionLoading(false); }
  };

  const handleReject = async (id) => {
    if (!rejectionReason) { alert('Please provide a rejection reason'); return; }
    setActionLoading(true);
    try {
      await loanAPI.rejectLoan(id, { rejection_reason: rejectionReason, officer_remarks: remarks });
      dispatch(fetchAllLoans({ status: statusFilter || undefined }));
      setSelectedLoan(null);
      setRemarks('');
      setRejectionReason('');
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    finally { setActionLoading(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Loan Applications</h1>
      <p className="text-slate-400 text-sm mb-6">Review, approve or reject loan applications</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['', 'submitted', 'under_review', 'verified', 'approved', 'rejected'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
              statusFilter === s
                ? 'bg-primary-500/20 border-primary-500/40 text-primary-400'
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
            }`}>
            {s ? s.replace('_', ' ').charAt(0).toUpperCase() + s.replace('_', ' ').slice(1) : 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="spinner" /></div>
      ) : (
        <div className="space-y-3">
          {allLoans.length === 0 ? (
            <div className="glass-card-static p-12 text-center">
              <HiOutlineSearch className="text-5xl text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No loan applications found</p>
            </div>
          ) : allLoans.map(loan => (
            <div key={loan.id} className="glass-card p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-primary-400 text-sm">#{loan.id}</span>
                    <span className={`badge badge-${loan.status}`}>{loan.status?.replace('_', ' ')}</span>
                  </div>
                  <p className="text-white font-medium">{loan.borrower_name} <span className="text-xs text-slate-500">{loan.borrower_email}</span></p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-400">
                    <span className="capitalize">{loan.loan_type}</span>
                    <span>₹{Number(loan.loan_amount).toLocaleString('en-IN')}</span>
                    <span>{loan.tenure_months} months</span>
                    <span>{loan.interest_rate}% p.a.</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => viewDetail(loan.id)} className="btn-outline text-xs py-2 px-3">
                    <HiOutlineEye className="inline mr-1" /> View
                  </button>
                  {loan.status === 'submitted' && (
                    <button onClick={() => handleReview(loan.id)} disabled={actionLoading} className="btn-primary text-xs py-2 px-3">
                      Start Review
                    </button>
                  )}
                </div>
              </div>

              {/* Detail Panel */}
              {selectedLoan === loan.id && loanDetail && (
                <div className="mt-5 pt-5 border-t border-white/5 animate-fadeInUp">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {[
                      ['Employment', loanDetail.employment_type],
                      ['Employer', loanDetail.employer_name || 'N/A'],
                      ['Monthly Income', `₹${Number(loanDetail.monthly_income || 0).toLocaleString('en-IN')}`],
                      ['Annual Income', `₹${Number(loanDetail.annual_income || 0).toLocaleString('en-IN')}`],
                      ['Experience', `${loanDetail.experience_years || 0} years`],
                      ['Purpose', loanDetail.purpose || 'N/A'],
                    ].map(([label, value]) => (
                      <div key={label} className="p-3 rounded-lg bg-white/5">
                        <p className="text-[11px] text-slate-500">{label}</p>
                        <p className="text-sm text-white capitalize">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Documents */}
                  {loanDetail.documents?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-slate-300 font-medium mb-2">Documents ({loanDetail.documents.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {loanDetail.documents.map(doc => (
                          <span key={doc.id} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 capitalize">
                            {doc.document_type?.replace('_', ' ')} {doc.is_verified ? '✅' : '⏳'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {['submitted', 'under_review', 'verified'].includes(loan.status) && (
                    <div className="space-y-3 mt-4 p-4 rounded-xl bg-white/5">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Remarks</label>
                        <textarea className="input-field text-sm" rows="2" placeholder="Add your remarks..."
                          value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Rejection Reason (if rejecting)</label>
                        <input type="text" className="input-field text-sm" placeholder="Reason for rejection..."
                          value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => handleApprove(loan.id)} disabled={actionLoading}
                          className="btn-success text-sm flex items-center gap-1">
                          <HiOutlineCheckCircle /> Approve
                        </button>
                        <button onClick={() => handleReject(loan.id)} disabled={actionLoading}
                          className="btn-danger text-sm flex items-center gap-1">
                          <HiOutlineXCircle /> Reject
                        </button>
                      </div>
                    </div>
                  )}

                  <button onClick={() => { setSelectedLoan(null); setLoanDetail(null); }}
                    className="mt-3 text-xs text-slate-400 hover:text-white">▲ Collapse</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {pagination && (
        <p className="text-xs text-slate-500 text-center mt-6">
          Showing {allLoans.length} of {pagination.total} applications
        </p>
      )}
    </div>
  );
};

export default LoanApplications;
