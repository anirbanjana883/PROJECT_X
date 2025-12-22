import React, { useState, useEffect } from 'react';
import { api } from '../../hooks/useGetCurrentUser';
import { FaUserShield, FaUserMd, FaUser, FaSearch, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // --- FIX: Define function INSIDE useEffect to prevent infinite loops ---
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/admin/users');
        setUsers(data.users);
      } catch (error) {
        // Only show error if it's not a "cancel" or auth error to avoid spam
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Empty array ensures this runs ONLY once

  const handleRoleUpdate = async (userId, newRole) => {
    try {
        await api.put(`/admin/users/${userId}/role`, { role: newRole });
        toast.success(`User updated to ${newRole}`);
        
        // Manually update local state to avoid re-fetching
        setUsers(prevUsers => prevUsers.map(user => 
            user._id === userId ? { ...user, role: newRole } : user
        ));
        
    } catch (error) {
        toast.error("Update failed");
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      
      {/* --- Header --- */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                System Administration
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
                Manage users, roles, and platform permissions.
            </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
            </div>
            <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all shadow-sm"
            />
        </div>
      </div>

      {/* --- Users Table --- */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-500 uppercase">User</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-500 uppercase">Current Role</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-500 uppercase text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {loading ? (
                        <tr>
                            <td colSpan="3" className="text-center py-10 text-gray-500">Loading users...</td>
                        </tr>
                    ) : filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md ${
                                        user.role === 'admin' ? 'bg-red-500' : 
                                        user.role === 'doctor' ? 'bg-purple-500' : 'bg-blue-500'
                                    }`}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900 dark:text-white">{user.name}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                                    user.role === 'admin' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 
                                    user.role === 'doctor' ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800' : 
                                    'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                                }`}>
                                    {user.role === 'admin' ? <FaUserShield /> : user.role === 'doctor' ? <FaUserMd /> : <FaUser />}
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    {user.role !== 'doctor' && (
                                        <button 
                                            onClick={() => handleRoleUpdate(user._id, 'doctor')}
                                            className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs font-bold rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors border border-purple-200 dark:border-purple-800"
                                        >
                                            Promote to Doctor
                                        </button>
                                    )}
                                    {user.role !== 'patient' && user.role !== 'admin' && (
                                        <button 
                                            onClick={() => handleRoleUpdate(user._id, 'patient')}
                                            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-200 dark:border-blue-800"
                                        >
                                            Demote to Patient
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
      
    </div>
  );
};

export default AdminDashboard;