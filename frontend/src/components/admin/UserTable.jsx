import { useState } from 'react';
import { FiShield, FiTrash2, FiSlash, FiCheckCircle } from 'react-icons/fi';

const UserTable = ({ users, onToggleBan, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDeleteClick = (userId) => {
    if (confirmDelete === userId) {
      onDelete(userId);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(userId);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-borderLayer bg-bgCard">
      <table className="w-full text-left whitespace-nowrap">
        <thead>
          <tr className="bg-bgSecondary border-b border-borderLayer">
            <th className="font-heading text-sm text-textMuted tracking-wider uppercase px-4 py-3 pb-2">Avatar</th>
            <th className="font-heading text-sm text-textMuted tracking-wider uppercase px-4 py-3 pb-2">Username</th>
            <th className="font-heading text-sm text-textMuted tracking-wider uppercase px-4 py-3 pb-2">Email</th>
            <th className="font-heading text-sm text-textMuted tracking-wider uppercase px-4 py-3 pb-2">Role</th>
            <th className="font-heading text-sm text-textMuted tracking-wider uppercase px-4 py-3 pb-2">Status</th>
            <th className="font-heading text-sm text-textMuted tracking-wider uppercase px-4 py-3 pb-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className={`border-b border-borderLayer hover:bg-white/5 transition-colors ${user.isBanned ? 'opacity-60' : ''}`}>
              <td className="px-4 py-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-full overflow-hidden bg-bgSecondary">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-accentPrimary flex items-center justify-center font-bold text-white text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 font-semibold text-textPrimary">{user.username}</td>
              <td className="px-4 py-3 text-textSecondary">{user.email}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1.5 capitalize text-sm ${user.role === 'admin' ? 'text-accentSecondary font-bold' : 'text-textSecondary'}`}>
                  {user.role === 'admin' && <FiShield />}
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${user.isBanned ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                  {user.isBanned ? 'Banned' : 'Active'}
                </span>
              </td>
              <td className="px-4 py-3">
                {user.role !== 'admin' && (
                  <div className="flex gap-2">
                    <button
                      className={`btn btn-sm ${user.isBanned ? 'btn-success' : 'btn-warning'}`}
                      onClick={() => onToggleBan(user._id)}
                      title={user.isBanned ? 'Unban user' : 'Ban user'}
                    >
                      {user.isBanned ? <FiCheckCircle /> : <FiSlash />}
                    </button>
                    <button
                      className={`btn btn-sm ${confirmDelete === user._id ? 'bg-red-600 animate-pulse-fast text-white' : 'btn-danger'}`}
                      onClick={() => handleDeleteClick(user._id)}
                      title={confirmDelete === user._id ? 'Click again to confirm' : 'Delete user'}
                    >
                      <FiTrash2 />
                      {confirmDelete === user._id && <span className="ml-1 text-xs">Confirm</span>}
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="p-8 text-center text-textMuted">No users found.</div>
      )}
    </div>
  );
};

export default UserTable;
