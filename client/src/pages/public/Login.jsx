import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';

const ROLE_META = {
  user:    { label: 'Citizen Login',  icon: '👤', color: 'bg-primary',   desc: 'Access your LL, DL and vehicle services.' },
  officer: { label: 'Officer Login',  icon: '👮', color: 'bg-teal',      desc: 'Manage citizen applications and verifications.' },
  admin:   { label: 'Admin Login',    icon: '🛡️', color: 'bg-gray-800',  desc: 'Full administrative control of the RTO system.' },
};

const DEMO = {
  admin:   { email: 'admin@rto.gov.in',   password: 'Admin@123' },
  officer: { email: 'officer@rto.gov.in', password: 'Officer@123' },
};

const Login = ({ role: propRole }) => {
  const location = useLocation();
  const routeRole = location.pathname.includes('officer-login') ? 'officer'
                  : location.pathname.includes('admin-login')   ? 'admin'
                  : propRole || 'user';

  const [role, setRole]     = useState(routeRole);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading]   = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect
  useEffect(() => {
    if (isAuthenticated && user) navigate(`/${user.role}/dashboard`, { replace: true });
  }, [isAuthenticated, user, navigate]);

  // Sync role when route changes
  useEffect(() => { setRole(routeRole); setFormData({ email: '', password: '' }); }, [routeRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { ...formData, role });
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      navigate(`/${data.role}/dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const meta = ROLE_META[role];

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-20 animate-fade bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 ${meta.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-xl`}>
            {meta.icon}
          </div>
          <h1 className="text-3xl font-black text-gray-800">{meta.label}</h1>
          <p className="text-gray-500 mt-2 text-sm">{meta.desc}</p>
        </div>

        <div className="card shadow-2xl">
          {/* Role Toggle */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
            {['user', 'officer', 'admin'].map((r) => (
              <button key={r} onClick={() => { setRole(r); setFormData({ email: '', password: '' }); }}
                className={`flex-1 py-2.5 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all ${role === r ? `${ROLE_META[r].color} text-white shadow-lg` : 'text-gray-500 hover:text-gray-800'}`}>
                {ROLE_META[r].icon} {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address</label>
              <input type="email" required className="input-field" placeholder="your@email.com"
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Password</label>
              <input type="password" required className="input-field" placeholder="Enter your password"
                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>

            <button type="submit" disabled={loading}
              className={`w-full py-4 text-white font-black rounded-2xl text-lg transition-all shadow-xl hover:opacity-90 flex items-center justify-center gap-2 ${meta.color}`}>
              {loading ? <Spinner size="sm" text="" /> : `${meta.icon} Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </button>
          </form>

          {/* Demo credentials for officer/admin */}
          {DEMO[role] && (
            <div className="mt-5 p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Demo Credentials</p>
              <button onClick={() => setFormData(DEMO[role])}
                className="w-full text-left text-xs text-primary font-bold hover:underline">
                🔑 Auto-fill {role} demo credentials
              </button>
              <p className="text-[10px] text-gray-400 mt-1">{DEMO[role].email}</p>
            </div>
          )}

          {role === 'user' && (
            <p className="text-center mt-6 text-sm text-gray-500">
              Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Register Citizen Profile</Link>
            </p>
          )}

          {/* Quick role links */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex justify-center gap-6 text-xs text-gray-400">
            <Link to="/login" className="hover:text-primary font-bold transition-colors">👤 Citizen Login</Link>
            <Link to="/officer-login" className="hover:text-teal font-bold transition-colors">👮 Officer Login</Link>
            <Link to="/admin-login" className="hover:text-gray-800 font-bold transition-colors">🛡️ Admin Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
