import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaIdCard, FaCar, FaClipboardCheck, FaTasks, FaShieldAlt, FaUsers, FaClock, FaAward } from 'react-icons/fa';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';

const Home = () => {

  const { logout } = useAuth() || {};

  // 🔥 AUTO LOGOUT WHEN HOME LOADS
  useEffect(() => {
    if (logout) {
      logout(); // ✅ best (context based logout)
    } else {
      // fallback (agar logout function na ho)
      localStorage.removeItem('rtoToken');
      localStorage.removeItem('rtoUser');
      localStorage.removeItem('rtoRole');
    }

    console.log("🔥 Auto logout on Home page");
  }, []);

  return (
    <div className="animate-fade">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] bg-primary flex items-center overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white skew-x-12 transform translate-x-20 z-0 hidden lg:block" />
        <div className="max-w-7xl mx-auto px-6 w-full z-10 grid lg:grid-cols-2 gap-12 items-center py-20">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Government of Gujarat — Official RTO Portal
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
              Digital RTO <br /> <span className="text-secondary">Made Simple.</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-lg font-medium leading-relaxed">
              Apply for licenses, register vehicles, and manage appointments — all from the comfort of your home.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary bg-white text-primary hover:bg-blue-50 py-4 px-10 text-lg shadow-2xl">Get Started</Link>
              <Link to="/login" className="btn-secondary border-blue-200 text-primary hover:bg-white/10 py-4 px-10 text-lg">User Login</Link>
            </div>
            <div className="flex gap-8 mt-10 text-white">
              {[{ val: '500k+', label: 'Active Users' }, { val: '1.2M', label: 'Licenses Issued' }, { val: '99.9%', label: 'Success Rate' }].map((s, i) => (
                <div key={i}>
                  <p className="text-2xl font-black">{s.val}</p>
                  <p className="text-xs text-blue-200 font-bold uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-end">
            <div className="w-full h-[500px] border-8 border-primary/20 bg-gray-50 rounded-[4rem] flex items-center justify-center relative shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-blue-50/50" />
              <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2070" className="object-cover h-full w-full grayscale opacity-20" alt="" />
              <div className="absolute top-10 left-10 p-6 bg-white rounded-3xl shadow-xl w-64 border-l-8 border-teal">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Approved Status</p>
                <p className="text-xl font-black text-gray-800">Learning License Issued</p>
              </div>
              <div className="absolute bottom-20 right-10 p-6 bg-white rounded-3xl shadow-xl w-64 border-l-8 border-primary">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">GJ Code Assigned</p>
                <p className="text-xl font-black text-gray-800">GJ 05 BA 4321</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-primary font-black text-xs uppercase tracking-widest mb-3">What We Offer</p>
          <h2 className="text-4xl font-black text-gray-800 mb-4">Our Digital Services</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Access all RTO related operations under one unified digital window.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Learning License", desc: "Apply online for LL with MCQ test.", icon: <FaIdCard className="text-primary text-3xl" /> },
            { title: "Driving License", desc: "Convert your LL to permanent DL.", icon: <FaCar className="text-teal text-3xl" /> },
            { title: "Online Testing", desc: "Automated MCQ tests for learners.", icon: <FaClipboardCheck className="text-warning text-3xl" /> },
            { title: "Smart Scheduling", desc: "Conflict-free appointment booking.", icon: <FaTasks className="text-danger text-3xl" /> },
          ].map((s, i) => (
            <div key={i} className="card group cursor-default hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-500">
                {s.icon}
              </div>
              <h3 className="text-xl font-black text-gray-800 mb-3">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Us Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-gray-800 mb-3">Why Choose Our Portal?</h2>
            <p className="text-gray-500">Trusted by lakhs of citizens across Gujarat.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <FaShieldAlt className="text-primary text-3xl" />, title: "100% Secure", desc: "Aadhaar-linked secure authentication." },
              { icon: <FaClock className="text-teal text-3xl" />, title: "Fast Processing", desc: "Applications reviewed within 24-48 hours." },
              { icon: <FaUsers className="text-warning text-3xl" />, title: "Expert Officers", desc: "Dedicated RTO officers for verification." },
              { icon: <FaAward className="text-purple-500 text-3xl" />, title: "99.9% Uptime", desc: "Always available, 24x7 support portal." },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h4 className="font-black text-gray-800 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Active Users', val: '500k+' },
            { label: 'Licenses Issued', val: '1.2M' },
            { label: 'RTO Offices', val: '250+' },
            { label: 'Success Rate', val: '99.9%' },
          ].map((st, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl font-black text-white mb-2">{st.val}</p>
              <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">{st.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-black text-gray-800 mb-4">Ready to get started?</h2>
        <p className="text-gray-500 mb-8 text-lg">Join 500,000+ citizens already using the digital RTO portal.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/register" className="btn-primary py-4 px-12 text-lg">Create Account</Link>
          <Link to="/contact" className="btn-secondary py-4 px-12 text-lg">Contact Us</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;