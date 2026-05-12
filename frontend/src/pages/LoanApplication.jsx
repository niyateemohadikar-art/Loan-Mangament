import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loanAPI, documentAPI } from '../services/api';
import { HiOutlineUser, HiOutlineBriefcase, HiOutlineCurrencyRupee, HiOutlineDocumentAdd, HiOutlineCheckCircle, HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineCloudUpload } from 'react-icons/hi';

const steps = [
  { id: 1, title: 'Personal Details', icon: HiOutlineUser },
  { id: 2, title: 'Employment', icon: HiOutlineBriefcase },
  { id: 3, title: 'Loan Details', icon: HiOutlineCurrencyRupee },
  { id: 4, title: 'Documents', icon: HiOutlineDocumentAdd },
  { id: 5, title: 'Review & Submit', icon: HiOutlineCheckCircle },
];

const LoanApplication = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loanId, setLoanId] = useState(null);

  const [formData, setFormData] = useState({
    loan_type: 'personal', loan_amount: '', tenure_months: 12, interest_rate: 12,
    purpose: '', employment_type: 'salaried', employer_name: '', monthly_income: '',
    annual_income: '', experience_years: '',
  });

  const [documents, setDocuments] = useState([]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateEMI = () => {
    const P = parseFloat(formData.loan_amount) || 0;
    const R = (parseFloat(formData.interest_rate) || 12) / 12 / 100;
    const N = parseInt(formData.tenure_months) || 12;
    if (P === 0) return { emi: 0, total: 0, interest: 0 };
    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const total = emi * N;
    return { emi: Math.round(emi), total: Math.round(total), interest: Math.round(total - P) };
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(prev => [...prev, ...files.map(f => ({ file: f, type: 'other' }))]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await loanAPI.apply(formData);
      const createdLoanId = data.data.id;
      setLoanId(createdLoanId);

      // Upload documents
      for (const doc of documents) {
        const fd = new FormData();
        fd.append('document', doc.file);
        fd.append('loan_id', createdLoanId);
        fd.append('document_type', doc.type);
        await documentAPI.upload(fd);
      }

      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-card-static p-10 text-center max-w-md animate-fadeInUp">
          <div className="w-20 h-20 rounded-full bg-success-500/20 flex items-center justify-center mx-auto mb-6">
            <HiOutlineCheckCircle className="text-4xl text-success-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Application Submitted! 🎉</h2>
          <p className="text-slate-400 mb-2">Your loan application #{loanId} has been submitted successfully.</p>
          <p className="text-slate-500 text-sm mb-6">Our team will review your application and get back to you shortly.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/my-loans')} className="btn-primary">View My Loans</button>
            <button onClick={() => navigate('/dashboard')} className="btn-outline">Go to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  const { emi, total, interest } = calculateEMI();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Apply for Loan</h1>
      <p className="text-slate-400 text-sm mb-8">Complete the form below to submit your loan application</p>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 glass-card-static p-4 overflow-x-auto">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              currentStep === step.id ? 'bg-primary-500/20 text-primary-400' :
              currentStep > step.id ? 'text-success-400' : 'text-slate-600'
            }`}>
              <step.icon className="text-lg flex-shrink-0" />
              <span className="text-xs font-medium whitespace-nowrap hidden sm:inline">{step.title}</span>
            </div>
            {i < steps.length - 1 && <div className={`w-8 h-0.5 mx-1 ${currentStep > step.id ? 'bg-success-500' : 'bg-slate-700'}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-400 text-sm">{error}</div>
      )}

      <div className="glass-card-static p-6 md:p-8">
        {/* Step 1: Personal */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Loan Type *</label>
                <select className="input-field" value={formData.loan_type} onChange={(e) => updateField('loan_type', e.target.value)}>
                  <option value="personal">Personal Loan</option>
                  <option value="education">Education Loan</option>
                  <option value="vehicle">Vehicle Loan</option>
                  <option value="business">Business Loan</option>
                  <option value="home">Home Loan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Purpose *</label>
                <input type="text" className="input-field" placeholder="e.g. Home renovation, Higher studies"
                  value={formData.purpose} onChange={(e) => updateField('purpose', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Employment */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white mb-4">Employment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Employment Type *</label>
                <select className="input-field" value={formData.employment_type} onChange={(e) => updateField('employment_type', e.target.value)}>
                  <option value="salaried">Salaried</option>
                  <option value="self_employed">Self Employed</option>
                  <option value="business">Business Owner</option>
                  <option value="freelancer">Freelancer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Employer / Business Name</label>
                <input type="text" className="input-field" placeholder="Company or business name"
                  value={formData.employer_name} onChange={(e) => updateField('employer_name', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Monthly Income (₹) *</label>
                <input type="number" className="input-field" placeholder="e.g. 50000"
                  value={formData.monthly_income} onChange={(e) => updateField('monthly_income', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Annual Income (₹)</label>
                <input type="number" className="input-field" placeholder="e.g. 600000"
                  value={formData.annual_income} onChange={(e) => updateField('annual_income', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Work Experience (Years)</label>
                <input type="number" className="input-field" placeholder="e.g. 5"
                  value={formData.experience_years} onChange={(e) => updateField('experience_years', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Loan Details */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white mb-4">Loan Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Loan Amount (₹) *</label>
                <input type="number" className="input-field" placeholder="e.g. 500000" min="10000" max="10000000"
                  value={formData.loan_amount} onChange={(e) => updateField('loan_amount', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Interest Rate (% p.a.)</label>
                <input type="number" className="input-field" placeholder="12" step="0.5" min="5" max="30"
                  value={formData.interest_rate} onChange={(e) => updateField('interest_rate', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-300 mb-2">Tenure: {formData.tenure_months} months</label>
                <input type="range" className="w-full accent-primary-500" min="6" max="120" step="6"
                  value={formData.tenure_months} onChange={(e) => updateField('tenure_months', parseInt(e.target.value))} />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>6 mo</span><span>60 mo</span><span>120 mo</span>
                </div>
              </div>
            </div>

            {/* EMI Preview */}
            {formData.loan_amount && (
              <div className="grid grid-cols-3 gap-4 mt-6 p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
                <div className="text-center">
                  <p className="text-xs text-slate-400">Monthly EMI</p>
                  <p className="text-xl font-bold text-primary-400">₹{emi.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400">Total Interest</p>
                  <p className="text-xl font-bold text-warning-400">₹{interest.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400">Total Amount</p>
                  <p className="text-xl font-bold text-white">₹{total.toLocaleString('en-IN')}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Documents */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white mb-4">Upload Documents</h3>
            <p className="text-sm text-slate-400 mb-4">Upload Aadhaar Card, PAN Card, Salary Slips, and Bank Statements</p>

            <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-primary-500 transition-colors">
              <HiOutlineCloudUpload className="text-4xl text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400 mb-2">Drag & drop files here or click to browse</p>
              <p className="text-xs text-slate-500 mb-4">Supports PDF, JPG, PNG (Max 10MB each)</p>
              <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange}
                className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="btn-primary cursor-pointer">
                Choose Files
              </label>
            </div>

            {documents.length > 0 && (
              <div className="space-y-2 mt-4">
                <p className="text-sm text-slate-300 font-medium">Uploaded Files ({documents.length})</p>
                {documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3">
                      <HiOutlineDocumentAdd className="text-primary-400" />
                      <span className="text-sm text-slate-300">{doc.file.name}</span>
                      <span className="text-xs text-slate-500">({(doc.file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <select className="text-xs bg-transparent border border-slate-600 rounded-lg px-2 py-1 text-slate-400"
                      value={doc.type} onChange={(e) => {
                        const updated = [...documents];
                        updated[i].type = e.target.value;
                        setDocuments(updated);
                      }}>
                      <option value="aadhaar">Aadhaar Card</option>
                      <option value="pan">PAN Card</option>
                      <option value="salary_slip">Salary Slip</option>
                      <option value="bank_statement">Bank Statement</option>
                      <option value="address_proof">Address Proof</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 5 && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white mb-4">Review & Submit</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ['Loan Type', formData.loan_type],
                ['Purpose', formData.purpose || 'N/A'],
                ['Employment', formData.employment_type],
                ['Employer', formData.employer_name || 'N/A'],
                ['Monthly Income', `₹${Number(formData.monthly_income || 0).toLocaleString('en-IN')}`],
                ['Loan Amount', `₹${Number(formData.loan_amount || 0).toLocaleString('en-IN')}`],
                ['Interest Rate', `${formData.interest_rate}% p.a.`],
                ['Tenure', `${formData.tenure_months} months`],
                ['Monthly EMI', `₹${emi.toLocaleString('en-IN')}`],
                ['Total Payable', `₹${total.toLocaleString('en-IN')}`],
                ['Documents', `${documents.length} file(s)`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-sm text-slate-400">{label}</span>
                  <span className="text-sm text-white font-medium capitalize">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-white/5">
          <button onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="btn-outline disabled:opacity-30 flex items-center gap-2">
            <HiOutlineArrowLeft /> Previous
          </button>

          {currentStep < 5 ? (
            <button onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
              className="btn-primary flex items-center gap-2">
              Next <HiOutlineArrowRight />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading}
              className="btn-success flex items-center gap-2">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
              ) : (
                <><HiOutlineCheckCircle /> Submit Application</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;
