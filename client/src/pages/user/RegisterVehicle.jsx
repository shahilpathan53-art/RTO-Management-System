import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';
import { FUEL_TYPES, VEHICLE_TYPES, GUJARAT_CITIES } from '../../utils/constants';

const LETTER_SERIES = ['AA','AB','AC','AD','BA','BB','BC','CA','CB','DA','DB'];

function previewGJCode(city) {
  const c = GUJARAT_CITIES.find(g => g.name === city);
  if (!c) return '';
  const letters = LETTER_SERIES[Math.floor(Math.random() * LETTER_SERIES.length)];
  return `${c.prefix} ${letters} XXXX`;
}

const RegisterVehicle = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [gjPreview, setGjPreview] = useState('');
  const [formData, setFormData] = useState({
    ownerName: user.name,
    vehicleType: 'Two Wheeler',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    engineNumber: '',
    chassisNumber: '',
    fuelType: 'Petrol',
    insuranceCompany: '',
    insuranceExpiry: '',
    city: '',
  });

  const handleCityChange = (e) => {
    const city = e.target.value;
    setFormData({ ...formData, city });
    setGjPreview(city ? previewGJCode(city) : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/vehicle/register', formData);
      toast.success('Vehicle registered! Proceed to pay RC fee.');
      navigate('/user/payment', { state: { serviceType: 'Vehicle', applicationId: data._id } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (label, key, type = 'text', extra = {}) => (
    <div>
      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">{label}</label>
      <input type={type} required className="input-field" value={formData[key]}
        onChange={e => setFormData({ ...formData, [key]: type === 'text' ? e.target.value.toUpperCase() : e.target.value })}
        {...extra} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 animate-fade">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-800 tracking-tight">New Vehicle Registration</h1>
        <p className="text-gray-500 font-medium">Enter your vehicle details for digital RC issuance with Gujarat city code.</p>
      </div>

      <div className="card shadow-2xl p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Category */}
          <section className="grid md:grid-cols-3 gap-8 pb-8 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-black text-primary uppercase tracking-widest mb-1">Make & Category</h2>
              <p className="text-xs text-gray-400">Basic vehicle classification</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Vehicle Type</label>
                <select className="input-field" value={formData.vehicleType}
                  onChange={e => setFormData({ ...formData, vehicleType: e.target.value })}>
                  {VEHICLE_TYPES.map(vt => <option key={vt} value={vt}>{vt}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Brand / Manufacturer</label>
                <input type="text" required placeholder="e.g. Honda, Suzuki" className="input-field" value={formData.brand}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Model</label>
                <input type="text" required className="input-field" value={formData.model}
                  onChange={e => setFormData({ ...formData, model: e.target.value })} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Color</label>
                <input type="text" required className="input-field" value={formData.color}
                  onChange={e => setFormData({ ...formData, color: e.target.value })} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Manufacturing Year</label>
                <input type="number" required className="input-field" min="2000" max={new Date().getFullYear()}
                  value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
              </div>
            </div>
          </section>

          {/* Identity */}
          <section className="grid md:grid-cols-3 gap-8 pb-8 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-black text-primary uppercase tracking-widest mb-1">Identity Numbers</h2>
              <p className="text-xs text-gray-400">Unique manufacturing IDs</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Engine Number</label>
                <input type="text" required className="input-field font-mono" value={formData.engineNumber}
                  onChange={e => setFormData({ ...formData, engineNumber: e.target.value.toUpperCase() })} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Chassis Number</label>
                <input type="text" required className="input-field font-mono" value={formData.chassisNumber}
                  onChange={e => setFormData({ ...formData, chassisNumber: e.target.value.toUpperCase() })} />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Fuel Type</label>
                <select className="input-field" value={formData.fuelType}
                  onChange={e => setFormData({ ...formData, fuelType: e.target.value })}>
                  {FUEL_TYPES.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Gujarat City */}
          <section className="grid md:grid-cols-3 gap-8 pb-8 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-black text-teal uppercase tracking-widest mb-1">Gujarat City</h2>
              <p className="text-xs text-gray-400">Your vehicle registration city — determines GJ code</p>
            </div>
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Select Your City</label>
                <select required className="input-field" value={formData.city} onChange={handleCityChange}>
                  <option value="">-- Select City --</option>
                  {GUJARAT_CITIES.map(c => (
                    <option key={c.name} value={c.name}>{c.name} ({c.prefix})</option>
                  ))}
                </select>
              </div>
              {gjPreview && (
                <div className="p-5 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200">
                  <p className="text-[10px] font-black text-blue-400 uppercase mb-1">Your GJ Code Preview</p>
                  <p className="text-2xl font-black text-primary tracking-widest">{gjPreview}</p>
                  <p className="text-xs text-blue-400 mt-1">* Exact code assigned by officer on approval</p>
                </div>
              )}
            </div>
          </section>

          {/* Insurance */}
          <section className="grid md:grid-cols-3 gap-8">
            <div>
              <h2 className="text-sm font-black text-teal uppercase tracking-widest mb-1">Insurance Data</h2>
              <p className="text-xs text-gray-400">Policy and coverage details</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Insurance Provider</label>
                <input type="text" required className="input-field" value={formData.insuranceCompany}
                  onChange={e => setFormData({ ...formData, insuranceCompany: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Expiry Date</label>
                <input type="date" required className="input-field" value={formData.insuranceExpiry}
                  onChange={e => setFormData({ ...formData, insuranceExpiry: e.target.value })} />
              </div>
            </div>
          </section>

          <button type="submit" disabled={loading} className="btn-primary w-full py-5 text-xl tracking-tight">
            {loading ? <Spinner size="sm" text="" /> : 'Register & Proceed to Pay Fee'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterVehicle;
