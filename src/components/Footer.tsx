import { Link } from '../router';
import { Instagram, Mail, Heart, Facebook } from 'lucide-react';

const PinterestIcon = ({ size = 17, className = "" }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.16-.1-.95-.2-2.4.04-3.43.22-.93 1.4-5.93 1.4-5.93s-.36-.72-.36-1.77c0-1.66.96-2.9 2.16-2.9 1.02 0 1.51.77 1.51 1.68 0 1.03-.65 2.56-.99 3.99-.28 1.19.6 2.16 1.77 2.16 2.12 0 3.76-2.24 3.76-5.48 0-2.87-2.06-4.88-5.01-4.88-3.41 0-5.42 2.56-5.42 5.2 0 1.03.4 2.13.9 2.73.1.12.11.23.08.35-.09.37-.28 1.15-.32 1.3-.05.21-.18.26-.41.15-1.53-.71-2.48-2.95-2.48-4.75 0-3.87 2.81-7.43 8.11-7.43 4.26 0 7.57 3.04 7.57 7.09 0 4.23-2.67 7.64-6.37 7.64-1.24 0-2.41-.65-2.81-1.41l-.77 2.92c-.28 1.06-1.03 2.39-1.54 3.22A12 12 0 1012 0z" />
  </svg>
);


export default function Footer() {
  return (
    <footer className="border-t-2" style={{ background: '#F4EFE6', borderColor: '#8A9C7A' }}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img
              src="/logo.webp"
              alt="Nutrition with Teagan"
              className="h-20 w-auto object-contain mb-5"
            />
            <p className="font-montserrat text-sm font-medium text-text-body leading-relaxed mb-6">
              Evidence-based naturopathic nutrition for women seeking hormonal balance, gut healing, and vibrant skin health.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/nutritionwithteagan?igsh=dzd6d2ZyNmhiMzVq&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-text-body hover:text-sage hover:shadow-soft transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={17} />
              </a>
              <a
                href="https://www.facebook.com/share/1NwnTt7fS3/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-text-body hover:text-sage hover:shadow-soft transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={17} />
              </a>
              <a
                href="https://pin.it/6t0QYCdyH"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-text-body hover:text-sage hover:shadow-soft transition-all duration-300"
                aria-label="Pinterest"
              >
                <PinterestIcon size={17} />
              </a>
              <a
                href="mailto:NutritionwithTeagan@outlook.com"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-text-body hover:text-sage hover:shadow-soft transition-all duration-300"
                aria-label="Email"
              >
                <Mail size={17} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-montserrat text-xs font-bold tracking-[0.18em] uppercase text-text-heading mb-6">
              Navigate
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'About Teagan', to: '/about' },
                { label: 'Services', to: '/services' },
                { label: 'Programs', to: '/programs' },
                { label: 'Blog', to: '/blog' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-montserrat text-sm font-medium text-text-body hover:text-sage transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Specialisations */}
          <div>
            <h4 className="font-montserrat text-xs font-bold tracking-[0.18em] uppercase text-text-heading mb-6">
              Specialisations
            </h4>
            <ul className="space-y-3">
              {[
                'Hormonal Health',
                'Gut Health',
                'Skin Health',
                'Metabolic Support',
                'PCOS & PMS',
                'Thyroid & Fatigue',
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/services"
                    className="font-montserrat text-sm font-medium text-text-body hover:text-sage transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-montserrat text-xs font-bold tracking-[0.18em] uppercase text-text-heading mb-6">
              Connect
            </h4>
            <ul className="space-y-3 mb-8">
              <li>
                <a
                  href="mailto:NutritionwithTeagan@outlook.com"
                  className="font-montserrat text-sm font-medium text-text-body hover:text-sage transition-colors duration-300"
                >
                  NutritionwithTeagan@outlook.com
                </a>
              </li>
              <li>
                <Link
                  to="/testimonials"
                  className="font-montserrat text-sm font-medium text-text-body hover:text-sage transition-colors duration-300"
                >
                  Client Testimonials
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="font-montserrat text-sm font-medium text-text-body hover:text-sage transition-colors duration-300"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="font-montserrat text-sm font-medium text-text-body hover:text-sage transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
            <Link
              to="/booking"
              className="inline-flex items-center justify-center bg-sage text-white font-montserrat text-xs font-bold tracking-[0.15em] uppercase px-7 py-3.5 rounded-full transition-all duration-300 hover:bg-sage-dark hover:shadow-soft"
            >
              Book Consultation
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '2px solid #8A9C7A' }}>
          <p className="font-montserrat text-xs font-medium text-text-body">
            &copy; {new Date().getFullYear()} Nutrition with Teagan. All rights reserved.
          </p>
          <p className="font-montserrat text-xs font-medium text-text-body flex items-center gap-1.5">
            Made with <Heart size={11} className="text-lilac-dark fill-lilac-dark" /> for women's wellness
          </p>
          <div className="flex items-center gap-5">
            <Link to="/contact" className="font-montserrat text-xs font-medium text-text-body hover:text-sage transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link to="/contact" className="font-montserrat text-xs font-medium text-text-body hover:text-sage transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
