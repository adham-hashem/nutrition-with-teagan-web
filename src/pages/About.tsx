import { Link } from '../router';
import { ArrowRight, CheckCircle2, Leaf, Heart, BookOpen, Award } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const qualifications = [
  { icon: <Award size={18} />, title: 'BHSc Nutritional Medicine', body: 'Bachelor of Health Science with a specialisation in Nutritional Medicine.' },
  { icon: <BookOpen size={18} />, title: 'Naturopathic Practitioner', body: 'Certified naturopathic nutritionist with a whole-body approach to healing.' },
  { icon: <Leaf size={18} />, title: 'AFN Member', body: 'Active member of the Association for Nutrition (AFN), committed to ongoing professional development.' },
  { icon: <Heart size={18} />, title: "Women's Health Specialist", body: "Specialised postgraduate training in women's hormonal and reproductive health." },
];

const values = [
  { title: 'Root Cause Focus', description: 'Every symptom is a message. Teagan looks beyond the surface to identify and address the underlying drivers of your health concerns.' },
  { title: 'Evidence-Based Approach', description: 'Naturopathic nutrition grounded in current scientific research, combined with traditional healing wisdom and clinical expertise.' },
  { title: 'Personalised Protocols', description: 'No two bodies are the same. Your nutrition plan is crafted specifically for your unique biochemistry, lifestyle, and health goals.' },
  { title: 'Whole-Body Healing', description: 'Physical, emotional, and lifestyle factors all influence your wellbeing. Teagan considers the whole person, not just isolated symptoms.' },
];

export default function About() {
  return (
    <div className="pt-24 overflow-x-hidden" style={{ background: '#FAF8F3' }}>
      {/* Page Header */}
      <section className="py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-15" style={{ background: 'radial-gradient(ellipse, #A999C2 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="section-tag">About</p>
          <h1 className="section-title mb-5">
            Meet Teagan — Naturopathic Nutritionist
          </h1>
          <p className="section-subtitle">
            A passionate advocate for women's health, Teagan combines science and compassion to support your healing journey.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div className="relative">
              <div className="rounded-[2.5rem] overflow-hidden shadow-luxury">
                <img
                  src="/girl image.webp"
                  alt="Teagan — Naturopathic Nutritionist"
                  className="w-full h-[560px] object-cover"
                />
              </div>
              {/* Decorative badge */}
              <div className="absolute -bottom-6 -right-4 bg-white rounded-2xl p-5 shadow-luxury">
                <p className="font-playfair text-3xl font-medium text-sage mb-1">200+</p>
                <p className="font-montserrat text-xs text-text-secondary">Women Supported</p>
              </div>
              <div className="absolute top-8 -left-4 bg-lilac/15 border border-lilac/25 rounded-2xl p-4 shadow-soft">
                <p className="font-montserrat text-xs font-semibold text-text-primary">6+ Years</p>
                <p className="font-montserrat text-xs text-text-secondary">Clinical Experience</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div>
              <p className="section-tag">My Story</p>
              <h2 className="font-playfair text-3xl md:text-4xl font-medium text-text-primary mb-6 leading-tight">
                From Personal Struggle<br />
                <em className="not-italic text-sage">To Purposeful Practice</em>
              </h2>
              <div className="space-y-5 font-montserrat text-base text-text-secondary leading-[1.85]">
                <p>
                  Teagan's journey into naturopathic nutrition began with her own health struggles. After years of battling hormonal imbalances, debilitating PMS, and persistent skin concerns — and feeling dismissed by conventional medicine — she discovered the profound power of food as medicine.
                </p>
                <p>
                  This personal transformation sparked a passion for holistic women's health that led her to pursue a Bachelor of Health Science in Nutritional Medicine, where she trained in evidence-based naturopathic nutrition, herbal medicine, and functional testing.
                </p>
                <p>
                  Today, Teagan combines her clinical expertise with genuine empathy to help women across the UK and beyond reclaim their vitality, balance their hormones, heal their gut, and glow from the inside out.
                </p>
              </div>
              <div className="mt-8">
                <Link to="/booking" className="btn-primary">
                  Work With Teagan <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Qualifications */}
      <section className="py-20 px-6" style={{ background: '#F4EFE6' }}>
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="section-tag">Credentials</p>
              <h2 className="section-title">
                Qualifications &<br />
                <em className="not-italic text-sage">Certifications</em>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {qualifications.map((q, i) => (
              <ScrollReveal key={q.title} delay={i * 80}>
                <div className="bg-white rounded-3xl p-7 shadow-card h-full">
                  <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center text-sage mb-5">
                    {q.icon}
                  </div>
                  <h3 className="font-playfair text-lg font-medium text-text-primary mb-3">{q.title}</h3>
                  <p className="font-montserrat text-sm text-text-secondary leading-relaxed">{q.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy / Values */}
      <section className="py-20 px-6" style={{ background: '#FAF8F3' }}>
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="section-tag">Philosophy</p>
              <h2 className="section-title">
                The Principles That Guide<br />
                <em className="not-italic text-sage">Every Consultation</em>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 80}>
                <div className="flex gap-5 bg-white rounded-3xl p-8 shadow-card">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 size={22} className="text-sage" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-xl font-medium text-text-primary mb-3">{v.title}</h3>
                    <p className="font-montserrat text-sm text-text-secondary leading-relaxed">{v.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Online Process */}
      <section className="py-20 px-6" style={{ background: '#F4EFE6' }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div>
              <p className="section-tag">Online Consultations</p>
              <h2 className="font-playfair text-3xl md:text-4xl font-medium text-text-primary mb-6 leading-tight">
                World-Class Care,<br />
                <em className="not-italic text-sage">From Your Home</em>
              </h2>
              <p className="font-montserrat text-base text-text-secondary leading-[1.85] mb-6">
                Teagan's telehealth consultations deliver the same depth of personalised care as in-person appointments. Using a secure video platform, you'll receive a thorough health assessment, personalised nutrition plan, and ongoing support — from wherever you are.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Secure, private video consultations',
                  'Detailed health history review',
                  'Personalised written nutrition plan',
                  'Supplement and lifestyle recommendations',
                  'Follow-up support via messaging',
                  'Access to client portal and resources',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-sage flex-shrink-0" />
                    <span className="font-montserrat text-sm text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/booking" className="btn-primary">
                Book a Consultation <ArrowRight size={15} />
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="rounded-[2.5rem] overflow-hidden shadow-luxury">
              <img
                src="https://images.pexels.com/photos/4498605/pexels-photo-4498605.jpeg?auto=compress&cs=tinysrgb&w=700"
                alt="Online wellness consultation"
                className="w-full h-[480px] object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission CTA */}
      <section className="py-20 px-6" style={{ background: '#FAF8F3' }}>
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <div className="bg-sage/10 border border-sage/20 rounded-[2.5rem] p-12">
              <p className="section-tag">Mission</p>
              <blockquote className="font-playfair text-2xl md:text-3xl font-medium text-text-primary leading-relaxed mb-8 italic">
                "To empower every woman to understand her body, nourish herself intentionally, and live with the vibrant energy and hormonal harmony she deserves."
              </blockquote>
              <p className="font-montserrat text-sm text-text-secondary mb-2">— Teagan</p>
              <p className="font-montserrat text-xs text-sage uppercase tracking-widest">Naturopathic Nutritionist</p>
              <div className="mt-10">
                <Link to="/booking" className="btn-primary">
                  Begin Your Healing Journey <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
