import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';

// Pages
import Welcome from './pages/Welcome';
import Framing from './pages/Framing';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import Commitment from './pages/Commitment';
import Dashboard from './pages/Dashboard';
import Checkin from './pages/Checkin';
import Plan from './pages/Plan';
import Week from './pages/Week';
import Progress from './pages/Progress';
import Journal from './pages/Journal';
import Upgrade from './pages/Upgrade';
import Coaching from './pages/Coaching';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, profile } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Redirect to commitment if not completed onboarding
  if (profile && !profile.onboarding_complete) {
    return <Navigate to="/commitment" replace />;
  }
  
  return children;
}

// Public Route - redirect authenticated users
function PublicRoute({ children }) {
  const { isAuthenticated, loading, profile } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (isAuthenticated && profile?.onboarding_complete) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

// Commitment Route - requires auth but NOT completed onboarding
function CommitmentRoute({ children }) {
  const { isAuthenticated, loading, profile } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // If already completed onboarding, go to dashboard
  if (profile?.onboarding_complete) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public routes */}
        <Route path="/" element={<PublicRoute><Welcome /></PublicRoute>} />
        <Route path="/framing" element={<Framing />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/results" element={<Results />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/commitment" element={<CommitmentRoute><Commitment /></CommitmentRoute>} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/checkin" element={<ProtectedRoute><Checkin /></ProtectedRoute>} />
        <Route path="/plan" element={<ProtectedRoute><Plan /></ProtectedRoute>} />
        <Route path="/plan/week/:weekNumber" element={<ProtectedRoute><Week /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
        <Route path="/upgrade" element={<ProtectedRoute><Upgrade /></ProtectedRoute>} />
        <Route path="/coaching" element={<ProtectedRoute><Coaching /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
