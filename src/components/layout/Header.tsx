import { Link, useNavigate } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { NotificationBell } from '../notifications/NotificationBell';
import { Avatar } from '../common';
import { APP_NAME } from '../../utils/constants';

export const Header = () => {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant/40">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-container"
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <Link to="/" className="font-semibold text-lg text-primary">{APP_NAME}</Link>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell />
          <div className="relative group">
            <button className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-container">
              <Avatar name={user?.name ?? 'User'} size="sm" />
            </button>
            <div className="absolute right-0 mt-2 w-40 bg-surface border border-outline-variant/40 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-surface-container rounded-xl"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};