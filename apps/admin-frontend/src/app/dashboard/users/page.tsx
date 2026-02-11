'use client';

import { useEffect, useState } from 'react';
import { userApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface User {
  id: number;
  email: string;
  role_id: number;
  status: string;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await userApi.get('/');
      setUsers(res.data.data.users);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (id: number) => {
    if (!confirm('Are you sure you want to block this user?')) return;
    try {
      await userApi.patch(`/${id}/block`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to block user', err);
      alert('Failed to block user');
    }
  };

  const handleUnblock = async (id: number) => {
    if (!confirm('Are you sure you want to unblock this user?')) return;
    try {
      await userApi.patch(`/${id}/unblock`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to unblock user', err);
      alert('Failed to unblock user');
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h3 className="text-3xl font-medium text-gray-700 mb-6">Users</h3>

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.role_id === 1 ? 'Admin' : 'User'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                        {hasPermission('user:block') && (
                          user.status === 'active' ? (
                            <button
                              onClick={() => handleBlock(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Block
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnblock(user.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Unblock
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
