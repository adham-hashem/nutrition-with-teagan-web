import { useState, useEffect } from 'react';
import { Link } from '../router';
import { ArrowRight, ChevronDown, Loader2 } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { supabase } from '../lib/supabase';

interface FAQQuestion {
  q: string;
  a: string;
}

interface FAQSection {
  category: string;
  questions: FAQQuestion[];
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left bg-white rounded-2xl px-7 py-6 shadow-card transition-all duration-300 hover:shadow-card-hover"
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-playfair text-lg font-medium text-text-primary leading-snug">{q}</h3>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full border border-sage/25 flex items-center justify-center transition-all duration-300 ${open ? 'bg-sage border-sage' : 'bg-transparent'}`}>
          <ChevronDown size={15} className={`transition-transform duration-300 ${open ? 'rotate-180 text-white' : 'text-sage'}`} />
        </div>
      </div>
      {open && (
        <p className="font-montserrat text-sm text-text-secondary leading-relaxed mt-4 text-left">
          {a}
        </p>
      )}
    </button>
  );
}

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFAQs() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('faq_items')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;

        if (data) {
          const groupedMap: { [key: string]: FAQQuestion[] } = {};
          
          data.forEach((item) => {
            const cat = item.category || 'General';
            if (!groupedMap[cat]) {
              groupedMap[cat] = [];
            }
            groupedMap[cat].push({ q: item.question, a: item.answer });
          });

          const formatted: FAQSection[] = Object.keys(groupedMap).map((cat) => ({
            category: cat,
            questions: groupedMap[cat],
          }));

          setFaqs(formatted);
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFAQs();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center" style={{ background: '#FAF8F3' }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-sage mx-auto mb-4" />
          <p className="font-montserrat text-sm text-text-body">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 overflow-x-hidden" style={{ background: '#FAF8F3' }}>
      {/* Header */}
      <section className="py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-15" style={{ background: 'radial-gradient(ellipse, #D8C26D 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="section-tag">FAQ</p>
          <h1 className="section-title mb-5">
            Frequently Asked<br />
            <em className="not-italic text-sage">Questions</em>
          </h1>
          <p className="section-subtitle">
            Everything you need to know about working with Teagan and the naturopathic nutrition journey.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto space-y-14">
          {faqs.length === 0 ? (
            <div className="text-center py-10">
              <p className="font-playfair text-xl text-text-secondary">No FAQs available at the moment.</p>
            </div>
          ) : (
            faqs.map((section, i) => (
              <ScrollReveal key={section.category} delay={i * 80}>
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px flex-1 bg-sage/20" />
                    <span className="font-montserrat text-xs font-semibold tracking-[0.2em] uppercase text-sage px-3">
                      {section.category}
                    </span>
                    <div className="h-px flex-1 bg-sage/20" />
                  </div>
                  <div className="space-y-4">
                    {section.questions.map((item) => (
                      <FAQItem key={item.q} q={item.q} a={item.a} />
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))
          )}
        </div>
      </section>

      {/* Still have questions? */}
      <section className="py-20 px-6" style={{ background: '#F4EFE6' }}>
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <p className="section-tag">Still Have Questions?</p>
            <h2 className="section-title mb-5">
              We'd Love to<br />
              <em className="not-italic text-sage">Hear from You</em>
            </h2>
            <p className="section-subtitle mb-9">
              Reach out directly and Teagan or her team will be happy to answer any questions about your health concerns or the consultation process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-primary">
                Get in Touch <ArrowRight size={15} />
              </Link>
              <Link to="/booking" className="btn-outline">
                Book a Consultation
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
