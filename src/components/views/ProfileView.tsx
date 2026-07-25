import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Lock,
  Save,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  Landmark,
} from 'lucide-react';
import { Customer } from '../../types/bank';

interface ProfileViewProps {
  currentUser: Customer;
  onUpdateProfile: (updated: Customer) => void;
  onShowToast: (title: string, desc: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onUpdateProfile,
  onShowToast,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address);

  // Security password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Customer = {
      ...currentUser,
      name,
      email,
      phone,
      address,
    };
    onUpdateProfile(updated);
    onShowToast('Profile Saved', 'Your personal account details have been updated.', 'success');
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      onShowToast('Password Required', 'Please enter your current password.', 'error');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      onShowToast('Weak Password', 'New password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      onShowToast('Password Mismatch', 'New password and confirmation do not match.', 'error');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onShowToast('Password Updated', 'Your security password has been updated successfully.', 'success');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1E293B] border border-slate-700/80 shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-[#3B82F6] shadow-xl"
        />
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
            <h1 className="text-2xl font-black text-white">{currentUser.name}</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
              {currentUser.status}
            </span>
          </div>
          <p className="text-xs text-slate-300 font-mono">
            Username: @{currentUser.username} • Account: {currentUser.accountNumber}
          </p>
          <p className="text-xs text-slate-400">
            Branch: {currentUser.branch} • Member since {currentUser.joinedDate}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Personal Details Form */}
        <div className="lg:col-span-7 bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-700/60 pb-4">
            <User className="w-5 h-5 text-[#3B82F6]" />
            <h2 className="text-lg font-bold text-white">Personal Customer Details</h2>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mobile Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Residential Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Personal Info</span>
            </button>
          </form>
        </div>

        {/* Right Col: Password & Security Form */}
        <div className="lg:col-span-5 bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-700/60 pb-4">
            <Lock className="w-5 h-5 text-[#10B981]" />
            <h2 className="text-lg font-bold text-white">Security & Password Update</h2>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Current Password</label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl py-2.5 pl-10 pr-10 text-white focus:outline-none focus:border-[#3B82F6]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Update Password</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
