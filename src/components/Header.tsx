import { useState, useEffect } from 'react';
import { Link, usePathname, useRouter } from '../router';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Programs', to: '/programs' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { navigate } = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white shadow-card py-3'
            : 'bg-white/80 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/logo.webp"
              alt="Nutrition with Teagan"
              className="h-18 md:h-22 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-montserrat text-xs font-bold tracking-[0.12em] uppercase transition-colors duration-300 ${
                  pathname === link.to
                    ? 'text-sage'
                    : 'text-text-heading hover:text-sage'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile Hamburger */}
          <div className="flex items-center gap-4">
            <Link
              to="/booking"
              className="hidden md:inline-flex items-center gap-2 btn-booking btn-pulse !px-6 !py-3 !text-xs"
            >
              Book Now
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-text-heading transition-colors hover:text-sage"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 lg:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(24, 24, 24, 0.4)' }}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-full shadow-luxury transition-transform duration-500 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ background: '#FAF8F3' }}
        >
          <div className="flex flex-col h-full pt-20 pb-6 px-6">
            <img
              src="/logo.webp"
              alt="Nutrition with Teagan"
              className="h-12 w-auto object-contain mb-6 self-start flex-shrink-0"
            />

            <div className="mb-6 flex-shrink-0">
              <button
                onClick={() => { navigate('/booking'); setMenuOpen(false); }}
                className="w-full text-center btn-booking btn-pulse !text-xs !px-6 !py-3.5"
              >
                Book Consultation
              </button>
            </div>

            <nav className="flex flex-col gap-4 overflow-y-auto flex-1 pr-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`font-montserrat text-xs font-bold tracking-[0.12em] uppercase pb-3 transition-colors duration-300 ${
                    pathname === link.to
                      ? 'text-sage'
                      : 'text-text-heading hover:text-sage'
                  }`}
                  style={{ borderBottom: '1px solid rgba(138, 156, 122, 0.3)' }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
