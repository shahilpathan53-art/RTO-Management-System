import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaStar } from 'react-icons/fa';
import Footer from '../../components/Footer';
import Spinner from '../../components/Spinner';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', rating: 5, type: 'contact' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/feedback', form);
      toast.success('Your message has been sent successfully! We will get back to you soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '', rating: 5, type: 'contact' });
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade">
      {/* Hero */}
      <section className="bg-primary py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-blue-200 font-black text-xs uppercase tracking-widest mb-3">Get In Touch</p>
          <h1 className="text-5xl font-black text-white mb-4">Contact Us</h1>
          <p className="text-blue-100 text-lg">Have a question, complaint, or feedback? We're here to help.</p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Info Cards */}
          <div className="space-y-6">
            {[
              { icon: <FaMapMarkerAlt className="text-primary text-xl" />, title: 'Office Address', lines: ['RTO Head Office', 'Gujarat State Transport Authority', 'Valsad - 396001'] },
              { icon: <FaPhone className="text-teal text-xl" />, title: 'Phone Numbers', lines: ['1800-123-4567 (Toll Free)', '+91 98247 83191', 'Mon-Sat: 9 AM – 6 PM'] },
              { icon: <FaEnvelope className="text-warning text-xl" />, title: 'Email IDs', lines: ['support@rtoportal.gov.in', 'complaints@rtoportal.gov.in'] },
              { icon: <FaClock className="text-danger text-xl" />, title: 'Working Hours', lines: ['Monday – Saturday', '09:00 AM – 06:00 PM', 'Sundays & Holidays: Closed'] },
            ].map((card, i) => (
              <div key={i} className="card p-5 flex gap-4 items-start">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">{card.icon}</div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{card.title}</p>
                  {card.lines.map((line, j) => <p key={j} className="text-sm text-gray-700 font-medium">{line}</p>)}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 card p-10">
            <h2 className="text-2xl font-black text-gray-800 mb-2">Send Us a Message</h2>
            <p className="text-gray-500 text-sm mb-8">Your feedback is stored and reviewed by our admin team.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Full Name *</label>
                  <input required type="text" className="input-field" placeholder="Your full name" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Email *</label>
                  <input required type="email" className="input-field" placeholder="your@email.com" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Phone Number</label>
                  <input type="text" maxLength={10} className="input-field" placeholder="10-digit mobile" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Type</label>
                  <select className="input-field" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="contact">Contact / Query</option>
                    <option value="feedback">Website Feedback</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Subject *</label>
                <input required type="text" className="input-field" placeholder="Brief subject" value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Message *</label>
                <textarea required rows={5} className="input-field resize-none" placeholder="Write your message here..." value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-3">Rate Our Portal</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })}
                      className={`text-2xl transition-transform hover:scale-125 ${form.rating >= star ? 'text-yellow-400' : 'text-gray-200'}`}>
                      <FaStar />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-500 self-center">{form.rating}/5</span>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2">
                {loading ? <><Spinner size="sm" /> Sending...</> : '📤 Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactUs;
