import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import store from './store/store';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LoanApplication from './pages/LoanApplication';
import MyLoans from './pages/MyLoans';
import EMITracker from './pages/EMITracker';
import Payments from './pages/Payments';
import LoanApplications from './pages/LoanApplications';
import UserManagement from './pages/UserManagement';
import Defaulters from './pages/Defaulters';
import Notifications from './pages/Notifications';
import Analytics from './pages/Analytics';

// Layout
import Layout from './components/Layout';

// Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useSelector((state) => state.auth);
  
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Public Route (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Protected routes with sidebar layout */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        {/* All roles */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* Borrower routes */}
        <Route path="/apply-loan" element={
          <ProtectedRoute allowedRoles={['borrower']}>
            <LoanApplication />
          </ProtectedRoute>
        } />
        <Route path="/my-loans" element={
          <ProtectedRoute allowedRoles={['borrower']}>
            <MyLoans />
          </ProtectedRoute>
        } />
        <Route path="/emi-tracker" element={
          <ProtectedRoute allowedRoles={['borrower']}>
            <EMITracker />
          </ProtectedRoute>
        } />

        {/* Borrower & Admin */}
        <Route path="/payments" element={
          <ProtectedRoute allowedRoles={['borrower', 'admin']}>
            <Payments />
          </ProtectedRoute>
        } />

        {/* Officer & Admin */}
        <Route path="/loan-applications" element={
          <ProtectedRoute allowedRoles={['loan_officer', 'admin']}>
            <LoanApplications />
          </ProtectedRoute>
        } />
        <Route path="/review-loans" element={
          <ProtectedRoute allowedRoles={['loan_officer', 'admin']}>
            <LoanApplications />
          </ProtectedRoute>
        } />
        <Route path="/defaulters" element={
          <ProtectedRoute allowedRoles={['loan_officer', 'admin']}>
            <Defaulters />
          </ProtectedRoute>
        } />

        {/* Admin only */}
        <Route path="/analytics" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="/user-management" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <div className="glass-card-static p-8 text-center">
              <h2 className="text-xl font-bold text-white mb-2">Settings</h2>
              <p className="text-slate-400">System settings and configuration</p>
            </div>
          </ProtectedRoute>
        } />
      </Route>

      {/* Payment callback routes */}
      <Route path="/payment/success" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="glass-card-static p-10 text-center max-w-md animate-fadeInUp">
            <div className="w-20 h-20 rounded-full bg-success-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful! 🎉</h2>
            <p className="text-slate-400 mb-6">Your EMI payment has been processed successfully.</p>
            <a href="/dashboard" className="btn-primary inline-flex">Go to Dashboard</a>
          </div>
        </div>
      } />
      <Route path="/payment/cancel" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="glass-card-static p-10 text-center max-w-md animate-fadeInUp">
            <div className="w-20 h-20 rounded-full bg-danger-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-danger-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Payment Cancelled</h2>
            <p className="text-slate-400 mb-6">Your payment was not completed. Please try again.</p>
            <a href="/payments" className="btn-primary inline-flex">Try Again</a>
          </div>
        </div>
      } />

      {/* 404 */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-black text-white mb-4">404</h1>
            <p className="text-slate-400 mb-6">Page not found</p>
            <a href="/" className="btn-primary">Go Home</a>
          </div>
        </div>
      } />
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
}

export default App;
