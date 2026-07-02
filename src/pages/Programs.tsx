import { useState, useEffect } from 'react';
import { Link } from '../router';
import { ArrowRight, Clock, CheckCircle2, Video, Loader2 } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { supabase } from '../lib/supabase';

interface Program {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  price: string;
  tag: string;
  tagColor: string;
  consultationType: string;
  image: string;
  description: string;
  suitable: string[];
  includes: string[];
  outcomes: string[];
}

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgrammes() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('programmes')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;

        if (data) {
          const mapped: Program[] = data.map((p) => {
            const formattedPrice = new Intl.NumberFormat('en-GB', {
              style: 'currency',
              currency: 'GBP',
              minimumFractionDigits: 0,
            }).format(p.price_pence / 100);

            const displayConsultationType = p.consultation_type
              ? p.consultation_type.charAt(0).toUpperCase() + p.consultation_type.slice(1).replace('_', ' ')
              : 'Online';

            return {
              id: p.id,
              title: p.title,
              subtitle: p.subtitle || '',
              duration: `${p.duration_weeks} Weeks`,
              price: formattedPrice,
              tag: p.tag || '',
              tagColor: p.tag_color || '#9FAF93',
              consultationType: displayConsultationType,
              image: p.image_url || 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800',
              description: p.description || '',
              suitable: p.suitable_for || [],
              includes: p.includes || [],
              outcomes: p.outcomes || [],
            };
          });
          setPrograms(mapped);
        }
      } catch (error) {
        console.error('Error fetching programmes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProgrammes();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center" style={{ background: '#FAF8F3' }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-sage mx-auto mb-4" />
          <p className="font-montserrat text-sm text-text-body">Loading programmes...</p>
        </div>
      </div>
    );
  }

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
          {programs.length === 0 ? (
            <div className="text-center py-10">
              <p className="font-playfair text-xl text-text-secondary">No programmes available at the moment.</p>
            </div>
          ) : (
            programs.map((program) => (
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
                        {program.tag && (
                          <span
                            className="inline-block font-montserrat text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-full mb-3 text-text-primary"
                            style={{ background: program.tagColor }}
                          >
                            {program.tag}
                          </span>
                        )}
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
                      {program.suitable && program.suitable.length > 0 && (
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
                      )}

                      {/* What's Included */}
                      {program.includes && program.includes.length > 0 && (
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
                      )}

                      {/* Outcomes */}
                      {program.outcomes && program.outcomes.length > 0 && (
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
                      )}
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
            ))
          )}
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
