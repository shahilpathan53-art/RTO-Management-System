import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSignOutAlt, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const NavLink = ({ to, children }) => {
    const active = isActive(to);

    return (
      <Link
        to={to}
        onClick={() => setMobileOpen(false)}
        className={`relative text-sm font-bold px-4 py-2 rounded-xl transition-all duration-300 ${
          active
            ? 'text-white bg-primary shadow-[0_0_15px_rgba(59,130,246,0.7)] scale-105'
            : 'text-gray-600 hover:text-primary hover:bg-primary/10 hover:scale-105'
        }`}
      >
        {children}

        {/* 🔥 subtle bottom glow line */}
        {active && (
          <span className="absolute left-2 right-2 -bottom-1 h-[2px] bg-primary rounded-full opacity-70 blur-[1px]" />
        )}
      </Link>
    );
  };

  const userNavLinks = [
    { to: '/user/dashboard', label: 'Dashboard' },
    { to: '/user/apply-ll', label: 'Apply LL' },
    { to: '/user/apply-dl', label: 'Apply DL' },
    { to: '/user/register-vehicle', label: 'Register Vehicle' },
    { to: '/user/appointments', label: 'Appointment' },
  ];

  const officerNavLinks = [
    { to: '/officer/dashboard', label: 'Dashboard' },
    { to: '/officer/ll-applications', label: 'Manage LL' },
    { to: '/officer/dl-applications', label: 'Manage DL' },
    { to: '/officer/vehicle-applications', label: 'Vehicles' },
    { to: '/officer/enquiry', label: 'Enquiry' },
    { to: '/officer/salarypage', label: 'Salary' },
    { to: '/officer/reports', label: 'Reports' },
  ];

  const adminNavLinks = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/users', label: 'Manage Users' },
    { to: '/admin/officers', label: 'Manage Officers' },
    { to: '/admin/salary', label: 'Officer Salary' },
    { to: '/admin/feedback', label: 'Feedback' },
    { to: '/admin/reports', label: 'Reports' },
  ];

  const publicNavLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact Us' },
  ];

  const currentLinks = !isAuthenticated
    ? publicNavLinks
    : user?.role === 'user'
    ? userNavLinks
    : user?.role === 'officer'
    ? officerNavLinks
    : adminNavLinks;

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 shadow-sm border-b border-gray-100 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center">

      <Link to="/" className="flex items-center gap-3 shrink-0 group">
        
        {/* Logo Icon */}
        <div className="relative w-11 h-11 flex items-center justify-center">
          
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-xl bg-primary blur-md opacity-40 group-hover:opacity-70 transition-all"></div>
          
          {/* Main Box */}
          <div className="relative w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-105 transition-all">
            R
          </div>
        </div>

        {/* Logo Text */}
        <div className="flex flex-col leading-tight hidden sm:block">
          <span className="font-primary font-black text-lg tracking-tight text-gray-800 group-hover:text-primary transition-all">
            RTO
            <span className="text-primary group-hover:tracking-wider transition-all">
              PORTAL
            </span>
          </span>
{/*           <span className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase">
            Govt. Services
          </span> */}
        </div>

      </Link>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex items-center gap-4 ml-auto">

          {/* Nav Links */}
          <div className="flex items-center gap-2 bg-white/40 px-3 py-2 rounded-2xl backdrop-blur-sm shadow-inner">
            {currentLinks.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200 mx-2" />

          {/* Auth */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/officer-login" className="text-sm font-bold text-gray-600 hover:text-primary transition">
                Officer
              </Link>
              <Link to="/admin-login" className="text-sm font-bold text-gray-600 hover:text-primary transition">
                Admin
              </Link>
              <Link to="/login" className="btn-primary py-2 px-6 text-sm shadow-md hover:shadow-lg transition">
                Login
              </Link>
              <Link to="/register" className="btn-secondary py-2 px-6 text-sm shadow-sm hover:shadow-md transition">
                Register
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">

              {/* Profile */}
              <Link
                to={
                  user.role === 'admin'
                    ? '/admin/profile'
                    : user.role === 'officer'
                    ? '/officer/profile'
                    : '/user/profile'
                }
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-all hover:scale-105"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <FaUserCircle className="text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-gray-800 leading-none">
                    {user.name?.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-primary uppercase font-black">
                    {user.role}
                  </p>
                </div>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all hover:scale-110"
              >
                <FaSignOutAlt />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden ml-auto p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100 py-4 px-6">
          <div className="flex flex-col gap-4">

            {currentLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-bold py-2 ${
                  isActive(link.to) ? 'text-primary' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn-primary py-3 text-center">
                  User Login
                </Link>
                <Link to="/register" className="btn-secondary py-3 text-center">
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="btn-danger py-3 flex justify-center gap-2"
              >
                <FaSignOutAlt /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;