import { useState, useEffect } from 'react';
import { Link } from '../router';
import { ArrowRight, Loader2 } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { supabase } from '../lib/supabase';

interface ServiceCategory {
  id: string;
  title: string;
  tagline: string;
  color: string;
  bgColor: string;
  image: string;
  description: string;
  conditions: string[];
  benefits: string[];
}

interface ConsultationOption {
  id: string;
  title: string;
  duration: string;
  price: string;
  description: string;
  included: string[];
  featured: boolean;
}

const categories: ServiceCategory[] = [
  {
    id: 'skin',
    title: 'Skin Health',
    tagline: 'Reveal Your Natural Radiance',
    color: '#D8C26D',
    bgColor: '#D8C26D20',
    image: 'https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Your skin is a mirror of your internal health. Teagan\'s inside-out nutritional approach addresses the root causes of skin concerns — from gut dysbiosis and hormonal imbalances to nutrient deficiencies and inflammation — to restore your skin\'s natural glow.',
    conditions: ['Acne & Breakouts', 'Eczema', 'Psoriasis', 'Rosacea', 'Skin Inflammation', 'Dull & Tired Skin'],
    benefits: [
      'Targeted anti-inflammatory nutrition protocols',
      'Gut microbiome support for the gut-skin axis',
      'Hormonal balancing to reduce hormonal acne',
      'Nutrient repletion for collagen and skin barrier support',
    ],
  },
  {
    id: 'hormones',
    title: 'Hormonal Health',
    tagline: 'Reclaim Your Hormonal Harmony',
    color: '#A999C2',
    bgColor: '#A999C220',
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Hormonal imbalances touch every aspect of a woman\'s life — from energy and mood to periods and fertility. Teagan\'s evidence-based naturopathic approach identifies hormonal disruptions at their source and creates a personalised plan to restore balance naturally.',
    conditions: ['PCOS', 'PMS & PMDD', 'Heavy Periods', 'Painful Periods', 'Cycle Irregularities', 'Hormonal Imbalance', 'Spotting', 'Perimenopause'],
    benefits: [
      'Hormonal profiling and dietary assessment',
      'Targeted nutritional protocols for each phase of your cycle',
      'Blood sugar and insulin regulation strategies',
      'Stress and cortisol support for adrenal health',
    ],
  },
  {
    id: 'gut',
    title: 'Gut Health',
    tagline: 'Restore Digestive Vitality',
    color: '#9FAF93',
    bgColor: '#9FAF9320',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Your gut is the foundation of your health — influencing immunity, hormones, mental health, and skin. Teagan uses a comprehensive, functional approach to identify gut imbalances and restore digestive health through personalised nutrition, therapeutic foods, and targeted supplementation.',
    conditions: ['IBS', 'Bloating & Gas', 'Constipation', 'Acid Reflux', 'Food Sensitivities', 'Digestive Discomfort'],
    benefits: [
      'Comprehensive gut microbiome assessment',
      'Elimination and reintroduction protocols',
      'Prebiotic and probiotic nutrition strategies',
      'Digestive enzyme and gut-lining support',
    ],
  },
  {
    id: 'metabolic',
    title: 'Metabolic Support',
    tagline: 'Optimise Your Metabolism',
    color: '#D8C89B',
    bgColor: '#D8C89B20',
    image: 'https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Metabolic health affects your energy, weight, hormones, and longevity. Through evidence-based nutritional strategies, Teagan helps you stabilise blood sugar, support thyroid function, and restore the energy and vitality you thought you\'d lost.',
    conditions: ['Insulin Resistance', 'Blood Sugar Imbalances', 'Thyroid Concerns', 'Chronic Fatigue', 'Low Energy', 'Unexplained Weight Changes'],
    benefits: [
      'Blood sugar stabilisation through strategic meal planning',
      'Thyroid-supportive nutritional protocols',
      'Mitochondrial support for sustained energy',
      'Anti-inflammatory and adaptogenic strategies',
    ],
  },
];

export default function Services() {
  const [consultationTypes, setConsultationTypes] = useState<ConsultationOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;

        if (data) {
          const mapped: ConsultationOption[] = data.map((s) => {
            const formattedPrice = new Intl.NumberFormat('en-GB', {
              style: 'currency',
              currency: 'GBP',
              minimumFractionDigits: 0,
            }).format(s.price_pence / 100);

            // Determine dynamic list based on common services
            let includedList = ['Comprehensive health assessment', 'Nourishing dietary advice', 'Personalised lifestyle advice'];
            if (s.title.toLowerCase().includes('initial')) {
              includedList = ['Full health history review', 'Dietary analysis', 'Initial nutrition plan', 'Supplement recommendations', 'Follow-up pathway'];
            } else if (s.title.toLowerCase().includes('follow')) {
              includedList = ['Progress review', 'Plan refinement', 'New protocols', 'Updated supplement guidance', 'Ongoing support'];
            } else if (s.title.toLowerCase().includes('intensive') || s.title.toLowerCase().includes('package')) {
              includedList = ['Initial + 6 follow-ups', 'Personalised meal plans', 'Recipe resources', 'Between-session support', 'Priority booking'];
            }

            return {
              id: s.id,
              title: s.title,
              duration: s.duration_minutes ? `${s.duration_minutes} Minutes` : '60 Minutes',
              price: formattedPrice,
              description: s.description || '',
              included: includedList,
              featured: s.is_featured || false,
            };
          });
          setConsultationTypes(mapped);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center" style={{ background: '#FAF8F3' }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-sage mx-auto mb-4" />
          <p className="font-montserrat text-sm text-text-body">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 overflow-x-hidden" style={{ background: '#FAF8F3' }}>
      {/* Header */}
      <section className="py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-15" style={{ background: 'radial-gradient(ellipse, #9FAF93 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="section-tag">Services</p>
          <h1 className="section-title mb-5">
            Specialised Naturopathic Nutrition<br />
            <em className="not-italic text-sage">For Every Concern</em>
          </h1>
          <p className="section-subtitle">
            Evidence-based, personalised nutrition support designed to address the root causes of your symptoms and restore your natural vitality.
          </p>
        </div>
      </section>

      {/* Service Categories */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          {categories.map((cat, i) => (
            <ScrollReveal key={cat.id} delay={i * 80}>
              <div className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500">
                <div className={`grid ${i % 2 === 0 ? 'lg:grid-cols-[1fr_400px]' : 'lg:grid-cols-[400px_1fr]'} gap-0`}>
                  {/* Content */}
                  <div className={`p-10 lg:p-12 ${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6" style={{ background: cat.bgColor }}>
                      <span className="font-montserrat text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: cat.color === '#9FAF93' ? '#4a6b40' : cat.color === '#D8C26D' ? '#7a6820' : cat.color === '#A999C2' ? '#5d4d7a' : '#7a6030' }}>
                        {cat.tagline}
                      </span>
                    </div>
                    <h2 className="font-playfair text-3xl md:text-4xl font-medium text-text-primary mb-4">{cat.title}</h2>
                    <p className="font-montserrat text-sm text-text-secondary leading-relaxed mb-7">{cat.description}</p>

                    <div className="grid sm:grid-cols-2 gap-6 mb-8">
                      <div>
                        <h4 className="font-montserrat text-xs font-semibold tracking-widest uppercase text-text-primary mb-3">Conditions Addressed</h4>
                        <ul className="space-y-2">
                          {cat.conditions.map((c) => (
                            <li key={c} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                              <span className="font-montserrat text-sm text-text-secondary">{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-montserrat text-xs font-semibold tracking-widest uppercase text-text-primary mb-3">What You'll Receive</h4>
                        <ul className="space-y-2">
                          {cat.benefits.map((b) => (
                            <li key={b} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: cat.color }} />
                              <span className="font-montserrat text-sm text-text-secondary">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Link to="/booking" className="btn-primary">
                      Book a Consultation <ArrowRight size={15} />
                    </Link>
                  </div>

                  {/* Image */}
                  <div className={`hidden lg:block relative overflow-hidden ${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover min-h-[420px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Consultation Types */}
      <section className="py-20 px-6" style={{ background: '#F4EFE6' }}>
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="section-tag">Investment</p>
              <h2 className="section-title mb-4">
                Consultation Options
              </h2>
              <p className="section-subtitle max-w-xl mx-auto">
                Choose the level of support that works best for your needs and wellness goals.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {consultationTypes.map((type, i) => (
              <ScrollReveal key={type.id || type.title} delay={i * 100}>
                <div className={`h-full flex flex-col rounded-3xl p-9 shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1 ${
                  type.featured
                    ? 'bg-sage text-white'
                    : 'bg-white'
                }`}>
                  {type.featured && (
                    <span className="self-start font-montserrat text-xs font-semibold tracking-wider uppercase bg-white/20 text-white px-3 py-1.5 rounded-full mb-5">
                      Best Value
                    </span>
                  )}
                  <div className="mb-6">
                    <p className={`font-montserrat text-xs font-semibold tracking-wider uppercase mb-3 ${type.featured ? 'text-white/70' : 'text-text-light'}`}>
                      {type.duration}
                    </p>
                    <h3 className={`font-playfair text-2xl font-medium mb-2 ${type.featured ? 'text-white' : 'text-text-primary'}`}>{type.title}</h3>
                    <p className={`font-playfair text-3xl font-medium ${type.featured ? 'text-white' : 'text-sage'}`}>{type.price}</p>
                  </div>
                  <p className={`font-montserrat text-sm leading-relaxed mb-7 flex-1 ${type.featured ? 'text-white/85' : 'text-text-secondary'}`}>{type.description}</p>
                  <ul className="space-y-3 mb-8">
                    {type.included.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${type.featured ? 'bg-white/70' : 'bg-sage'}`} />
                        <span className={`font-montserrat text-sm ${type.featured ? 'text-white/85' : 'text-text-secondary'}`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/booking"
                    className={`mt-auto w-full text-center font-montserrat text-xs font-semibold tracking-[0.15em] uppercase px-6 py-4 rounded-full transition-all duration-300 ${
                      type.featured
                        ? 'bg-white text-text-primary hover:bg-cream-warm'
                        : 'border border-sage text-sage hover:bg-sage hover:text-white'
                    }`}
                  >
                    Book Now
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6" style={{ background: '#FAF8F3' }}>
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <p className="section-tag">Take the First Step</p>
            <h2 className="section-title mb-5">
              Ready to Heal from<br />
              <em className="not-italic text-sage">the Inside Out?</em>
            </h2>
            <p className="section-subtitle mb-9">
              Book your initial consultation and begin your personalised naturopathic nutrition journey today.
            </p>
            <Link to="/booking" className="btn-primary">
              Book Your Consultation <ArrowRight size={15} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
