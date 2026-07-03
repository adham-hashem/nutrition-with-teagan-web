import { Link } from '../router';
import { ArrowRight, Clock, CheckCircle2, Video } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const programs = [
  {
    id: 'hormone',
    title: 'Hormone Reset Programme',
    subtitle: 'Balance Your Hormones, Reclaim Your Life',
    duration: '12 Weeks',
    price: '£350',
    tag: 'Most Popular',
    tagColor: '#A999C2',
    consultationType: 'Online',
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'A comprehensive 12-week hormonal healing programme designed for women experiencing PCOS, PMS, painful or heavy periods, cycle irregularities, or hormonal imbalances. Through targeted nutrition, lifestyle medicine, and evidence-based supplementation, you\'ll restore natural hormonal harmony.',
    suitable: ['PCOS', 'PMS & PMDD', 'Irregular periods', 'Painful periods', 'Hormonal acne', 'Fertility support'],
    includes: [
      'Initial 75-minute consultation',
      'Monthly follow-up consultations (x2)',
      'Personalised hormonal nutrition plan',
      'Cycle-syncing meal guide',
      'Supplement protocol',
      'Lifestyle and stress support strategies',
      'Between-session messaging support',
      'Recipe library access',
    ],
    outcomes: [
      'Regulated, predictable menstrual cycle',
      'Reduced PMS and period pain',
      'Improved energy and mood stability',
      'Clearer skin and reduced hormonal acne',
    ],
  },
  {
    id: 'gut',
    title: 'Gut Healing Programme',
    subtitle: 'Restore Digestive Balance & Microbiome Health',
    duration: '8 Weeks',
    price: '£350',
    tag: 'Bestseller',
    tagColor: '#9FAF93',
    consultationType: 'Online',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'An 8-week intensive gut healing programme targeting the root causes of IBS, bloating, constipation, acid reflux, and food sensitivities. Using a systematic approach — including elimination phases, gut-healing protocols, and microbiome restoration — you\'ll rebuild a thriving, resilient digestive system.',
    suitable: ['IBS', 'Bloating & gas', 'Constipation', 'Acid reflux', 'Food sensitivities', 'Gut-skin issues'],
    includes: [
      'Initial 75-minute consultation',
      'Follow-up consultation at week 4',
      'Personalised gut-healing nutrition plan',
      'Elimination and reintroduction guide',
      'Microbiome-restoring supplement protocol',
      'Gut-healing recipe collection',
      'Between-session messaging support',
    ],
    outcomes: [
      'Significant reduction in bloating and gas',
      'Regular, comfortable bowel movements',
      'Identified and managed food sensitivities',
      'Improved gut microbiome diversity',
    ],
  },
  {
    id: 'skin',
    title: 'Skin Health Programme',
    subtitle: 'Heal Your Skin From the Inside Out',
    duration: '10 Weeks',
    price: '£320',
    tag: 'Transformative',
    tagColor: '#D8C26D',
    consultationType: 'Online',
    image: 'https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'A 10-week inside-out skin health programme addressing acne, eczema, psoriasis, and other inflammatory skin conditions through targeted nutrition, gut healing, and hormonal balancing. Rather than topical treatments alone, this programme targets the internal drivers of skin inflammation and disruption.',
    suitable: ['Acne & breakouts', 'Eczema', 'Psoriasis', 'Rosacea', 'Skin inflammation', 'Dull or congested skin'],
    includes: [
      'Initial 75-minute consultation',
      'Follow-up consultations at weeks 4 and 8',
      'Personalised skin-focused nutrition plan',
      'Anti-inflammatory eating guide',
      'Gut-skin axis healing protocol',
      'Skin-supportive supplement plan',
      'Lifestyle and stress support',
      'Between-session support',
    ],
    outcomes: [
      'Clearer, calmer, more radiant skin',
      'Reduced inflammatory flare-ups',
      'Improved gut health supporting skin clarity',
      'Balanced hormones reducing hormonal breakouts',
    ],
  },
  {
    id: 'metabolic',
    title: 'Metabolic Wellness Programme',
    subtitle: 'Restore Energy, Balance Blood Sugar & Thrive',
    duration: '10 Weeks',
    price: '£380',
    tag: 'Revitalising',
    tagColor: '#D8C89B',
    consultationType: 'Online',
    image: 'https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'A 10-week metabolic health programme designed for women experiencing insulin resistance, blood sugar dysregulation, thyroid concerns, or chronic fatigue. Through evidence-based nutritional strategies, you\'ll optimise your metabolism, restore energy, and support thyroid and adrenal health.',
    suitable: ['Insulin resistance', 'Blood sugar issues', 'Thyroid concerns', 'Chronic fatigue', 'Low energy', 'Unexplained weight changes'],
    includes: [
      'Initial 75-minute consultation',
      'Follow-up consultations at weeks 4 and 8',
      'Personalised metabolic nutrition plan',
      'Blood sugar stabilisation guide',
      'Thyroid and adrenal support protocol',
      'Energy-restoring supplement plan',
      'Movement and lifestyle strategies',
      'Between-session support',
    ],
    outcomes: [
      'Stable, sustained energy throughout the day',
      'Improved blood sugar regulation',
      'Supported thyroid and adrenal function',
      'Reduced fatigue and brain fog',
    ],
  },
];

export default function Programs() {
  return (
    <div className="pt-24 overflow-x-hidden" style={{ background: '#FAF8F3' }}>
      {/* Header */}
      <section className="py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-15" style={{ background: 'radial-gradient(ellipse, #D8C26D 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="section-tag">Wellness Programmes</p>
          <h1 className="section-title mb-5">
            Transformative Programmes<br />
            <em className="not-italic text-sage">Built Around You</em>
          </h1>
          <p className="section-subtitle">
            Deep-dive wellness programmes that go beyond a single consultation to create lasting, meaningful transformation in your health.
          </p>
        </div>
      </section>

      {/* Programs */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          {programs.map((program, i) => (
            <ScrollReveal key={program.id} delay={80}>
              <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500">
                {/* Hero Image */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
                    <div>
                      <span
                        className="inline-block font-montserrat text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-full mb-3 text-text-primary"
                        style={{ background: program.tagColor }}
                      >
                        {program.tag}
                      </span>
                      <h2 className="font-playfair text-3xl font-medium text-white">{program.title}</h2>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="font-playfair text-3xl font-medium text-white">{program.price}</p>
                      <p className="font-montserrat text-xs text-white/80 uppercase tracking-wider mt-1">{program.duration}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-10 lg:p-12">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Clock size={15} className="text-sage" />
                      <span className="font-montserrat text-sm">{program.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Video size={15} className="text-sage" />
                      <span className="font-montserrat text-sm">{program.consultationType} Consultation</span>
                    </div>
                    <div className="sm:hidden ml-auto">
                      <span className="font-playfair text-2xl font-medium text-sage">{program.price}</span>
                    </div>
                  </div>

                  <p className="font-montserrat text-sm text-text-secondary leading-relaxed mb-10 max-w-3xl">
                    {program.description}
                  </p>

                  <div className="grid md:grid-cols-3 gap-8 mb-10">
                    {/* Suitable For */}
                    <div>
                      <h4 className="font-montserrat text-xs font-semibold tracking-widest uppercase text-text-primary mb-4">Suitable For</h4>
                      <ul className="space-y-2">
                        {program.suitable.map((s) => (
                          <li key={s} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0" />
                            <span className="font-montserrat text-sm text-text-secondary">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* What's Included */}
                    <div>
                      <h4 className="font-montserrat text-xs font-semibold tracking-widest uppercase text-text-primary mb-4">What's Included</h4>
                      <ul className="space-y-2">
                        {program.includes.map((inc) => (
                          <li key={inc} className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-sage flex-shrink-0 mt-0.5" />
                            <span className="font-montserrat text-sm text-text-secondary">{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Outcomes */}
                    <div>
                      <h4 className="font-montserrat text-xs font-semibold tracking-widest uppercase text-text-primary mb-4">Expected Outcomes</h4>
                      <ul className="space-y-2">
                        {program.outcomes.map((o) => (
                          <li key={o} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: program.tagColor }} />
                            <span className="font-montserrat text-sm text-text-secondary">{o}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/booking" className="btn-primary">
                      Book This Programme <ArrowRight size={15} />
                    </Link>
                    <Link to="/contact" className="btn-outline">
                      Ask a Question
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Not sure? */}
      <section className="py-20 px-6" style={{ background: '#F4EFE6' }}>
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <p className="section-tag">Not Sure Where to Start?</p>
            <h2 className="section-title mb-5">
              Let's Find the Right<br />
              <em className="not-italic text-sage">Programme for You</em>
            </h2>
            <p className="section-subtitle mb-9">
              Every woman's health journey is unique. Reach out with your questions and Teagan will help you identify the best programme for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking" className="btn-primary">
                Book Your Consultation <ArrowRight size={15} />
              </Link>
              <Link to="/contact" className="btn-outline">
                Get in Touch
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
