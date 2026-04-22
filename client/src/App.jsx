import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import AboutUs from './pages/public/AboutUs';
import ContactUs from './pages/public/ContactUs';

// User pages
import UserDashboard from './pages/user/Dashboard';
import ApplyLL from './pages/user/ApplyLL';
import LLTest from './pages/user/LLTest';
import LLStatus from './pages/user/LLStatus';
import ApplyDL from './pages/user/ApplyDL';
import DLStatus from './pages/user/DLStatus';
import RegisterVehicle from './pages/user/RegisterVehicle';
import VehicleStatus from './pages/user/VehicleStatus';
import Appointments from './pages/user/Appointments';
import Payment from './pages/user/Payment';
import UserProfile from './pages/user/UserProfile';

// Officer pages
import OfficerDashboard from './pages/officer/Dashboard';
import LLApplications from './pages/officer/LLApplications';
import LLVerify from './pages/officer/LLVerify';
import UpdateDelivery from './pages/officer/UpdateDelivery';
import DLApplications from './pages/officer/DLApplications';
import DLResult from './pages/officer/DLResult';
import VehicleApplications from './pages/officer/VehicleApplications';
import OfficerEnquiry from './pages/officer/OfficerEnquiry';
import OfficerSalaryPage from './pages/officer/OfficerSalaryPage';
import OfficerReports from './pages/officer/OfficerReports';
import OfficerProfile from './pages/officer/OfficerProfile';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminOfficers from './pages/admin/Officers';
import AdminReports from './pages/admin/Reports';
import OfficerSalary from './pages/admin/OfficerSalary';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminProfile from './pages/admin/AdminProfile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/officer-login" element={<Login role="officer" />} />
            <Route path="/admin-login" element={<Login role="admin" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />

            {/* User */}
            <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>} />
            <Route path="/user/apply-ll" element={<ProtectedRoute allowedRoles={['user']}><ApplyLL /></ProtectedRoute>} />
            <Route path="/user/ll-test" element={<ProtectedRoute allowedRoles={['user']}><LLTest /></ProtectedRoute>} />
            <Route path="/user/ll-status" element={<ProtectedRoute allowedRoles={['user']}><LLStatus /></ProtectedRoute>} />
            <Route path="/user/apply-dl" element={<ProtectedRoute allowedRoles={['user']}><ApplyDL /></ProtectedRoute>} />
            <Route path="/user/dl-status" element={<ProtectedRoute allowedRoles={['user']}><DLStatus /></ProtectedRoute>} />
            <Route path="/user/register-vehicle" element={<ProtectedRoute allowedRoles={['user']}><RegisterVehicle /></ProtectedRoute>} />
            <Route path="/user/vehicle-status" element={<ProtectedRoute allowedRoles={['user']}><VehicleStatus /></ProtectedRoute>} />
            <Route path="/user/appointments" element={<ProtectedRoute allowedRoles={['user']}><Appointments /></ProtectedRoute>} />
            <Route path="/user/payment" element={<ProtectedRoute allowedRoles={['user']}><Payment /></ProtectedRoute>} />
            <Route path="/user/profile" element={<ProtectedRoute allowedRoles={['user']}><UserProfile /></ProtectedRoute>} />

            {/* Officer */}
            <Route path="/officer/dashboard" element={<ProtectedRoute allowedRoles={['officer']}><OfficerDashboard /></ProtectedRoute>} />
            <Route path="/officer/ll-applications" element={<ProtectedRoute allowedRoles={['officer']}><LLApplications /></ProtectedRoute>} />
            <Route path="/officer/ll-verify/:id" element={<ProtectedRoute allowedRoles={['officer']}><LLVerify /></ProtectedRoute>} />
            <Route path="/officer/update-delivery/:id" element={<ProtectedRoute allowedRoles={['officer']}><UpdateDelivery /></ProtectedRoute>} />
            <Route path="/officer/dl-applications" element={<ProtectedRoute allowedRoles={['officer']}><DLApplications /></ProtectedRoute>} />
            <Route path="/officer/dl-result/:id" element={<ProtectedRoute allowedRoles={['officer']}><DLResult /></ProtectedRoute>} />
            <Route path="/officer/vehicle-applications" element={<ProtectedRoute allowedRoles={['officer']}><VehicleApplications /></ProtectedRoute>} />
            <Route path="/officer/enquiry" element={<ProtectedRoute allowedRoles={['officer']}><OfficerEnquiry /></ProtectedRoute>} />
            <Route path="/officer/salarypage" element={<ProtectedRoute allowedRoles={['officer']}><OfficerSalaryPage /></ProtectedRoute>} />
            <Route path="/officer/reports" element={<ProtectedRoute allowedRoles={['officer']}><OfficerReports /></ProtectedRoute>} />
            <Route path="/officer/profile" element={<ProtectedRoute allowedRoles={['officer']}><OfficerProfile /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/officers" element={<ProtectedRoute allowedRoles={['admin']}><AdminOfficers /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />
            <Route path="/admin/salary" element={<ProtectedRoute allowedRoles={['admin']}><OfficerSalary /></ProtectedRoute>} />
            <Route path="/admin/feedback" element={<ProtectedRoute allowedRoles={['admin']}><AdminFeedback /></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={['admin']}><AdminProfile /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Toaster position="top-right" toastOptions={{ duration: 4000, style: { fontFamily: 'Inter, sans-serif' } }} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
