import { ReactNode, useState } from 'react';
import { Link, usePathname } from '../../router';
import { useAdminAuth } from '../auth/AdminAuth';
import {
  LayoutDashboard,
  CalendarDays,
  Package,
  FileText,
  Clock,
  Mail,
  MessageSquareQuote,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ExternalLink,
  Percent,
  Stethoscope,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/bookings', label: 'Bookings', icon: CalendarDays },
  { path: '/admin/services', label: 'Consultations', icon: Stethoscope },
  { path: '/admin/programmes', label: 'Programmes', icon: Package },
  { path: '/admin/blog', label: 'Blog', icon: FileText },
  { path: '/admin/discount-codes', label: 'Discount Codes', icon: Percent },
  { path: '/admin/availability', label: 'Availability', icon: Clock },
  { path: '/admin/messages', label: 'Messages', icon: Mail },
  { path: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { path: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, signOut } = useAdminAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: '#FAF8F3' }} dir="ltr">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-full border-r border-sage/10 transition-all duration-300 z-20 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
        style={{ background: '#fff' }}
      >
        {/* Logo */}
        <div className="h-18 flex items-center justify-between px-5 border-b border-sage/10">
          {sidebarOpen && (
            <div>
              <h1 className="font-playfair text-lg font-medium text-text-primary leading-tight">
                Teagan
              </h1>
              <p className="font-montserrat text-[10px] text-text-light uppercase tracking-wider">
                Admin Dashboard
              </p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg hover:bg-sage/10 transition-colors ${!sidebarOpen ? 'mx-auto' : ''}`}
          >
            <ChevronLeft
              className={`w-5 h-5 text-text-secondary transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-sage text-white shadow-soft'
                        : 'text-text-secondary hover:bg-sage/10 hover:text-text-primary'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${!sidebarOpen ? 'mx-auto' : ''}`} />
                    {sidebarOpen && (
                      <span className="font-montserrat text-sm font-medium">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User & Sign Out */}
        <div className="p-3 border-t border-sage/10">
          {sidebarOpen && user && (
            <div className="px-3 py-2 mb-2">
              <p className="font-montserrat text-sm font-medium text-text-primary truncate">
                {user.email}
              </p>
              <p className="font-montserrat text-xs text-text-light">Administrator</p>
            </div>
          )}
          <button
            onClick={signOut}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-text-secondary hover:bg-red-50 hover:text-red-600 transition-all ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-montserrat text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 border-b border-sage/10 z-20"
        style={{ background: '#fff' }}
      >
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-sage/10 transition-colors"
        >
          <Menu className="w-6 h-6 text-text-secondary" />
        </button>
        <h1 className="font-playfair text-lg font-medium text-text-primary">Admin</h1>
        <button
          onClick={signOut}
          className="p-2 rounded-lg hover:bg-sage/10 transition-colors"
        >
          <LogOut className="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/20" />
          <aside
            className="absolute left-0 top-0 bottom-0 w-72 p-4"
            style={{ background: '#fff' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-playfair text-lg font-medium text-text-primary">
                  Teagan
                </h2>
                <p className="font-montserrat text-xs text-text-light uppercase tracking-wider">
                  Admin Dashboard
                </p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-sage/10 transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-sage text-white'
                        : 'text-text-secondary hover:bg-sage/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-montserrat text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {user && (
              <div className="mt-6 pt-4 border-t border-sage/10">
                <p className="font-montserrat text-sm text-text-primary px-3">{user.email}</p>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 pt-16 lg:pt-0 transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        {/* Top Bar */}
        <header
          className="hidden lg:flex items-center justify-between h-18 px-6 border-b border-sage/10"
          style={{ background: '#fff' }}
        >
          <div />
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:bg-sage/10 hover:text-text-primary transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="font-montserrat text-sm">View Website</span>
            </a>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
