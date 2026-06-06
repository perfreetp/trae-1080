import { Link, useLocation } from 'react-router-dom';
import { Plane, User } from 'lucide-react';

const navItems = [
  { path: '/', label: '首页' },
  { path: '/requirement', label: '需求发布' },
  { path: '/teams', label: '团队库' },
  { path: '/portfolio', label: '作品展示' },
  { path: '/quotes', label: '报价比选' },
  { path: '/orders', label: '合同订单' },
  { path: '/schedule', label: '拍摄日程' },
  { path: '/delivery', label: '素材交付' },
  { path: '/review', label: '评价售后' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Plane className="w-8 h-8 text-teal-400" />
            <span className="text-xl font-bold text-white tracking-tight">SkyMatch</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-teal-500/20 text-teal-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="lg:hidden overflow-x-auto border-t border-slate-700/50">
        <div className="flex items-center gap-1 px-4 py-2 min-w-max">
          {navItems.slice(1).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-teal-500/20 text-teal-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
