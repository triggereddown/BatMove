import { useEffect, useState } from 'react';
import { FiUsers, FiFilm, FiHeart, FiClock, FiTrendingUp } from 'react-icons/fi';
import { adminUsersApi } from '../../api';
import Loader from '../../components/common/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminUsersApi.getStats();
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: <FiUsers />, color: 'border-l-indigo-500', iconColor: 'text-indigo-500' },
    { label: 'Total Movies', value: stats?.totalMovies || 0, icon: <FiFilm />, color: 'border-l-red-600', iconColor: 'text-red-600' },
    { label: 'Total Favorites', value: stats?.totalFavorites || 0, icon: <FiHeart />, color: 'border-l-amber-500', iconColor: 'text-amber-500' },
    { label: 'Watch History', value: stats?.totalHistory || 0, icon: <FiClock />, color: 'border-l-emerald-500', iconColor: 'text-emerald-500' },
    { label: 'New Users (7d)', value: stats?.recentUsers || 0, icon: <FiTrendingUp />, color: 'border-l-violet-500', iconColor: 'text-violet-500' }
  ];

  return (
    <div className="w-full max-w-[1100px] mx-auto animate-fade-in" id="admin-dashboard">
      <div className="mb-8 pt-2">
        <h1 className="font-heading text-4xl tracking-wide mb-1">Dashboard</h1>
        <p className="text-textSecondary">Platform overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-12">
        {statCards.map((card) => (
          <div key={card.label} className={`bg-bgCard border border-borderLayer rounded-xl p-6 flex items-center gap-4 transition-all duration-300 hover:border-white/10 hover:-translate-y-1 border-l-4 ${card.color}`}>
            <div className={`text-3xl ${card.iconColor}`}>
              {card.icon}
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-3xl font-bold leading-tight">{card.value.toLocaleString()}</span>
              <span className="text-sm text-textSecondary">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="section-title">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <a href="/admin/movies/add" className="flex flex-col items-center gap-3 p-8 bg-bgCard border border-borderLayer rounded-xl text-textSecondary transition-all duration-300 text-center hover:border-accentPrimary hover:text-textPrimary hover:-translate-y-1">
            <FiFilm size={32} />
            <span className="font-semibold tracking-wide">Add New Movie</span>
          </a>
          <a href="/admin/users" className="flex flex-col items-center gap-3 p-8 bg-bgCard border border-borderLayer rounded-xl text-textSecondary transition-all duration-300 text-center hover:border-accentPrimary hover:text-textPrimary hover:-translate-y-1">
            <FiUsers size={32} />
            <span className="font-semibold tracking-wide">Manage Users</span>
          </a>
          <a href="/admin/movies" className="flex flex-col items-center gap-3 p-8 bg-bgCard border border-borderLayer rounded-xl text-textSecondary transition-all duration-300 text-center hover:border-accentPrimary hover:text-textPrimary hover:-translate-y-1">
            <FiFilm size={32} />
            <span className="font-semibold tracking-wide">View All Movies</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
