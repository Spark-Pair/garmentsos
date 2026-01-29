import React, { useState } from 'react';
import { User, Lock, Save, Building, MapPin, Phone, Mail, CreditCard, ShieldCheck, Globe, ExternalLink, Award, Code2, Zap } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card, Button, Input, Badge, PageHeader } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { config } = useConfig();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    password: '',
    confirmPassword: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (formData.password && formData.password.length < 6) {
      return toast.error('Min 6 characters required');
    }

    setSaving(true);
    try {
      const updateData = { name: formData.name };
      if (formData.password) updateData.password = formData.password;
      await updateProfile(updateData);
      toast.success('Security settings updated');
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 p-1">
      {/* Header Section */}
      <PageHeader 
        title="System Settings"
        subtitle="Manage entity configuration and personal security preferences"
        icon={Zap}
        rightElement={
          <Badge variant="success" size="md">
            System Online
          </Badge>
        }
      />

      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-full overflow-scroll grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* LEFT COLUMN: Entity & Owner Identity */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* 1. Client Entity Details */}
            <div className="border border-slate-300 rounded-3xl overflow-hidden p-1.5 bg-white">
              <div className="ps-6 p-4 bg-slate-200/85 relative overflow-hidden rounded-2xl flex items-center justify-between">
                <div>
                  <h1 className="font-semibold text-slate-900 text-lg leading-tight">Entity Details</h1>
                  <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">Organization Profile</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-300">
                  <Building className="text-slate-500" size={20} />
                </div>
              </div>
              
              <div className="p-3">
                <InfoRow icon={MapPin} label="Physical Address" value={config?.companyAddress} color="red" />
                <InfoRow icon={Phone} label="Primary Line" value={config?.companyPhone} color="emerald" />
                <InfoRow icon={Mail} label="Billing Inquiries" value={config?.companyEmail} color="blue" />
                <InfoRow icon={CreditCard} label="License Expiry" value={config?.subscriptionExpiry} color="purple" />
              </div>
            </div>

            {/* 2. Platform Owner Details (SparkPair) */}
            <div className="border border-slate-300 rounded-3xl overflow-hidden p-1.5 bg-white">
              <div className="ps-6 p-4 bg-slate-900 text-white relative overflow-hidden rounded-2xl">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h1 className="font-semibold text-white text-lg leading-tight">Platform Owner</h1>
                    <p className="text-[11px] font-medium uppercase tracking-widest text-slate-400">Service Provider</p>
                  </div>
                  <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    <Code2 className="text-amber-400" size={22} />
                  </div>
                </div>
                {/* Decorative Glow */}
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-4 p-4 bg-slate-100 rounded-2xl border border-slate-200">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200">
                      <span className="text-xl font-black text-slate-900 leading-none">S<span className="text-amber-500">P</span></span>
                  </div>
                  <div>
                      <p className="text-sm font-semibold leading-tight">SparkPair Technologies</p>
                      <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">Industrial Software Core</p>
                  </div>
                </div>

                <div>
                  <InfoRow icon={Globe} label="Digital Presence" value="www.sparkpair.dev" color="blue" />
                  <InfoRow icon={Award} label="Core Version" value="v2.4.0 • Enterprise" color="emerald" />
                </div>

                <a 
                  href="https://www.sparkpair.dev" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-700 text-slate-100 relative font-medium hover:scale-[1.028] transition-all duration-300 px-5 py-2.5 text-base rounded-xl"
                >
                  Access Technical Support <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Profile & Security Controls */}
          <div className="lg:col-span-7">
            <div className="border border-slate-300 rounded-3xl overflow-hidden p-7 bg-white">
              {/* User Profile Header */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b border-slate-300">
                <div className="relative">
                  <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-black text-2xl">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2">
                    <div className="bg-emerald-500 w-6 h-6 rounded-full border-4 border-white" />
                  </div>
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h3 className="text-2xl font-bold text-slate-900 leading-none">{user?.name}</h3>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <Badge variant="info">@{user?.username}</Badge>
                    <Badge variant="dark" className="font-medium tracking-wider capitalize">{user?.role}</Badge>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Display Name"
                  icon={User}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="New Password"
                    icon={Lock}
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                  />
                  <Input
                    label="Confirm Password"
                    icon={Lock}
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>

                <div className="pt-4 border-t border-slate-50">
                  <Button 
                    type="submit" 
                    loading={saving}
                    variant='dark'
                    size='lg'
                    className="w-full"
                  >
                    Update Profile Settings
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value, color }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600 border-blue-200',
    red: 'bg-red-100 text-red-600 border-red-200',
    emerald: 'bg-emerald-100 text-emerald-600 border-emerald-200',
    purple: 'bg-purple-100 text-purple-600 border-purple-200',
  };

  return (
    <div className="flex items-center gap-4 p-3.5 hover:bg-slate-100 rounded-2xl transition-all duration-300 group/row border border-transparent hover:border-slate-200">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover/row:scale-105 ${colors[color]}`}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 leading-none mb-0.5">{label}</p>
        <p className="text-sm font-medium text-slate-700 tracking-tight">{value || 'Not Configured'}</p>
      </div>
    </div>
  );
};

export default Settings;