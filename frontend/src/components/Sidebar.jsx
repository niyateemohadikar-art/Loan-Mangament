import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/store';
import { 
  HiOutlineHome, HiOutlineDocumentText, HiOutlineCurrencyRupee, 
  HiOutlineClipboardList, HiOutlineChartBar, HiOutlineUsers, 
  HiOutlineBell, HiOutlineLogout, HiOutlineMenu, HiOutlineX,
  HiOutlineCog, HiOutlineShieldCheck, HiOutlineExclamation,
  HiOutlineCreditCard, HiOutlineDocumentAdd
} from 'react-icons/hi';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const borrowerLinks = [
    { to: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { to: '/apply-loan', icon: HiOutlineDocumentAdd, label: 'Apply for Loan' },
    { to: '/my-loans', icon: HiOutlineDocumentText, label: 'My Loans' },
    { to: '/emi-tracker', icon: HiOutlineClipboardList, label: 'EMI Tracker' },
    { to: '/payments', icon: HiOutlineCreditCard, label: 'Payments' },
    { to: '/notifications', icon: HiOutlineBell, label: 'Notifications' },
  ];

  const officerLinks = [
    { to: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { to: '/loan-applications', icon: HiOutlineDocumentText, label: 'Applications' },
    { to: '/review-loans', icon: HiOutlineShieldCheck, label: 'Review Loans' },
    { to: '/defaulters', icon: HiOutlineExclamation, label: 'Defaulters' },
    { to: '/notifications', icon: HiOutlineBell, label: 'Notifications' },
  ];

  const adminLinks = [
    { to: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { to: '/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
    { to: '/loan-applications', icon: HiOutlineDocumentText, label: 'All Loans' },
    { to: '/user-management', icon: HiOutlineUsers, label: 'Users' },
    { to: '/payments', icon: HiOutlineCurrencyRupee, label: 'Payments' },
    { to: '/defaulters', icon: HiOutlineExclamation, label: 'Defaulters' },
    { to: '/notifications', icon: HiOutlineBell, label: 'Notifications' },
    { to: '/settings', icon: HiOutlineCog, label: 'Settings' },
  ];

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'loan_officer' ? officerLinks : borrowerLinks;

  return (
    <>
      {/* Mobile toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary-600 text-white md:hidden"
      >
        {isOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar fixed top-0 left-0 h-screen w-64 flex flex-col z-40 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <HiOutlineCurrencyRupee className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">SmartLoan</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-3 px-3">
            {user?.role === 'admin' ? 'Administration' : user?.role === 'loan_officer' ? 'Officer Panel' : 'Navigation'}
          </p>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={`sidebar-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              <link.icon size={20} />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* User info & logout */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3 px-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <HiOutlineLogout size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
