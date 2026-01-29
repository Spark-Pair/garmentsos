import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Shield, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  Card, CardTitle, Button, Input, Select, Badge, Loader, EmptyState 
} from '../components/ui';
import { Modal } from '../components/ui';
import { usersAPI } from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, user: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'user',
    isActive: true
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setFormData({
        name: user.name,
        username: user.username,
        password: '',
        role: user.role,
        isActive: user.isActive
      });
    } else {
      setFormData({
        name: '',
        username: '',
        password: '',
        role: 'user',
        isActive: true
      });
    }
    setModal({ open: true, user });
  };

  const closeModal = () => {
    setModal({ open: false, user: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (modal.user) {
        const updateData = { name: formData.name, role: formData.role, isActive: formData.isActive };
        if (formData.password) updateData.password = formData.password;
        await usersAPI.update(modal.user._id, updateData);
        toast.success('User updated');
      } else {
        await usersAPI.create(formData);
        toast.success('User created');
      }
      closeModal();
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await usersAPI.delete(deleteModal.id);
      toast.success('User deleted');
      setDeleteModal({ open: false, id: null });
      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader size="lg" className="h-64" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Users</h2>
          <p className="text-sm text-slate-500">Manage system users and roles</p>
        </div>
        <Button icon={Plus} onClick={() => openModal()}>
          Add User
        </Button>
      </div>

      {users.length === 0 ? (
        <EmptyState
          icon={User}
          title="No users found"
          description="Add your first user to get started"
          action={() => openModal()}
          actionLabel="Add User"
          actionIcon={Plus}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onEdit={() => openModal(user)}
              onDelete={() => setDeleteModal({ open: true, id: user._id })}
            />
          ))}
        </div>
      )}

      {/* User Modal */}
      <Modal
        isOpen={modal.open}
        onClose={closeModal}
        title={modal.user ? 'Edit User' : 'Add User'}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            disabled={!!modal.user}
          />
          <Input
            label={modal.user ? 'Password (leave blank to keep)' : 'Password'}
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!modal.user}
          />
          <Select
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={[
              { value: 'user', label: 'User' },
              { value: 'developer', label: 'Developer' }
            ]}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300"
            />
            <label htmlFor="isActive" className="text-sm text-slate-700">Active</label>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {modal.user ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      {/* <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        confirmText="Delete"
        loading={saving}
      /> */}
    </div>
  );
};

const UserCard = ({ user, onEdit, onDelete }) => (
  <Card hover>
    <div className="flex items-start gap-4">
      <div className={`
        w-12 h-12 rounded-xl flex items-center justify-center
        ${user.role === 'developer' ? 'bg-purple-100' : 'bg-blue-100'}
      `}>
        {user.role === 'developer' ? (
          <Shield size={20} className="text-purple-600" />
        ) : (
          <User size={20} className="text-blue-600" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-slate-900 truncate">{user.name}</h3>
        <p className="text-sm text-slate-500">@{user.username}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={user.role === 'developer' ? 'purple' : 'primary'} size="sm">
            {user.role}
          </Badge>
          <Badge variant={user.isActive ? 'success' : 'danger'} size="sm" dot>
            {user.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>
    </div>

    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
      <Button variant="ghost" size="sm" icon={Edit2} onClick={onEdit} className="flex-1">
        Edit
      </Button>
      {user.username !== 'sparkpair' && (
        <Button variant="ghost" size="sm" icon={Trash2} onClick={onDelete} className="text-red-600 hover:bg-red-50">
          Delete
        </Button>
      )}
    </div>
  </Card>
);

export default Users;
