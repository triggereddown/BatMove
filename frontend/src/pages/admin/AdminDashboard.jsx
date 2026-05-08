import { useEffect, useState } from 'react';
import { FiUsers, FiFilm, FiHeart, FiClock, FiTrendingUp } from 'react-icons/fi';
import { adminUsersApi } from '../../api';
import Loader from '../../components/common/Loader';

const CountUp = ({ end, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easing = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      setCount(Math.floor(easing * end));

      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <>{count.toLocaleString()}</>;
};

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
    <div className="w-full max-w-[1100px] mx-auto overflow-hidden pb-8" id="admin-dashboard">
      <div className="mb-8 pt-2">
        <h1 className="relative mb-3 font-heading text-4xl md:text-5xl tracking-[0.05em] uppercase text-textPrimary group/header flex items-center overflow-hidden">
          <span className="w-1.5 h-10 bg-accentPrimary mr-4 rounded-sm transform origin-bottom transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] scale-y-0 group-hover/header:scale-y-100 reveal-line animate-[scaleY_0.7s_forwards]" />
          <span className="inline-flex">
            {'DASHBOARD'.split('').map((char, i) => (
              <span 
                key={i} 
                className="inline-block opacity-0 animate-[charsReveal_0.6s_cubic-bezier(0.4,0,0.2,1)_forwards]"
                style={{ animationDelay: `${0.1 + (i * 0.05)}s` }}
              >
                {char}
              </span>
            ))}
          </span>
        </h1>
        <p className="text-textSecondary text-lg opacity-0 animate-[heroFadeIn_0.8s_ease_0.3s_forwards]">Platform overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-14">
        {statCards.map((card, index) => (
          <div 
            key={card.label} 
            className={`bg-bgCard border border-borderLayer rounded-xl p-6 flex items-center gap-4 transition-all duration-300 hover:shadow-[var(--shadow-card)] hover:-translate-y-1.5 border-l-[3px] ${card.color} opacity-0 animate-[adminCardSlideUp_0.6s_cubic-bezier(0.34,1.56,0.64,1)_forwards]`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`text-3xl ${card.iconColor}`}>
              {card.icon}
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-3xl font-bold leading-tight">
                <CountUp end={card.value} duration={1500} />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-textMuted mt-1">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="opacity-0 animate-[heroFadeIn_0.8s_ease_0.8s_forwards]">
        <h2 className="relative mb-6 font-heading text-2xl tracking-[0.15em] uppercase text-textPrimary group/header flex items-center overflow-hidden">
          <span className="w-1 h-8 bg-accentPrimary mr-4 rounded-sm" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <a href="/admin/movies/add" className="group flex flex-col items-center gap-3 p-8 bg-glass border border-borderLayer rounded-xl text-textSecondary transition-all duration-300 text-center hover:border-accentPrimary hover:text-textPrimary hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
            <FiFilm size={32} className="transition-transform duration-300 group-hover:scale-110 group-hover:text-accentPrimary" />
            <span className="font-semibold tracking-wide">Add New Movie</span>
          </a>
          <a href="/admin/users" className="group flex flex-col items-center gap-3 p-8 bg-glass border border-borderLayer rounded-xl text-textSecondary transition-all duration-300 text-center hover:border-accentPrimary hover:text-textPrimary hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
            <FiUsers size={32} className="transition-transform duration-300 group-hover:scale-110 group-hover:text-accentPrimary" />
            <span className="font-semibold tracking-wide">Manage Users</span>
          </a>
          <a href="/admin/movies" className="group flex flex-col items-center gap-3 p-8 bg-glass border border-borderLayer rounded-xl text-textSecondary transition-all duration-300 text-center hover:border-accentPrimary hover:text-textPrimary hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
            <FiFilm size={32} className="transition-transform duration-300 group-hover:scale-110 group-hover:text-accentPrimary" />
            <span className="font-semibold tracking-wide">View All Movies</span>
          </a>
        </div>
      </div>

      <style>{`
        @keyframes scaleY {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @keyframes charsReveal {
          from { clip-path: inset(0 100% 0 0); opacity: 0; transform: translateX(-10px); }
          to { clip-path: inset(0 0% 0 0); opacity: 1; transform: translateX(0); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes adminCardSlideUp {
          0% { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
