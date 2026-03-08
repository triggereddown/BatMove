import { NavLink } from 'react-router-dom';
import { FiGrid, FiFilm, FiUsers, FiPlusCircle, FiArrowLeft } from 'react-icons/fi';

const AdminSidebar = () => {
  const links = [
    { to: '/admin', label: 'Dashboard', icon: <FiGrid />, exact: true },
    { to: '/admin/movies', label: 'Movies', icon: <FiFilm /> },
    { to: '/admin/movies/add', label: 'Add Movie', icon: <FiPlusCircle /> },
    { to: '/admin/users', label: 'Users', icon: <FiUsers /> }
  ];

  return (
    <aside className="w-full lg:w-[260px] bg-bgSecondary lg:border-r lg:border-borderLayer lg:border-b-0 border-b flex flex-row lg:flex-col shrink-0 lg:h-screen lg:sticky lg:top-0 overflow-x-auto lg:overflow-visible">
      <div className="p-4 lg:p-6 lg:border-b lg:border-borderLayer flex-shrink-0">
        <h2 className="font-heading text-xl tracking-wide flex items-center gap-2 text-accentPrimary">
          <FiGrid /> Admin Panel
        </h2>
      </div>

      <nav className="flex-1 p-2 lg:p-4 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 lg:px-4 py-2.5 lg:py-3 rounded-lg text-sm transition-all whitespace-nowrap lg:whitespace-normal shrink-0 ${isActive ? 'bg-accentPrimary/10 text-accentPrimary font-bold' : 'text-textSecondary hover:bg-white/5 hover:text-textPrimary'}`
            }
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="hidden lg:block p-4 border-t border-borderLayer">
        <NavLink to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-textSecondary hover:bg-white/5 hover:text-textPrimary transition-all">
          <FiArrowLeft />
          <span>Back to Site</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;
