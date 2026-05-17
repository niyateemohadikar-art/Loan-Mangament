import { Link } from 'react-router-dom';
import { HiOutlineCurrencyRupee, HiOutlineShieldCheck, HiOutlineChartBar, HiOutlineLightningBolt, HiOutlineDocumentText, HiOutlineClock, HiOutlineArrowRight } from 'react-icons/hi';

const features = [
  { icon: HiOutlineDocumentText, title: 'Digital Loan Application', desc: 'Apply for loans online with our streamlined multi-step process', color: 'from-blue-100 to-cyan-100 text-blue-600' },
  { icon: HiOutlineShieldCheck, title: 'Secure Document Upload', desc: 'Upload KYC documents securely with drag-and-drop support', color: 'from-purple-100 to-pink-100 text-purple-600' },
  { icon: HiOutlineLightningBolt, title: 'Quick Approval', desc: 'Fast loan processing with automated eligibility assessment', color: 'from-orange-100 to-amber-100 text-orange-600' },
  { icon: HiOutlineCurrencyRupee, title: 'Online EMI Payments', desc: 'Pay EMIs securely via Stripe with multiple payment options', color: 'from-green-100 to-emerald-100 text-green-600' },
  { icon: HiOutlineChartBar, title: 'Analytics Dashboard', desc: 'Powerful analytics with charts for loan and revenue tracking', color: 'from-indigo-100 to-violet-100 text-indigo-600' },
  { icon: HiOutlineClock, title: 'EMI Tracking', desc: 'Real-time EMI schedules with payment reminders and tracking', color: 'from-rose-100 to-red-100 text-rose-600' },
];

const Landing = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(15,23,42,0.05)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff7e5f] to-[#fa7054] flex items-center justify-center shadow-lg shadow-orange-500/20">
            <HiOutlineCurrencyRupee className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">SmartFinance</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loan Management</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm py-2.5 px-6 shadow-md shadow-orange-500/20">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 flex items-center justify-center min-h-screen">
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-orange-500 text-xs font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            Banking-Grade Fintech Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-tight mb-6">
            Smart Loan
            <span className="block bg-gradient-to-r from-[#fa7054] via-[#94a3b8] to-[#fa7054] bg-clip-text text-transparent py-2">
              Lifecycle Management
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Digitally manage the complete loan lifecycle — from application to 
            repayment. Built for NBFCs and banks with enterprise-grade security and 
            modern UX.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base py-3.5 px-8 shadow-lg shadow-orange-500/25">
              Start Free <HiOutlineArrowRight className="ml-1" />
            </Link>
            <Link to="/login" className="btn-outline text-base py-3.5 px-8">
              Login to Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-20 max-w-lg mx-auto">
            {[
              ['50K+', 'Loans Processed'],
              ['99.9%', 'Uptime'],
              ['₹500Cr+', 'Disbursed'],
            ].map(([value, label]) => (
              <div key={label} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-slate-900">{value}</p>
                <p className="text-xs text-slate-500 mt-2 font-medium uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 relative bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Powerful Features</h2>
            <p className="text-slate-600 max-w-xl mx-auto font-medium">Everything you need to manage loans digitally with modern tools and analytics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="glass-card p-6 animate-fadeInUp" style={{ animationDelay: `${i * 100}ms` }}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="text-xl" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Built for Every Role</h2>
            <p className="text-slate-600 font-medium">Tailored experiences for borrowers, loan officers, and administrators</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { role: 'Borrower', color: 'from-blue-500 to-cyan-500', features: ['Apply for loans online', 'Upload KYC documents', 'Track loan status', 'Pay EMIs via Stripe', 'Download PDF statements'] },
              { role: 'Loan Officer', color: 'from-purple-500 to-pink-500', features: ['Review applications', 'Verify documents', 'Assess eligibility', 'Approve or reject loans', 'Add remarks & notes'] },
              { role: 'Admin', color: 'from-[#ff7e5f] to-[#fa7054]', features: ['Analytics dashboard', 'User management', 'Revenue reports', 'Defaulter monitoring', 'Full system access'] },
            ].map((item, i) => (
              <div key={i} className="glass-card-static p-6 bg-white shadow-sm border border-slate-100">
                <div className={`w-full h-1.5 rounded-full bg-gradient-to-r ${item.color} mb-6`} />
                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.role}</h3>
                <ul className="space-y-3">
                  {item.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center p-12 relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600" aria-hidden="true" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent)] mix-blend-overlay" aria-hidden="true" />
          <div className="relative z-10 min-h-[220px] flex flex-col items-center justify-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-md">Ready to Get Started?</h2>
            <p className="text-orange-50 mb-8 max-w-lg mx-auto font-medium leading-relaxed">Join thousands of financial institutions managing loans digitally</p>
            <Link to="/register" aria-label="Create free account" className="text-lg font-semibold py-4 px-10 rounded-full bg-white text-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-600/30 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-orange-300/40 inline-flex items-center">
              Create Free Account <HiOutlineArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff7e5f] to-[#fa7054] flex items-center justify-center">
              <HiOutlineCurrencyRupee className="text-white text-sm" />
            </div>
            <span className="text-sm font-bold text-slate-900">SmartLoan Management System</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">© 2026 Smart Loan Lifecycle Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

