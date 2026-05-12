import { Link } from 'react-router-dom';
import { HiOutlineCurrencyRupee, HiOutlineShieldCheck, HiOutlineChartBar, HiOutlineLightningBolt, HiOutlineDocumentText, HiOutlineClock, HiOutlineArrowRight } from 'react-icons/hi';

const features = [
  { icon: HiOutlineDocumentText, title: 'Digital Loan Application', desc: 'Apply for loans online with our streamlined multi-step process', color: 'from-blue-500 to-cyan-500' },
  { icon: HiOutlineShieldCheck, title: 'Secure Document Upload', desc: 'Upload KYC documents securely with drag-and-drop support', color: 'from-purple-500 to-pink-500' },
  { icon: HiOutlineLightningBolt, title: 'Quick Approval', desc: 'Fast loan processing with automated eligibility assessment', color: 'from-amber-500 to-orange-500' },
  { icon: HiOutlineCurrencyRupee, title: 'Online EMI Payments', desc: 'Pay EMIs securely via Stripe with multiple payment options', color: 'from-green-500 to-emerald-500' },
  { icon: HiOutlineChartBar, title: 'Analytics Dashboard', desc: 'Powerful analytics with charts for loan and revenue tracking', color: 'from-indigo-500 to-violet-500' },
  { icon: HiOutlineClock, title: 'EMI Tracking', desc: 'Real-time EMI schedules with payment reminders and tracking', color: 'from-rose-500 to-red-500' },
];

const Landing = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <HiOutlineCurrencyRupee className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">SmartLoan</h1>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest">Management System</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-outline text-sm py-2 px-5">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 flex items-center justify-center min-h-screen">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-primary-500/20 blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 -right-20 w-96 h-96 rounded-full bg-accent-500/15 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-success-500/10 blur-[80px] animate-pulse" style={{ animationDelay: '4s' }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            Banking-Grade Fintech Platform
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            Smart Loan
            <span className="block bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent">
              Lifecycle Management
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Digitally manage the complete loan lifecycle — from application to repayment. 
            Built for NBFCs and banks with enterprise-grade security and modern UX.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base py-3.5 px-8 shadow-lg shadow-primary-500/25">
              Start Free <HiOutlineArrowRight className="ml-1" />
            </Link>
            <Link to="/login" className="btn-outline text-base py-3.5 px-8">
              Login to Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
            {[
              ['50K+', 'Loans Processed'],
              ['99.9%', 'Uptime'],
              ['₹500Cr+', 'Disbursed'],
            ].map(([value, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Everything you need to manage loans digitally with modern tools and analytics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="glass-card p-6 animate-fadeInUp" style={{ animationDelay: `${i * 100}ms` }}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="text-xl text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Built for Every Role</h2>
            <p className="text-slate-400">Tailored experiences for borrowers, loan officers, and administrators</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { role: 'Borrower', color: 'from-blue-500 to-cyan-500', features: ['Apply for loans online', 'Upload KYC documents', 'Track loan status', 'Pay EMIs via Stripe', 'Download PDF statements'] },
              { role: 'Loan Officer', color: 'from-purple-500 to-pink-500', features: ['Review applications', 'Verify documents', 'Assess eligibility', 'Approve or reject loans', 'Add remarks & notes'] },
              { role: 'Admin', color: 'from-amber-500 to-orange-500', features: ['Analytics dashboard', 'User management', 'Revenue reports', 'Defaulter monitoring', 'Full system access'] },
            ].map((item, i) => (
              <div key={i} className="glass-card-static p-6">
                <div className={`w-full h-1.5 rounded-full bg-gradient-to-r ${item.color} mb-6`} />
                <h3 className="text-xl font-bold text-white mb-4">{item.role}</h3>
                <ul className="space-y-3">
                  {item.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
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
        <div className="max-w-3xl mx-auto text-center glass-card-static p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">Join thousands of financial institutions managing loans digitally</p>
            <Link to="/register" className="btn-primary text-lg py-4 px-10 shadow-lg shadow-primary-500/25">
              Create Free Account <HiOutlineArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <HiOutlineCurrencyRupee className="text-white text-sm" />
            </div>
            <span className="text-sm font-semibold text-white">SmartLoan Management System</span>
          </div>
          <p className="text-xs text-slate-500">© 2026 Smart Loan Lifecycle Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
