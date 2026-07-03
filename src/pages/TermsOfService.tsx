import { ArrowRight, FileText, HeartHandshake, AlertCircle, Ban } from 'lucide-react';
import { Link } from '../router';
import ScrollReveal from '../components/ScrollReveal';

function BotanicalDivider() {
  return (
    <div className="botanical-divider mt-0 mb-8 lg:mb-10" aria-hidden="true">
      <span className="opacity-60 text-sage text-lg">✦</span>
    </div>
  );
}

export default function TermsOfService() {
  return (
    <div className="pt-24 overflow-x-hidden" style={{ background: '#FAF8F3' }}>
      {/* Header */}
      <section className="py-16 px-6 text-center relative overflow-hidden bg-gradient-warm">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-15" style={{ background: 'radial-gradient(ellipse, #A999C2 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="section-tag">Policies & Agreements</p>
          <h1 className="section-title mb-5">
            Terms of<br />
            <em className="not-italic text-sage">Service</em>
          </h1>
          <p className="section-subtitle">
            Please read these terms carefully before booking consultations or wellness programmes. Last updated: July 2026.
          </p>
        </div>
      </section>

      <BotanicalDivider />

      {/* Main Content */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Medical Disclaimer Alert */}
          <ScrollReveal>
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-card hover:shadow-card-hover transition-all duration-500 border-2 border-lilac-dark/40" style={{ background: 'rgba(169, 153, 194, 0.05)' }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-lilac/20 flex items-center justify-center">
                  <AlertCircle className="text-lilac-dark" size={24} />
                </div>
                <h2 className="font-playfair text-2xl font-bold text-text-heading">Clinical Medical Disclaimer</h2>
              </div>
              <p className="font-montserrat text-sm text-text-secondary leading-relaxed mb-4 font-semibold">
                Naturopathic nutritional therapy is an evidence-based complementary health system designed to support healthy physiological function, digestion, and systemic balance. It is NOT a replacement for conventional medical diagnosis, treatment, or advice.
              </p>
              <p className="font-montserrat text-sm text-text-secondary leading-relaxed">
                Teagan is a qualified Naturopathic Nutritionist, not a GP. You must always consult with your primary healthcare provider or GP before stopping, starting, or modifying any prescribed medications, hormones, or therapeutic protocols.
              </p>
            </div>
          </ScrollReveal>

          {/* Section 1: Bookings */}
          <ScrollReveal>
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-card hover:shadow-card-hover transition-all duration-500 border border-sage/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center">
                  <HeartHandshake className="text-sage" size={24} />
                </div>
                <h2 className="font-playfair text-2xl font-bold text-text-heading">1. Bookings & Consultations</h2>
              </div>
              <p className="font-montserrat text-sm text-text-secondary leading-relaxed mb-4">
                By purchasing consultations, initial assessments, or 3-month wellness programmes, you agree to:
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  'Provide honest, accurate, and complete information on your pre-consultation health questionnaires.',
                  'Attend video/telehealth sessions on time. Delays will count toward your scheduled consult duration.',
                  'Use consultation hours within the defined package periods (e.g. 12 weeks for the Hormone Reset Programme).',
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0 mt-2" />
                    <span className="font-montserrat text-sm text-text-secondary leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Section 2: Cancellations */}
          <ScrollReveal>
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-card hover:shadow-card-hover transition-all duration-500 border border-sage/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                  <Ban className="text-red-500" size={24} />
                </div>
                <h2 className="font-playfair text-2xl font-bold text-text-heading">2. Cancellation & Rescheduling Policy</h2>
              </div>
              <p className="font-montserrat text-sm text-text-secondary leading-relaxed mb-4">
                We maintain a strict scheduling window to ensure all clients receive equal attention and priority booking access:
              </p>
              <div className="bg-gradient-cream rounded-2xl p-6 border border-sage/15 space-y-4">
                <div>
                  <h4 className="font-montserrat text-sm font-bold text-text-heading mb-1">48-Hour Rescheduling Notice</h4>
                  <p className="font-montserrat text-xs text-text-secondary leading-relaxed">
                    Rescheduling requests must be submitted at least 48 hours before the consultation start time. No fees will apply.
                  </p>
                </div>
                <div>
                  <h4 className="font-montserrat text-sm font-bold text-text-heading mb-1">Late Cancellations & No-Shows</h4>
                  <p className="font-montserrat text-xs text-text-secondary leading-relaxed">
                    Cancellations or modifications submitted with less than 24 hours notice, or failure to join the consultation screen within 15 minutes of the start time, will result in a 100% forfeiture of the session fee.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Section 3: Intellectual Property */}
          <ScrollReveal>
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-card hover:shadow-card-hover transition-all duration-500 border border-sage/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-yellow-mellow-light flex items-center justify-center">
                  <FileText className="text-yellow-mellow-dark" size={24} />
                </div>
                <h2 className="font-playfair text-2xl font-bold text-text-heading">3. Educational Resources & IP</h2>
              </div>
              <p className="font-montserrat text-sm text-text-secondary leading-relaxed mb-4">
                All meal plans, custom guide booklets, recipe compilations, hormone guides, and clinical worksheets provided during your programme are the sole intellectual property of Nutrition with Teagan.
              </p>
              <p className="font-montserrat text-sm text-text-secondary leading-relaxed">
                They are licensed to you strictly for personal, non-commercial use. Sharing, redistributing, publishing, or selling clinical materials provided in the programme is strictly prohibited.
              </p>
            </div>
          </ScrollReveal>

          {/* Governing Law Card */}
          <ScrollReveal>
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-card hover:shadow-card-hover transition-all duration-500 border border-sage/10">
              <h2 className="font-playfair text-2xl font-bold text-text-heading mb-4">4. Governing Law</h2>
              <p className="font-montserrat text-sm text-text-secondary leading-relaxed">
                These terms of service and any consultation contracts signed through our portals are governed by and construed in accordance with the laws of the United Kingdom. Any disputes arising from consulting services will be resolved within UK courts.
              </p>
            </div>
          </ScrollReveal>

          {/* Accept CTA */}
          <ScrollReveal>
            <div className="bg-gradient-sage text-white rounded-3xl p-8 lg:p-10 text-center relative overflow-hidden shadow-luxury">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full pointer-events-none translate-x-10 -translate-y-10" />
              <h3 className="font-playfair text-2xl md:text-3xl font-medium mb-4">Ready to Begin Your Reset?</h3>
              <p className="font-montserrat text-sm text-white/80 leading-relaxed max-w-xl mx-auto mb-8">
                Confirm your agreement with our terms and book your initial consultation panel to launch your wellness protocols.
              </p>
              <Link to="/booking" className="inline-flex items-center gap-2 bg-white text-text-heading font-montserrat text-xs font-bold tracking-[0.15em] uppercase px-8 py-4 rounded-full transition-all duration-300 hover:shadow-luxury hover:-translate-y-0.5">
                Book Consultation Now <ArrowRight size={15} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
