import React from 'react';
import { FaBuilding, FaBullseye, FaEye, FaHeart, FaUsers, FaAward } from 'react-icons/fa';
import Footer from '../../components/Footer';

const AboutUs = () => {
  return (
    <div className="animate-fade">
      {/* Hero */}
      <section className="bg-primary py-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-blue-200 font-black text-xs uppercase tracking-widest mb-3">Who We Are</p>
          <h1 className="text-5xl lg:text-6xl font-black text-white mb-6">About RTO Portal</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            A Government of Gujarat initiative to digitize all Regional Transport Office services — making them accessible, transparent and efficient for every citizen.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <FaBullseye className="text-primary text-4xl" />,
              title: 'Our Mission',
              desc: 'To deliver seamless, transparent and digital RTO services to every citizen of Gujarat — eliminating paperwork, queues and corruption through technology.',
            },
            {
              icon: <FaEye className="text-teal text-4xl" />,
              title: 'Our Vision',
              desc: 'To be India\'s most advanced state-level digital transport authority — a model of e-governance for the entire nation.',
            },
            {
              icon: <FaHeart className="text-danger text-4xl" />,
              title: 'Our Values',
              desc: 'Transparency, Accountability, Citizen-First approach, Innovation, and Integrity guide every decision we make.',
            },
          ].map((item, i) => (
            <div key={i} className="card text-center hover:-translate-y-1 transition-all duration-300">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">{item.icon}</div>
              <h3 className="text-2xl font-black text-gray-800 mb-4">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About the System */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-primary font-black text-xs uppercase tracking-widest mb-3">The Platform</p>
              <h2 className="text-4xl font-black text-gray-800 mb-6">A Complete Digital RTO Ecosystem</h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                The RTO Management System covers the entire lifecycle of transport-related documentation — from a citizen's first
                Learning License application to vehicle registration and officer management — in one unified platform.
              </p>
              <ul className="space-y-4">
                {[
                  'Online Learning License application and MCQ test',
                  'Permanent Driving License with officer-assigned exam scheduling',
                  'Digital Vehicle Registration with Gujarat city RTO codes',
                  'Officer management, salary processing, and activity tracking',
                  'Admin-level reporting, enquiry management, and feedback review',
                ].map((point, i) => (
                  <li key={i} className="flex gap-3 items-start text-sm text-gray-700">
                    <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: '🏛️', title: 'Est. 2020', desc: 'Gujarat Government Digital Initiative' },
                { icon: '👥', title: '500k+', desc: 'Registered Citizens' },
                { icon: '📋', title: '1.2M+', desc: 'Licenses Processed' },
                { icon: '🏙️', title: '5 Cities', desc: 'Covered across Gujarat' },
              ].map((stat, i) => (
                <div key={i} className="card text-center">
                  <div className="text-3xl mb-3">{stat.icon}</div>
                  <p className="text-2xl font-black text-gray-800">{stat.title}</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black text-gray-800 mb-3">Our Team</h2>
          <p className="text-gray-500">Dedicated professionals serving Gujarat citizens every day.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'RTO Commissioner', role: 'Administrator', emoji: '👨‍💼' },
            { name: 'Senior RTO Officers', role: 'License & Vehicle Desk', emoji: '👮' },
            { name: 'IT Support Team', role: 'System & Platform', emoji: '💻' },
          ].map((member, i) => (
            <div key={i} className="card text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">{member.emoji}</div>
              <h4 className="font-black text-gray-800 text-lg">{member.name}</h4>
              <p className="text-xs text-primary font-black uppercase tracking-widest mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
