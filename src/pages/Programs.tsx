import { Link } from '../router';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';

export default function Programs() {
  return (
    <div className="pt-24 min-h-screen overflow-x-hidden" style={{ background: '#FAF8F3' }}>
      <SEO
        title="Wellness Programmes | Nutrition with Teagan"
        description="Wellness programmes are coming soon. Book an initial or follow-up naturopathic nutrition consultation in the meantime."
      />
      <section className="py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-15" style={{ background: 'radial-gradient(ellipse, #D8C26D 0%, transparent 70%)' }} />
        </div>
        <ScrollReveal>
          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="section-tag">Wellness Programmes</p>
            <h1 className="section-title mb-5">
              Transformative Programmes<br />
              <em className="not-italic text-sage">Coming Soon</em>
            </h1>
            <p className="section-subtitle mb-9">
              I’m currently focusing on initial and follow-up consultations. Programmes will be available soon.
            </p>
            <Link to="/booking" className="btn-booking btn-pulse">
              Book a Consultation <ArrowRight size={15} />
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
