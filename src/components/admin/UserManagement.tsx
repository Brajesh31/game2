import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useGlobalState } from '../../hooks/useGlobalState';
import { useCurrentClass } from '../../hooks/useCurrentClass';
import { useToast } from '../ToastContainer';
import { Users, Search, Plus, Edit, Trash2, Ban, CheckCircle, AlertTriangle } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { state, updateUser } = useGlobalState();
  const { classInfo } = useCurrentClass();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student',
    username: ''
  });

  // Get users by role
  const getUsersByRole = (role: string) => {
    return Object.values(state.users).filter((user: any) => 
      user.role === role && 
      (searchTerm === '' || user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const students = getUsersByRole('student');
  const teachers = getUsersByRole('teacher');
  const guardians = getUsersByRole('guardian');
  const admins = getUsersByRole('admin');

  const tabs = [
    { key: 'students', label: 'Students', count: students.length, data: students },
    { key: 'teachers', label: 'Teachers', count: teachers.length, data: teachers },
    { key: 'guardians', label: 'Guardians', count: guardians.length, data: guardians },
    { key: 'admins', label: 'Admins', count: admins.length, data: admins }
  ];

  const currentTabData = tabs.find(tab => tab.key === activeTab)?.data || [];

  const handleSuspendUser = (userId: string, userName: string) => {
    // Validate user suspension
    if (!userId || !userName) {
      showToast({
        type: 'error',
        title: 'Invalid User',
        message: 'Unable to suspend user. Please try again.',
        duration: 3000
      });
      return;
    }
    
    // Log admin action for audit trail
    console.log('Admin suspending user:', userId, userName);
    
    updateUser(userId, { isSuspended: true, suspendedAt: new Date().toISOString() });
    showToast({
      type: 'warning',
      title: 'User Suspended',
      message: `${userName} has been suspended from the platform`,
      duration: 3000
    });
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    // Validate user deletion
    if (!userId || !userName) {
      showToast({
        type: 'error',
        title: 'Invalid User',
        message: 'Unable to delete user. Please try again.',
        duration: 3000
      });
      return;
    }
    
    // Log admin action for audit trail
    console.log('Admin deleting user:', userId, userName);
    
    // In a real app, this would remove from database
    showToast({
      type: 'error',
      title: 'User Deleted',
      message: `${userName} has been removed from the platform`,
      duration: 3000
    });
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.username) {
      showToast({
        type: 'error',
        title: 'Missing Information',
        message: 'Please fill in all required fields',
        duration: 3000
      });
      return;
    }

    // In a real app, this would add to database
    showToast({
      type: 'success',
      title: 'User Added',
      message: `${newUser.name} has been added to the platform`,
      duration: 3000
    });

    setNewUser({ name: '', email: '', role: 'student', username: '' });
    setShowAddUserModal(false);
  };

  const getStatusBadge = (user: any) => {
    if (user.isSuspended) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">Suspended</span>;
    }
    if (user.role === 'student' && user.status) {
      const statusColors = {
        'On Track': 'bg-green-100 text-green-800',
        'Needs Help': 'bg-yellow-100 text-yellow-800',
        'Struggling': 'bg-red-100 text-red-800'
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[user.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
          {user.status}
        </span>
      );
    }
    return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">Active</span>;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-admin-primary mb-4">User Management</h1>
          <p className="text-xl text-text-secondary">
            Manage all platform users and their permissions - Current Focus: {classInfo?.displayName || 'Class 6'}
          </p>
        </div>
        <Button 
          icon={Plus} 
          onClick={() => setShowAddUserModal(true)}
          className="btn-admin-primary"
        >
          Add New User
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="admin-card p-6 animate-admin-slide-up">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search users by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-admin w-full pl-10 pr-4 focus:ring-admin-primary focus:border-admin-primary"
            />
          </div>
          <Button variant="outline" className="border-admin-primary text-admin-primary hover:bg-admin-primary hover:text-white">
            Export Data
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-admin-background-secondary rounded-lg p-1 shadow-admin-card animate-admin-slide-up" style={{ animationDelay: '0.1s' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-admin-primary text-white shadow-admin-card'
                : 'text-text-secondary hover:text-admin-primary hover:bg-admin-background'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="admin-card animate-admin-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="overflow-x-auto">
          <table className="w-full admin-table-zebra">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-6 font-semibold text-text">User</th>
                <th className="text-left py-4 px-6 font-semibold text-text">Email</th>
                <th className="text-left py-4 px-6 font-semibold text-text">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-text">Last Active</th>
                <th className="text-left py-4 px-6 font-semibold text-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTabData.map((user: any) => (
                <tr 
                  key={user.id} 
                  className={`border-b border-border transition-colors ${
                    user.isSuspended ? 'opacity-50 bg-gray-50' : ''
                  }`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar || `https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-text">{user.name}</div>
                        <div className="text-sm text-text-secondary">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-text">{user.email}</td>
                  <td className="py-4 px-6">{getStatusBadge(user)}</td>
                  <td className="py-4 px-6 text-text-secondary">
                    {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={Edit}
                        className="text-admin-primary hover:bg-admin-primary hover:text-white"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </Button>
                      {!user.isSuspended ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={Ban}
                          onClick={() => handleSuspendUser(user.id, user.name)}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          Suspend
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={CheckCircle}
                          className="text-green-600 hover:text-green-700"
                        >
                          Restore
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={Trash2}
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal 
        isOpen={showAddUserModal} 
        onClose={() => setShowAddUserModal(false)} 
        title="Add New User"
        size="lg"
      >
        <div className="admin-modal space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Full Name *</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="input-admin w-full focus:ring-admin-primary focus:border-admin-primary"
                placeholder="Enter full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text mb-2">Username *</label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="input-admin w-full focus:ring-admin-primary focus:border-admin-primary"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Email Address *</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="input-admin w-full focus:ring-admin-primary focus:border-admin-primary"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Role</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="input-admin w-full focus:ring-admin-primary focus:border-admin-primary"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="guardian">Guardian</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowAddUserModal(false)} className="border-admin-primary text-admin-primary hover:bg-admin-primary hover:text-white">
              Cancel
            </Button>
            <Button onClick={handleAddUser} className="btn-admin-primary">
              Add User
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        title="Edit User"
        size="lg"
      >
        {selectedUser && (
          <div className="admin-modal space-y-6">
            <div className="text-center">
              <img
                src={selectedUser.avatar || `https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150`}
                alt={selectedUser.name}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-text">{selectedUser.name}</h3>
              <p className="text-text-secondary">{selectedUser.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-text mb-2">Account Details</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Role:</strong> {selectedUser.role}</p>
                  <p><strong>Username:</strong> @{selectedUser.username}</p>
                  <p><strong>Status:</strong> {selectedUser.isSuspended ? 'Suspended' : 'Active'}</p>
                  {selectedUser.role === 'student' && selectedUser.level && (
                    <p><strong>Level:</strong> {selectedUser.level}</p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-text mb-2">Activity</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Last Active:</strong> {selectedUser.lastActive ? new Date(selectedUser.lastActive).toLocaleDateString() : 'Never'}</p>
                  {selectedUser.role === 'student' && selectedUser.xp && (
                    <p><strong>XP:</strong> {selectedUser.xp}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-admin-primary/10 p-4 rounded-lg">
              <p className="text-admin-primary text-sm">
                <strong>Note:</strong> This is a demo interface. In the full version, 
                you would be able to edit user details, reset passwords, and manage permissions.
              </p>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setShowEditModal(false)} className="btn-admin-primary">
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};