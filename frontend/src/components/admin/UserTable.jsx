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
          {users.map((user, index) => (
            <tr 
              key={user._id} 
              className={`border-b border-borderLayer hover:bg-white/5 transition-colors opacity-0 animate-[adminRowSlideUp_0.5s_cubic-bezier(0.34,1.56,0.64,1)_forwards] ${user.isBanned ? 'opacity-60 grayscale-[0.5]' : ''}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
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
                  <div className="flex gap-4 items-center">
                    {/* Cubic-bezier Switch Toggle */}
                    <button
                      className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${user.isBanned ? 'bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-green-500/60 shadow-[0_0_10px_rgba(34,197,94,0.2)]'}`}
                      onClick={() => onToggleBan(user._id)}
                      title={user.isBanned ? 'Unban user' : 'Ban user'}
                    >
                      <span className="sr-only">Toggle Ban Status</span>
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${user.isBanned ? 'translate-x-[26px]' : 'translate-x-1'}`}
                      />
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

      <style>{`
        @keyframes adminRowSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default UserTable;
