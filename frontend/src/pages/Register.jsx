import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/store';
import { HiOutlineCurrencyRupee, HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlinePhone } from 'react-icons/hi';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [formError, setFormError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    dispatch(clearError());

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    const result = await dispatch(registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
    }));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary-500/10 blur-3xl" />
      </div>

      <div className="glass-card-static p-8 md:p-10 w-full max-w-md relative z-10 animate-fadeInUp">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20">
            <HiOutlineCurrencyRupee className="text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 mt-1 text-sm">Start your loan journey today</p>
        </div>

        {(error || formError) && (
          <div className="mb-4 p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-400 text-sm">
            {error || formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-10 flex items-center justify-center text-slate-500 bg-transparent rounded-md">
                <HiOutlineUser className="text-slate-500" />
              </div>
              <input type="text" className="input-field flex-1" placeholder="Enter your full name"
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-10 flex items-center justify-center text-slate-500 bg-transparent rounded-md">
                <HiOutlineMail className="text-slate-500" />
              </div>
              <input type="email" className="input-field flex-1" placeholder="Enter your email"
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-10 flex items-center justify-center text-slate-500 bg-transparent rounded-md">
                <HiOutlinePhone className="text-slate-500" />
              </div>
              <input type="tel" className="input-field flex-1" placeholder="Enter your phone number"
                value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-10 flex items-center justify-center text-slate-500 bg-transparent rounded-md">
                <HiOutlineLockClosed className="text-slate-500" />
              </div>
              <input type="password" className="input-field flex-1" placeholder="Create a password (min 6 chars)"
                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-10 flex items-center justify-center text-slate-500 bg-transparent rounded-md">
                <HiOutlineLockClosed className="text-slate-500" />
              </div>
              <input type="password" className="input-field flex-1" placeholder="Confirm your password"
                value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
