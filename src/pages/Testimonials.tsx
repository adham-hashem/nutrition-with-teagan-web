import { useEffect, useState } from 'react';
import { Link } from '../router';
import { ArrowRight, Star, Quote, Loader2 } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { supabase } from '../lib/supabase';

interface Testimonial {
  id: string;
  name: string;
  tag: string;
  location: string;
  image: string | null;
  stars: number;
  quote: string;
}

const stats = [
  { number: '200+', label: 'Women Supported' },
  { number: '6+', label: 'Years Experience' },
  { number: '98%', label: 'Client Satisfaction' },
  { number: '4', label: 'Specialisations' },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_approved', true)
          .order('display_order', { ascending: true });

        if (error) throw error;

        if (data) {
          const mapped: Testimonial[] = data.map((t) => ({
            id: t.id,
            name: t.client_name,
            tag: t.programme || 'Wellness Programme',
            location: t.client_location || 'UK',
            image: t.image_url,
            stars: t.rating || 5,
            quote: t.quote,
          }));
          setTestimonials(mapped);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center" style={{ background: '#FAF8F3' }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-sage mx-auto mb-4" />
          <p className="font-montserrat text-sm text-text-body">Loading stories...</p>
        </div>
      </div>
    );
  }

  const featuredList = testimonials.slice(0, 2);
  const restList = testimonials.slice(2);

  return (
    <div className="pt-24 overflow-x-hidden" style={{ background: '#FAF8F3' }}>
      {/* Header */}
      <section className="py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-15" style={{ background: 'radial-gradient(ellipse, #A999C2 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="section-tag">Client Stories</p>
          <h1 className="section-title mb-5">
            Real Women, Real<br />
            <em className="not-italic text-sage">Transformations</em>
          </h1>
          <p className="section-subtitle">
            Hear from women who have reclaimed their hormonal health, gut wellness, skin confidence, and energy through naturopathic nutrition.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6" style={{ background: '#F4EFE6' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 80}>
              <div className="text-center py-6">
                <p className="font-playfair text-4xl font-medium text-sage mb-2">{stat.number}</p>
                <p className="font-montserrat text-xs text-text-secondary uppercase tracking-wider">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {testimonials.length === 0 ? (
            <div className="text-center py-10">
              <p className="font-playfair text-xl text-text-secondary">No testimonials approved yet.</p>
            </div>
          ) : (
            <>
              {/* Featured Testimonials — larger */}
              {featuredList.length > 0 && (
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {featuredList.map((t, i) => (
                    <ScrollReveal key={t.id} delay={i * 100}>
                      <div className="bg-white rounded-3xl p-10 shadow-card h-full flex flex-col">
                        <Quote size={28} className="text-sage/30 mb-5" />
                        <div className="flex items-center gap-1 mb-5">
                          {[...Array(t.stars)].map((_, j) => (
                            <Star key={j} size={14} className="text-yellow-mellow fill-yellow-mellow" />
                          ))}
                        </div>
                        <blockquote className="font-playfair text-xl text-text-primary leading-relaxed flex-1 mb-7 italic">
                          "{t.quote}"
                        </blockquote>
                        <div className="flex items-center gap-4 pt-5 border-t border-sage/15">
                          {t.image ? (
                            <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-sage/15 flex items-center justify-center">
                              <span className="font-playfair text-lg text-sage font-medium">{t.name[0]}</span>
                            </div>
                          )}
                          <div>
                            <p className="font-montserrat text-sm font-semibold text-text-primary">{t.name}</p>
                            <p className="font-montserrat text-xs text-sage mt-0.5">{t.tag}</p>
                            <p className="font-montserrat text-xs text-text-light">{t.location}</p>
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              )}

              {/* Grid */}
              {restList.length > 0 && (
                <div className="grid md:grid-cols-3 gap-8">
                  {restList.map((t, i) => (
                    <ScrollReveal key={t.id} delay={i * 80}>
                      <div className="bg-white rounded-3xl p-8 shadow-card h-full flex flex-col">
                        <div className="flex items-center gap-1 mb-5">
                          {[...Array(t.stars)].map((_, j) => (
                            <Star key={j} size={13} className="text-yellow-mellow fill-yellow-mellow" />
                          ))}
                        </div>
                        <blockquote className="font-playfair text-base text-text-primary leading-relaxed flex-1 mb-6 italic">
                          "{t.quote}"
                        </blockquote>
                        <div className="flex items-center gap-3 pt-5 border-t border-sage/15">
                          {t.image ? (
                            <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-lilac/20 flex items-center justify-center">
                              <span className="font-playfair text-base text-lilac-dark font-medium">{t.name[0]}</span>
                            </div>
                          )}
                          <div>
                            <p className="font-montserrat text-sm font-semibold text-text-primary">{t.name}</p>
                            <p className="font-montserrat text-xs text-sage">{t.tag}</p>
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6" style={{ background: '#F4EFE6' }}>
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <p className="section-tag">Your Story Awaits</p>
            <h2 className="section-title mb-5">
              Ready to Write Your<br />
              <em className="not-italic text-sage">Own Transformation?</em>
            </h2>
            <p className="section-subtitle mb-9">
              Join the growing community of women who have reclaimed their health through personalised naturopathic nutrition.
            </p>
            <Link to="/booking" className="btn-booking btn-pulse">
              Book Your Consultation <ArrowRight size={15} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
