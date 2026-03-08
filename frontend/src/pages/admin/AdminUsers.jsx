import { useEffect, useState } from 'react';
import { adminUsersApi } from '../../api';
import UserTable from '../../components/admin/UserTable';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminUsersApi.getAll();
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBan = async (userId) => {
    try {
      const response = await adminUsersApi.toggleBan(userId);
      toast.success(response.data.message);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await adminUsersApi.remove(userId);
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading && users.length === 0) return <Loader />;

  return (
    <div className="w-full max-w-[1100px] mx-auto animate-fade-in" id="admin-users">
      <div className="mb-8 pt-2">
        <h1 className="font-heading text-4xl tracking-wide mb-1">Users</h1>
        <p className="text-textSecondary">Manage platform users ({users.length} total)</p>
      </div>

      <UserTable
        users={users}
        onToggleBan={handleToggleBan}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminUsers;
