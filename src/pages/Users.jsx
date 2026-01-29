import React, { useState, useEffect } from 'react';
import { 
  Plus, User as UserIcon, Shield, Edit2, Trash2, 
  Circle, Settings, ShieldAlert, Users as UsersIcon, CheckCircle 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  Button, Input, Select, Badge, Loader, EmptyState, Modal, Card, PageHeader
} from '../components/ui';
import { MetricTile } from '../components/ui/Card'; // MetricTile reuse kar rahe hain
import { usersAPI } from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, user: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '', username: '', password: '', role: 'user', isActive: true
  });

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  // Stats for the top bar
  const activeCount = users.filter(u => u.is_active === 1 || u.isActive === true).length;

  const openModal = (user = null) => {
    if (user) {
      setFormData({
        name: user.name,
        username: user.username,
        password: '',
        role: user.role,
        isActive: user.is_active === 1 || user.isActive === true
      });
    } else {
      setFormData({ name: '', username: '', password: '', role: 'user', isActive: true });
    }
    setModal({ open: true, user });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal.user) {
        await usersAPI.update(modal.user.id, formData);
        toast.success('Member profile updated');
      } else {
        await usersAPI.create(formData);
        toast.success('New member registered');
      }
      setModal({ open: false, user: null });
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await usersAPI.delete(deleteModal.id);
      toast.info('Access revoked successfully');
      setDeleteModal({ open: false, id: null });
      loadUsers();
    } catch (error) {
      toast.error('Failed to remove user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader size="lg" className="h-96" />;

  return (
    <div className="h-full flex flex-col gap-5">
      {/* Top Header Section */}
      <PageHeader 
        title="Team Directory" 
        subtitle="Manage access levels and system operators"
        primaryAction={{
          label: "Add New Member",
          onClick: () => openModal(),
          icon: Plus
        }}
      />
            
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-full flex flex-col gap-5 overflow-scroll"
        >
          {/* Main Content Grid */}
          <div className="relative pt-4">
            <AnimatePresence mode="popLayout">
              {users.length === 0 ? (
                <EmptyState
                  icon={UserIcon}
                  title="No Operators Found"
                  description="Deploy your first team member to manage production data."
                  action={() => openModal()}
                  actionLabel="Add Member"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      onEdit={() => openModal(user)}
                      onDelete={() => setDeleteModal({ open: true, id: user.id })}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Registration/Edit Modal */}
      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, user: null })}
        title={modal.user ? 'Update Profile' : 'Register New Member'}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5">
            <Input
              label="Full Name"
              placeholder="e.g. Hammad Shaikh"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Username"
              placeholder="hammad_99"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              disabled={!!modal.user}
            />
            <Input
              label={modal.user ? 'Update Password (Optional)' : 'Access Password'}
              type="password"
              placeholder={modal.user ? 'Leave blank to keep' : '••••••••'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!modal.user}
            />
            <Select
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { value: 'user', label: 'Standard Operator' },
                { value: 'developer', label: 'System Developer' }
              ]}
            />
            <div className="flex flex-col">
              <label className="block text-[14px] font-semibold text-slate-700 mb-1 ml-1">
                Account Status
              </label>
              <label className="relative flex items-center justify-between px-4 py-2.5 bg-slate-100 border border-slate-300 rounded-xl cursor-pointer hover:bg-slate-200/75 transition-all duration-300 group">
                <span className={`text-xs font-semibold uppercase transition-colors ${formData.isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                  {formData.isActive ? 'Access Active' : 'Access Locked'}
                </span>
                
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer" // Original checkbox hide kar di
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  {/* Ye hai aapka custom rounded checkbox/toggle */}
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 mt-4 border-t border-slate-300">
            <Button type="button" variant="outline" onClick={() => setModal({ open: false, user: null })}>
              Discard
            </Button>
            <Button type="submit" loading={saving} variant='dark' >
              {modal.user ? 'Save Changes' : 'Confirm Entry'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        title="Revoke System Access"
        size="sm"
      >
        <div className="text-center py-4">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-100">
            <ShieldAlert size={40} />
          </div>
          <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Are you sure?</h3>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed px-4">
            This operator will be instantly logged out and blocked from all system resources.
          </p>
          <div className="flex gap-3 mt-10">
            <Button className="flex-1 rounded-xl" variant="secondary" onClick={() => setDeleteModal({ open: false, id: null })}>
              Cancel
            </Button>
            <Button className="flex-1 rounded-xl" variant="danger" onClick={handleDelete} loading={saving}>
              Revoke Now
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

/**
 * INTERNAL COMPONENT: UserCard
 */
const UserCard = ({ user, onEdit, onDelete }) => {
  const isActive = user.is_active === 1 || user.isActive === true;
  const isDev = user.role === 'developer';

  return (
    <div>
      <div className="relative p-1.5 rounded-3xl overflow-hidden border border-slate-300 transition-all duration-300 group">
        <div className="flex items-start justify-between p-4 rounded-2xl">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 duration-500 ${
            isDev ? 'bg-indigo-100 text-indigo-600 border border-indigo-300' : 'bg-slate-100 text-slate-600 border border-slate-300'
          }`}>
            {isDev ? <Shield size={32} /> : <UserIcon size={32} />}
          </div>
          
          <Badge variant={isActive ? 'success' : 'danger'} size='md'>
            <span className={`w-2 h-2 rounded-full mr-2 animate-pulse ${isActive ? 'bg-emerald-600' : 'bg-red-600'}`} />
            {isActive ? 'Active' : 'Locked'}
          </Badge>
        </div>

        <div className="p-5">
          <h3 className="font-black text-slate-900 text-xl uppercase tracking-tighter truncate">
            {user.name}
          </h3>
          <div className="flex items-center gap-2">
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              @{user.username}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pr-8 p-5 bg-slate-200/85 flex items-center justify-between rounded-2xl">
          <div className="flex gap-2">
            <button 
              onClick={onEdit}
              className="p-3 text-slate-500 hover:text-slate-900 hover:bg-white rounded-xl transition-all duration-300 border border-transparent hover:border-slate-300"
            >
              <Edit2 size={18} />
            </button>
            {user.username !== 'sparkpair' && (
              <button 
                onClick={onDelete}
                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-100 border border-transparent hover:border-red-300 rounded-xl transition-all duration-300"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-widest mb-0.5">Permission</span>
            <span className={`text-sm font-semibold uppercase tracking-tight ${isDev ? 'text-indigo-600' : 'text-slate-900'}`}>
              {isDev ? 'System Admin' : 'Staff Operator'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;