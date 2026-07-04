import { Link } from '../router';
import { Instagram, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t-2" style={{ background: '#F4EFE6', borderColor: '#8A9C7A' }}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img
              src="/image.png"
              alt="Nutrition with Teagan"
              className="h-16 w-auto object-contain mb-5"
            />
            <p className="font-montserrat text-sm font-medium text-text-body leading-relaxed mb-6">
              Evidence-based naturopathic nutrition for women seeking hormonal balance, gut healing, and vibrant skin health.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-text-body hover:text-sage hover:shadow-soft transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={17} />
              </a>
              <a
                href="mailto:hello@nutritionwithteagan.com"
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
                  href="mailto:hello@nutritionwithteagan.com"
                  className="font-montserrat text-sm font-medium text-text-body hover:text-sage transition-colors duration-300"
                >
                  hello@nutritionwithteagan.com
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
