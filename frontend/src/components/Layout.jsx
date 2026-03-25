import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import InstallPrompt from './InstallPrompt';
import { useAuth } from '../context/AuthContext';

const NO_NAV_ROUTES = ['/', '/framing', '/assessment', '/results', '/commitment', '/login', '/register'];

export default function Layout() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const showNav = isAuthenticated && !NO_NAV_ROUTES.includes(location.pathname);
  const showInstallPrompt = isAuthenticated && location.pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-[#1C1C1E]">
      <Outlet />
      {showNav && <BottomNav />}
      {showInstallPrompt && <InstallPrompt />}
    </div>
  );
}
