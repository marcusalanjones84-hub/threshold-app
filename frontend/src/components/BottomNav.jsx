import { useLocation, useNavigate } from 'react-router-dom';
import { Home, CheckCircle, FileText, BarChart3, BookOpen } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/checkin', label: 'Check In', icon: CheckCircle },
  { path: '/plan', label: 'Plan', icon: FileText },
  { path: '/progress', label: 'Progress', icon: BarChart3 },
  { path: '/journal', label: 'Journal', icon: BookOpen },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E] border-t border-[#3A3A3C] z-50 safe-bottom"
      data-testid="bottom-nav"
    >
      <div className="flex justify-around items-center py-2 max-w-lg mx-auto px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 py-2 px-3 bg-transparent border-0 cursor-pointer transition-colors duration-200 ${
                isActive ? 'text-white' : 'text-[#8E8E93]'
              } hover:text-white`}
              data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
            >
              <Icon size={22} strokeWidth={1.5} />
              <span className="text-2xs uppercase tracking-widest font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
