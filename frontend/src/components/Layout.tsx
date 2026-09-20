import type { ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Heart, LayoutDashboard, LogOut, Search, Settings, ShoppingBag, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type LayoutProps = {
  children: ReactNode;
};

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/comparison', label: 'Compare', icon: ShoppingBag },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5 text-lg font-semibold tracking-tight">
            <div className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 p-1.5">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="hidden sm:inline">SmartBuy</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
                  }`
                }
              >
                <Icon size={18} />
                <span className="hidden lg:inline">{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-4 sm:gap-6">
            <button className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
              <Bell size={18} />
            </button>
            {user ? (
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : null}
          </div>
        </div>
      </header>
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-12">
        {children}
      </motion.main>
    </div>
  );
};
