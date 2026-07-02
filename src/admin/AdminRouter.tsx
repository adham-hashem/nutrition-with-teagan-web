import { Routes, Route, usePathname } from '../router';
import { useAdminAuth } from './auth/AdminAuth';
import AdminLayout from './layout/AdminLayout';
import LoginPage from './auth/LoginPage';
import Dashboard from './pages/Dashboard';
import BookingsPage from './pages/BookingsPage';
import ProgrammesPage from './pages/ProgrammesPage';
import ServicesPage from './pages/ServicesPage';
import BlogPage from './pages/BlogPage';
import BlogEditorPage from './pages/BlogEditorPage';
import AvailabilityPage from './pages/AvailabilityPage';
import MessagesPage from './pages/MessagesPage';
import TestimonialsPage from './pages/TestimonialsPage';
import FAQPage from './pages/FAQPage';
import SettingsPage from './pages/SettingsPage';
import DiscountCodesPage from './pages/DiscountCodesPage';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAdminAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAF8F3' }}>
        <Loader2 className="w-8 h-8 animate-spin text-sage" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

export default function AdminRouter() {
  const pathname = usePathname();

  if (!pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <Routes>
      <Route path="/admin" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/bookings" element={
        <ProtectedRoute>
          <BookingsPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/programmes" element={
        <ProtectedRoute>
          <ProgrammesPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/services" element={
        <ProtectedRoute>
          <ServicesPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/blog" element={
        <ProtectedRoute>
          <BlogPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/blog/new" element={
        <ProtectedRoute>
          <BlogEditorPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/blog/edit/:id" element={
        <ProtectedRoute>
          <BlogEditorPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/discount-codes" element={
        <ProtectedRoute>
          <DiscountCodesPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/availability" element={
        <ProtectedRoute>
          <AvailabilityPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/messages" element={
        <ProtectedRoute>
          <MessagesPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/testimonials" element={
        <ProtectedRoute>
          <TestimonialsPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/faq" element={
        <ProtectedRoute>
          <FAQPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
