import { NavLink } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { useFamilyStore } from '../../store/familyStore';

const navItems = [
  { to: '', label: 'Feed', icon: '🏠' },
  { to: 'events', label: 'Events', icon: '📅' },
  { to: 'tasks', label: 'Tasks', icon: '✅' },
  { to: 'contributions', label: 'Contributions', icon: '💰' },
  { to: 'vault', label: 'Vault', icon: '🔒' },
];

export const Sidebar = () => {
  const { sidebarOpen, closeSidebar } = useUIStore();
  const activeFamily = useFamilyStore((s) => s.activeFamily);

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 lg:hidden z-40" onClick={closeSidebar} />
      )}
      <aside
        className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-surface border-r border-outline-variant/40 z-40 transition-transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <nav className="p-4 space-y-1">
          {activeFamily && (
            <div className="mb-4 p-3 rounded-xl bg-primary-container">
              <p className="text-xs text-onContainer/70">Active family</p>
              <p className="font-semibold text-onContainer">{activeFamily.name}</p>
            </div>
          )}
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={`/family/${activeFamily?._id}/${item.to}`}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition
                ${isActive ? 'bg-primary text-onPrimary' : 'text-onSurface hover:bg-surface-container'}`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};