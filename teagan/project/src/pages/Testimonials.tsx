import { Link } from '../router';
import { ArrowRight, Star, Quote } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const testimonials = [
  {
    name: 'Sarah M.',
    tag: 'Hormone Reset Programme',
    location: 'London',
    image: 'https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=200',
    stars: 5,
    quote: 'Working with Teagan completely transformed my relationship with my hormones. After 3 months, my PCOS symptoms are practically gone — regular cycles, no more crippling cramps, and my skin has never been clearer. This is the best investment I\'ve ever made in my health.',
  },
  {
    name: 'Emma R.',
    tag: 'Gut Healing Programme',
    location: 'Manchester',
    image: null,
    stars: 5,
    quote: 'I spent years struggling with IBS and nothing worked — not doctors, not diets, not anything. Teagan\'s personalised approach finally gave me my life back. After 8 weeks, the bloating and pain are 90% gone. I can actually eat meals without fear now.',
  },
  {
    name: 'Olivia K.',
    tag: 'Skin Health Programme',
    location: 'Edinburgh',
    image: null,
    stars: 5,
    quote: 'My skin has never looked better. I\'d tried every topical product imaginable for my acne. Teagan\'s inside-out approach — addressing my gut and hormones — was exactly what I needed. Ten weeks in and I am glowing.',
  },
  {
    name: 'Jessica T.',
    tag: 'Metabolic Wellness Programme',
    location: 'Bristol',
    image: 'https://images.pexels.com/photos/5998454/pexels-photo-5998454.jpeg?auto=compress&cs=tinysrgb&w=200',
    stars: 5,
    quote: 'I had been exhausted for years and was told it was "just stress." Teagan identified that I had blood sugar dysregulation and subclinical thyroid issues. Within 6 weeks of her programme I had more energy than I\'d had in a decade. Life changing.',
  },
  {
    name: 'Natalie B.',
    tag: 'Hormone Reset Programme',
    location: 'Birmingham',
    image: null,
    stars: 5,
    quote: 'Teagan listened to everything I\'d been experiencing and never made me feel dismissed. She saw the full picture of my health and created a plan that actually worked. My PMS is barely noticeable now, and I feel like myself again.',
  },
  {
    name: 'Chloe W.',
    tag: 'Gut Healing Programme',
    location: 'Leeds',
    image: null,
    stars: 5,
    quote: 'The online consultation format was so convenient — I could attend from home between meetings. Teagan was incredibly thorough and professional. The gut healing protocol she designed for me was detailed, practical, and actually delicious to follow!',
  },
  {
    name: 'Amelia F.',
    tag: 'Initial Consultation',
    location: 'Oxford',
    image: 'https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=200',
    stars: 5,
    quote: 'Even from a single consultation I felt like Teagan understood my body better than any practitioner I\'d seen before. The personalised nutrition plan she created was thorough, easy to follow, and I started seeing improvements within 2 weeks.',
  },
  {
    name: 'Hannah L.',
    tag: 'Skin Health Programme',
    location: 'Cardiff',
    image: null,
    stars: 5,
    quote: 'Eczema has plagued me my entire life. After Teagan\'s skin programme, I am using barely any topical treatments and my skin is calm and hydrated for the first time. I wish I\'d found her years ago.',
  },
  {
    name: 'Zoe P.',
    tag: 'Hormone Reset Programme',
    location: 'Brighton',
    image: null,
    stars: 5,
    quote: 'Being based remotely, online consultations were a game-changer for accessing quality naturopathic care. Teagan was warm, knowledgeable, and empowering. My cycle is now regular and predictable for the first time in my adult life.',
  },
];

const stats = [
  { number: '200+', label: 'Women Supported' },
  { number: '6+', label: 'Years Experience' },
  { number: '98%', label: 'Client Satisfaction' },
  { number: '4', label: 'Specialisations' },
];

export default function Testimonials() {
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
          {/* Featured Testimonials — larger */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {testimonials.slice(0, 2).map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 100}>
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

          {/* Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.slice(2).map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 80}>
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
            <Link to="/booking" className="btn-primary">
              Book Your Consultation <ArrowRight size={15} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
