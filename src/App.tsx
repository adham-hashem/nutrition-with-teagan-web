import { Router, Routes, Route, usePathname } from './router';
import { AdminAuthProvider } from './admin/auth/AdminAuth';
import AdminRouter from './admin/AdminRouter';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Programs from './pages/Programs';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Testimonials from './pages/Testimonials';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import BookingStatus from './pages/BookingStatus';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

function PublicLayout() {
  const pathname = usePathname();
  const isBooking = pathname === '/booking' || pathname === '/booking/status';
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAF8F3', border: '1px solid rgba(122, 139, 112, 0.22)', boxShadow: 'inset 0 0 0 1px rgba(214, 194, 122, 0.10)' }}>
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking/status" element={<BookingStatus />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Routes>
      </main>
      {!isBooking && <Footer />}
      {isBooking && (
        <footer className="py-6 px-6 text-center border-t border-sage/15" style={{ background: '#F4EFE6' }}>
          <p className="font-montserrat text-xs text-text-light">
            &copy; {new Date().getFullYear()} Nutrition with Teagan. All rights reserved. Your information is safe and secure.
          </p>
        </footer>
      )}
    </div>
  );
}

function AppContent() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      <PublicLayout />
      {isAdmin && <AdminRouter />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AdminAuthProvider>
        <AppContent />
      </AdminAuthProvider>
    </Router>
  );
}
