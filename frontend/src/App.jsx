import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import NotFoundPage from './pages/NotFoundPage';
import AuthPage from './pages/AuthPage';
import DocsPage from './pages/DocsPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      {/* Global toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card2)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontSize: '0.875rem',
          },
        }}
      />

      {/* Flex column layout so footer stays at bottom */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/"               element={<LandingPage />} />
            <Route path="/auth"           element={<AuthPage />} />
            <Route path="/upload"         element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
            <Route path="/dashboard/:id"  element={<DashboardPage />} />
            <Route path="/history"        element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
            <Route path="/docs"           element={<DocsPage />} />
            <Route path="*"               element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
