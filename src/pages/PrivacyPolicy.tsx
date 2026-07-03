import { ArrowRight, ShieldCheck, Eye, Database, FileText } from 'lucide-react';
import { Link } from '../router';
import ScrollReveal from '../components/ScrollReveal';

function BotanicalDivider() {
  return (
    <div className="botanical-divider mt-0 mb-8 lg:mb-10" aria-hidden="true">
      <span className="opacity-60 text-sage text-lg">✦</span>
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="pt-24 overflow-x-hidden" style={{ background: '#FAF8F3' }}>
      {/* Header */}
      <section className="py-16 px-6 text-center relative overflow-hidden bg-gradient-warm">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-15" style={{ background: 'radial-gradient(ellipse, #8A9C7A 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="section-tag">Privacy & Security</p>
          <h1 className="section-title mb-5">
            Privacy<br />
            <em className="not-italic text-sage">Policy</em>
          </h1>
          <p className="section-subtitle">
            How we protect, store, and respect your personal and health information. Last updated: July 2026.
          </p>
        </div>
      </section>

      <BotanicalDivider />

      {/* Main Content */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Intro Card */}
          <ScrollReveal>
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-card hover:shadow-card-hover transition-all duration-500 border border-sage/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center">
                  <ShieldCheck className="text-sage" size={24} />
                </div>
                <h2 className="font-playfair text-2xl font-bold text-text-heading">Our Commitment to You</h2>
              </div>
              <p className="font-montserrat text-sm text-text-secondary leading-relaxed mb-4">
                At Nutrition with Teagan, we treat your health and personal data with the utmost confidentiality. Under the General Data Protection Regulation (GDPR) and professional standards, we ensure that your personal information is stored securely, handled ethically, and used solely to guide your nutritional therapy.
              </p>
              <p className="font-montserrat text-sm text-text-secondary leading-relaxed">
                By using our services, booking consultations, or visiting our site, you consent to the data collection and processing methods described in this policy.
              </p>
            </div>
          </ScrollReveal>

          {/* Section 1: Collection */}
          <ScrollReveal>
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-card hover:shadow-card-hover transition-all duration-500 border border-sage/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-lilac/10 flex items-center justify-center">
                  <Eye className="text-lilac-dark" size={24} />
                </div>
                <h2 className="font-playfair text-2xl font-bold text-text-heading">1. Personal Data We Collect</h2>
              </div>
              <p className="font-montserrat text-sm text-text-secondary leading-relaxed mb-5">
                To build effective, evidence-based nutritional protocols, we collect information that relates directly to your physiological health, habits, and background:
              </p>
              <ul className="space-y-4">
                {[
                  { title: 'Identity & Contact Info', desc: 'Your full name, email address, phone number, and mailing address.' },
                  { title: 'Clinical Health History', desc: 'Symptoms, diagnosed medical conditions, allergies, current medications, supplement usage, family medical history, and sleep/digestive details.' },
                  { title: 'Dietary & Lifestyle Metrics', desc: 'Current eating patterns, nutrient intake journals, daily activity, hydration levels, stress factors, and emotional wellbeing.' },
                  { title: 'Diagnostics & Labs', desc: 'Any laboratory blood test panels, thyroid readings, stool analyses, or DUTCH hormone scores that you share for nutritional planning.' },
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0 mt-2" />
                    <div>
                      <h4 className="font-montserrat text-sm font-bold text-text-heading mb-0.5">{item.title}</h4>
                      <p className="font-montserrat text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Section 2: How We Use */}
          <ScrollReveal>
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-card hover:shadow-card-hover transition-all duration-500 border border-sage/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-yellow-mellow-light flex items-center justify-center">
                  <FileText className="text-yellow-mellow-dark" size={24} />
                </div>
                <h2 className="font-playfair text-2xl font-bold text-text-heading">2. How Your Information is Used</h2>
              </div>
              <p className="font-montserrat text-sm text-text-secondary leading-relaxed mb-4">
                We collect your data primarily to deliver safe, effective, and customised naturopathic care:
              </p>
              <ul className="space-y-3">
                {[
                  'Designing custom clinical nutrition protocols and lifestyle guides.',
                  'Conducting secure video consultation sessions and client check-ins.',
                  'Evaluating test outputs (such as hormone or gut biomarkers) to support healthy organ systems.',
                  'Billing, scheduling bookings, and confirming consult details.',
                  'Sending relevant newsletter insights (only when explicitly requested via subscription).',
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0" />
                    <span className="font-montserrat text-sm text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Section 3: Storage */}
          <ScrollReveal>
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-card hover:shadow-card-hover transition-all duration-500 border border-sage/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center">
                  <Database className="text-sage" size={24} />
                </div>
                <h2 className="font-playfair text-2xl font-bold text-text-heading">3. Storage & Security Measures</h2>
              </div>
              <p className="font-montserrat text-sm text-text-secondary leading-relaxed mb-4">
                We take data security very seriously. All digital information and consultation notes are kept on encrypted, password-protected servers compliant with GPDR compliance guidelines.
              </p>
              <p className="font-montserrat text-sm text-text-secondary leading-relaxed">
                Health information is classified as sensitive data and is never sold, shared, or distributed to third parties, except in cases where it is requested explicitly by you (e.g. sending a report to your GP) or when required by law to protect personal safety.
              </p>
            </div>
          </ScrollReveal>

          {/* Rights Section */}
          <ScrollReveal>
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-card hover:shadow-card-hover transition-all duration-500 border border-sage/10">
              <h2 className="font-playfair text-2xl font-bold text-text-heading mb-5">Your Rights</h2>
              <p className="font-montserrat text-sm text-text-secondary leading-relaxed mb-5">
                You hold full control over the personal and health info you provide to us:
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { title: 'Access & Export', text: 'You can request copies of all dietary guides, diagnostic reviews, and clinical logs we hold.' },
                  { title: 'Rectification', text: 'If your health indicators, address, or contact details change, we will update them immediately.' },
                  { title: 'Erasure (Right to be Forgotten)', text: 'You can request the complete erasure of your non-medical contact files at any time.' },
                  { title: 'Withdrawal of Consent', text: 'You can withdraw permission for dietary guidance or email updates instantly.' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-gradient-sage-soft rounded-2xl p-6 border border-sage/5">
                    <h4 className="font-montserrat text-sm font-bold text-text-heading mb-2">{item.title}</h4>
                    <p className="font-montserrat text-xs text-text-secondary leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Contact CTA */}
          <ScrollReveal>
            <div className="bg-gradient-sage text-white rounded-3xl p-8 lg:p-10 text-center relative overflow-hidden shadow-luxury">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full pointer-events-none translate-x-10 -translate-y-10" />
              <h3 className="font-playfair text-2xl md:text-3xl font-medium mb-4">Have Questions about Your Privacy?</h3>
              <p className="font-montserrat text-sm text-white/80 leading-relaxed max-w-xl mx-auto mb-8">
                If you would like to request file access, object to data processing, or understand more about our clinical record safety protocols, please contact our data lead.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-text-heading font-montserrat text-xs font-bold tracking-[0.15em] uppercase px-8 py-4 rounded-full transition-all duration-300 hover:shadow-luxury hover:-translate-y-0.5">
                Contact Data Lead <ArrowRight size={15} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
