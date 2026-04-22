import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl">R</div>
              <span className="font-black text-xl text-white">RTO<span className="text-primary">PORTAL</span></span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Digital platform for all RTO services — Learning License, Driving License, Vehicle Registration and more.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-xl flex items-center justify-center transition-all duration-300">
                <FaInstagram size={16} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all duration-300">
                <FaFacebook size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-sky-500 rounded-xl flex items-center justify-center transition-all duration-300">
                <FaTwitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">User Login</Link></li>
              <li><Link to="/officer-login" className="hover:text-primary transition-colors">Officer Login</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6">Our Services</h4>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-primary transition-colors cursor-default">Learning License</li>
              <li className="hover:text-primary transition-colors cursor-default">Driving License</li>
              <li className="hover:text-primary transition-colors cursor-default">Vehicle Registration</li>
              <li className="hover:text-primary transition-colors cursor-default">Online MCQ Test</li>
              <li className="hover:text-primary transition-colors cursor-default">Appointment Booking</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6">Contact Info</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3 items-start">
                <FaMapMarkerAlt className="text-primary mt-0.5 shrink-0" />
                <span>RTO Head Office, Gujarat State Transport Authority, Valsad - 396001</span>
              </li>
              <li className="flex gap-3 items-center">
                <FaPhone className="text-primary shrink-0" />
                <span>1800-123-4567 (Toll Free)</span>
              </li>
              <li className="flex gap-3 items-center">
                <FaEnvelope className="text-primary shrink-0" />
                <span>support@rtoportal.gov.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} <span className="text-primary font-bold">RTO Management System</span>. All Rights Reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-gray-300 cursor-default transition-colors">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-default transition-colors">Terms of Service</span>
            <span className="hover:text-gray-300 cursor-default transition-colors">Grievance Redressal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
