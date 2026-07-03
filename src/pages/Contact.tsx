import { useState } from 'react';
import { Link } from '../router';
import { Mail, Instagram, ArrowRight, CheckCircle2, Send, Loader2, Facebook } from 'lucide-react';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import { supabase } from '../lib/supabase';

const PinterestIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
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


export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const name = form.name.trim();
    const email = form.email.trim();
    const subject = form.subject.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('contact_messages')
        .insert({
          name,
          email,
          subject: subject || 'General Enquiry',
          message,
          status: 'unread',
        });

      if (insertError) throw insertError;

      setSubmitted(true);
    } catch (err: any) {
      console.error('Contact submission error:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 overflow-x-hidden" style={{ background: '#FAF8F3' }}>
      <SEO
        title="Contact Teagan | Book Naturopathic Consultation Online"
        description="Get in touch with Teagan for general inquiries, partnership opportunities, or support. Book your initial consultation session online today."
        keywords="contact nutritionist, hire naturopath, women health advice online, book nutritionist consultation"
        schema={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Nutrition with Teagan",
          "description": "Get in touch with Teagan for general inquiries, support, or consultation booking.",
          "url": "https://nutritionwithteagan.com/contact"
        }}
      />
      {/* Header */}
      <section className="py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-15" style={{ background: 'radial-gradient(ellipse, #A999C2 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="section-tag">Get in Touch</p>
          <h1 className="section-title mb-5">
            Let's Start Your<br />
            <em className="not-italic text-sage">Wellness Journey</em>
          </h1>
          <p className="section-subtitle">
            Have questions? We'd love to hear from you. Reach out and we'll respond within 24–48 business hours.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_500px] gap-14">
          {/* Left Info */}
          <ScrollReveal>
            <div>
              <h2 className="font-playfair text-2xl font-medium text-text-primary mb-7">Ways to Connect</h2>

              <div className="space-y-5 mb-12">
                <a
                  href="mailto:NutritionwithTeagan@outlook.com"
                  className="flex items-center gap-5 bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center group-hover:bg-sage/20 transition-colors duration-300">
                    <Mail size={20} className="text-sage" />
                  </div>
                  <div>
                    <p className="font-montserrat text-xs font-semibold uppercase tracking-wider text-text-light mb-1">Email</p>
                    <p className="font-montserrat text-sm font-medium text-text-primary">NutritionwithTeagan@outlook.com</p>
                  </div>
                </a>

                <a
                  href="https://www.instagram.com/nutritionwithteagan?igsh=dzd6d2ZyNmhiMzVq&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-lilac/10 flex items-center justify-center group-hover:bg-lilac/20 transition-colors duration-300">
                    <Instagram size={20} className="text-lilac-dark" />
                  </div>
                  <div>
                    <p className="font-montserrat text-xs font-semibold uppercase tracking-wider text-text-light mb-1">Instagram</p>
                    <p className="font-montserrat text-sm font-medium text-text-primary">@nutritionwithteagan</p>
                  </div>
                </a>

                <a
                  href="https://www.facebook.com/share/1NwnTt7fS3/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50/50 flex items-center justify-center group-hover:bg-blue-100/50 transition-colors duration-300">
                    <Facebook size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-montserrat text-xs font-semibold uppercase tracking-wider text-text-light mb-1">Facebook</p>
                    <p className="font-montserrat text-sm font-medium text-text-primary">Nutrition with Teagan</p>
                  </div>
                </a>

                <a
                  href="https://pin.it/6t0QYCdyH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-red-50/50 flex items-center justify-center group-hover:bg-red-100/50 transition-colors duration-300">
                    <PinterestIcon size={20} className="text-red-600" />
                  </div>
                  <div>
                    <p className="font-montserrat text-xs font-semibold uppercase tracking-wider text-text-light mb-1">Pinterest</p>
                    <p className="font-montserrat text-sm font-medium text-text-primary">Nutrition with Teagan</p>
                  </div>
                </a>
              </div>

              {/* Response time */}
              <div className="bg-sage/8 border border-sage/20 rounded-2xl p-7 mb-12" style={{ background: 'rgba(178,190,168,0.08)' }}>
                <h4 className="font-playfair text-lg font-medium text-text-primary mb-3">Response Times</h4>
                <ul className="space-y-2">
                  {[
                    'General enquiries: 24–48 business hours',
                    'Booking questions: Same business day',
                    'Client portal messages: Within 24 hours',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-sage flex-shrink-0 mt-0.5" />
                      <span className="font-montserrat text-sm text-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div className="bg-white rounded-2xl p-7 shadow-card">
                <p className="section-tag">Newsletter</p>
                <h4 className="font-playfair text-xl font-medium text-text-primary mb-3">
                  Join the Wellness Community
                </h4>
                <p className="font-montserrat text-sm text-text-secondary leading-relaxed mb-5">
                  Receive nourishing wellness insights, seasonal recipes, and exclusive content directly to your inbox.
                </p>
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-4 py-3 rounded-full border border-sage/25 bg-cream-DEFAULT font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 transition"
                    style={{ background: '#FAF8F3' }}
                  />
                  <button type="submit" className="btn-primary text-xs px-6 py-3 whitespace-nowrap">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </ScrollReveal>

          {/* Contact Form */}
          <ScrollReveal delay={150}>
            <div className="bg-white rounded-3xl p-9 shadow-card">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-sage/15 flex items-center justify-center mb-6">
                    <CheckCircle2 size={30} className="text-sage" />
                  </div>
                  <h3 className="font-playfair text-2xl font-medium text-text-primary mb-3">Message Sent!</h3>
                  <p className="font-montserrat text-sm text-text-secondary mb-8 max-w-xs">
                    Thank you for reaching out. Teagan's team will respond within 24–48 business hours.
                  </p>
                  <Link to="/booking" className="btn-primary text-xs px-7 py-3.5">
                    Book a Consultation <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <>
                  <h3 className="font-playfair text-2xl font-medium text-text-primary mb-7">Send a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary block mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full px-5 py-3.5 rounded-2xl border border-sage/25 bg-cream-DEFAULT font-montserrat text-sm text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-sage/30 transition"
                        style={{ background: '#FAF8F3' }}
                      />
                    </div>
                    <div>
                      <label className="font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary block mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="hello@example.com"
                        className="w-full px-5 py-3.5 rounded-2xl border border-sage/25 bg-cream-DEFAULT font-montserrat text-sm text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-sage/30 transition"
                        style={{ background: '#FAF8F3' }}
                      />
                    </div>
                    <div>
                      <label className="font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary block mb-2">
                        Subject
                      </label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-5 py-3.5 rounded-2xl border border-sage/25 bg-cream-DEFAULT font-montserrat text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-sage/30 transition appearance-none"
                        style={{ background: '#FAF8F3' }}
                      >
                        <option value="">Select a topic</option>
                        <option>General Enquiry</option>
                        <option>Booking Question</option>
                        <option>Programme Information</option>
                        <option>Health Question</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary block mb-2">
                        Message *
                      </label>
                      <textarea
                        required
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell us how we can help..."
                        rows={5}
                        className="w-full px-5 py-4 rounded-2xl border border-sage/25 bg-cream-DEFAULT font-montserrat text-sm text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-sage/30 transition resize-none"
                        style={{ background: '#FAF8F3' }}
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-500 font-montserrat">{error}</p>
                    )}

                    <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-50">
                      {loading ? (
                        <>Sending... <Loader2 size={15} className="animate-spin" /></>
                      ) : (
                        <>Send Message <Send size={15} /></>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
