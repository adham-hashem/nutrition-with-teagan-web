import { Link } from '../router';
import { Instagram, Mail, Heart } from 'lucide-react';

const WhatsappIcon = ({ size = 17, className = "" }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
  >
    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
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
        <div className="mt-14 pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '2px solid #8A9C7A' }}>
          <p className="font-montserrat text-xs font-medium text-text-body">
            &copy; {new Date().getFullYear()} Nutrition with Teagan. All rights reserved.
          </p>
          <p className="font-montserrat text-xs font-medium text-text-body flex items-center gap-1.5">
            Made with <Heart size={11} className="text-lilac-dark fill-lilac-dark" /> for women's wellness
          </p>
          <div className="font-montserrat text-xs font-medium text-text-body flex items-center gap-2.5">
            <span>Developers:</span>
            <a 
              href="https://wa.me/201013989517" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-text-body hover:text-[#25D366] hover:scale-115 transition-all duration-300 flex items-center"
              title="Contact Developer 1 via WhatsApp"
            >
              <WhatsappIcon size={17} />
            </a>
            <a 
              href="https://wa.me/201027548602" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-text-body hover:text-[#25D366] hover:scale-115 transition-all duration-300 flex items-center"
              title="Contact Developer 2 via WhatsApp"
            >
              <WhatsappIcon size={17} />
            </a>
          </div>
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
