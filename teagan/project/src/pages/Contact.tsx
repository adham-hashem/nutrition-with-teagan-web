import { useState } from 'react';
import { Link } from '../router';
import { Mail, Instagram, ArrowRight, CheckCircle2, Send } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-24 overflow-x-hidden" style={{ background: '#FAF8F3' }}>
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
                  href="mailto:hello@nutritionwithteagan.com"
                  className="flex items-center gap-5 bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center group-hover:bg-sage/20 transition-colors duration-300">
                    <Mail size={20} className="text-sage" />
                  </div>
                  <div>
                    <p className="font-montserrat text-xs font-semibold uppercase tracking-wider text-text-light mb-1">Email</p>
                    <p className="font-montserrat text-sm font-medium text-text-primary">hello@nutritionwithteagan.com</p>
                  </div>
                </a>

                <a
                  href="https://instagram.com"
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
                    <button type="submit" className="btn-primary w-full justify-center">
                      Send Message <Send size={15} />
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
