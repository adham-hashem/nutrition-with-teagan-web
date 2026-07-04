import { useEffect, useState } from 'react';
import { Link } from '../router';
import { ArrowRight, Star, Leaf, CheckCircle2, Sparkles, Sprout, Flower2 } from 'lucide-react';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import { supabase } from '../lib/supabase';

function BotanicalDivider() {
  return (
    <div className="botanical-divider mt-0 mb-8 lg:mb-10" aria-hidden="true">
      <Flower2 size={16} className="opacity-60" />
    </div>
  );
}

function useParallax() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(max-width: 1023px)').matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setOffset(window.scrollY));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return offset;
}

const specialisations = [
  {
    title: 'Skin Health',
    icon: '✦',
    color: '#D6C27A', // Rich Mellow Yellow
    items: ['Acne', 'Eczema', 'Psoriasis', 'Skin Inflammation', 'Rosacea'],
    description: 'Nourish your skin from the inside out through targeted nutritional protocols that address root causes.',
  },
  {
    title: 'Hormonal Health',
    icon: '◈',
    color: '#9C8AB8', // Dark Pastel Lilac
    items: ['PMS', 'PCOS', 'Heavy Periods', 'Painful Periods', 'Cycle Irregularities'],
    description: 'Restore hormonal harmony through evidence-based nutrition and lifestyle strategies tailored to your cycle.',
  },
  {
    title: 'Gut Health',
    icon: '❋',
    color: '#8A9C7A', // Sage Green
    items: ['IBS', 'Constipation', 'Bloating', 'Acid Reflux', 'Digestive Concerns'],
    description: 'Heal your gut microbiome and restore digestive function with personalised nutrition and therapeutic support.',
  },
  {
    title: 'Metabolic Support',
    icon: '◉',
    color: '#C4B07A', // Gold
    items: ['Insulin Resistance', 'Blood Sugar', 'Thyroid Support', 'Fatigue', 'Low Energy'],
    description: 'Optimise your metabolism and energy systems through strategic nutritional interventions and lifestyle medicine.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Book Your Consultation',
    description: 'Select a program that resonates with your wellness goals and choose a time that suits your schedule.',
  },
  {
    number: '02',
    title: 'Complete Your Health Questionnaire',
    description: 'Share your full health history, symptoms, and lifestyle factors so Teagan can understand you holistically.',
  },
  {
    number: '03',
    title: 'Receive Your Personalised Plan',
    description: 'Receive a comprehensive, evidence-based nutrition and wellness protocol designed specifically for your body.',
  },
  {
    number: '04',
    title: 'Ongoing Support & Follow-Up',
    description: 'Benefit from continued guidance, check-ins, and plan refinements as your body transforms and heals.',
  },
];

const staticTestimonials = [
  {
    quote: 'Working with Teagan completely transformed my relationship with my hormones. After 3 months, my PCOS symptoms are practically gone.',
    name: 'Sarah M.',
    tag: 'PCOS & Hormonal Health',
  },
  {
    quote: 'I spent years struggling with IBS and nothing worked. Teagan\'s personalised approach finally gave me my life back.',
    name: 'Emma R.',
    tag: 'Gut Health',
  },
  {
    quote: 'My skin has never looked better. The inside-out approach to treating my acne was exactly what I needed.',
    name: 'Olivia K.',
    tag: 'Skin Health',
  },
];

const staticArticles = [
  {
    category: 'Hormones',
    title: 'Understanding Your Cycle: A Nutritional Guide to Each Phase',
    excerpt: 'Learn how to nourish your body through each phase of your menstrual cycle for optimal hormonal balance.',
    image: 'https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: 'Dec 2024',
  },
  {
    category: 'Gut Health',
    title: 'The Gut-Skin Connection: Why Your Skin Starts in the Gut',
    excerpt: 'Discover the science behind the gut-skin axis and how healing your microbiome can clear your complexion.',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: 'Nov 2024',
  },
  {
    category: 'Nutrition',
    title: '5 Anti-Inflammatory Foods Every Woman Should Eat Weekly',
    excerpt: 'These powerful whole foods reduce systemic inflammation and support hormones, skin, and energy levels.',
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: 'Nov 2024',
  },
];

interface ArticleItem {
  id?: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
}

export default function Home() {
  const offset = useParallax();
  const [recentArticles, setRecentArticles] = useState<ArticleItem[]>(staticArticles);
  const [recentTestimonials, setRecentTestimonials] = useState(staticTestimonials);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [postsRes, testRes] = await Promise.all([
          supabase
            .from('blog_posts')
            .select('*, blog_categories(name)')
            .eq('is_published', true)
            .order('published_at', { ascending: false })
            .limit(3),
          supabase
            .from('testimonials')
            .select('*')
            .eq('is_approved', true)
            .order('display_order', { ascending: true })
            .limit(3),
        ]);

        if (postsRes.data && postsRes.data.length > 0) {
          setRecentArticles(postsRes.data.map(p => {
            const dateObj = p.published_at ? new Date(p.published_at) : new Date(p.created_at);
            return {
              id: p.id,
              category: p.blog_categories?.name || 'Nutrition',
              title: p.title,
              excerpt: p.excerpt || '',
              image: p.featured_image_url || 'https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&w=600',
              date: dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            };
          }));
        }

        if (testRes.data && testRes.data.length > 0) {
          setRecentTestimonials(testRes.data.map(t => ({
            quote: t.quote,
            name: t.client_name,
            tag: t.programme || 'Wellness Programme',
          })));
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    }
    fetchHomeData();
  }, []);

  return (
    <div className="overflow-x-hidden flex flex-col lg:block gap-6 lg:gap-0">
      <SEO
        title="Nutrition with Teagan | Naturopathic Nutritionist"
        description="Naturopathic nutritionist supporting women through evidence-based nutrition for hormone health, gut health, skin concerns, and metabolic wellness. Book your personalised consultation today."
        keywords="naturopathic nutritionist, hormone health, gut health, PCOS, PMS, acne, skin health, IBS, bloating, metabolic wellness, online consultation"
        schema={{
          "@context": "https://schema.org",
          "@type": "HealthAndBeautyBusiness",
          "name": "Nutrition with Teagan",
          "description": "Naturopathic nutritionist supporting women through evidence-based nutrition for hormone health, gut health, skin concerns, and metabolic wellness.",
          "url": "https://nutritionwithteagan.com",
          "logo": "https://nutritionwithteagan.com/logo.webp",
          "priceRange": "$$",
          "image": "https://nutritionwithteagan.com/girl image.webp",
          "serviceType": [
            "Naturopathic Nutrition",
            "Hormone Health",
            "Gut Health Assessment",
            "Metabolic Wellness"
          ],
          "areaServed": "Online"
        }}
      />
      {/* ─── HERO ─── */}
      <section className="relative min-h-[88vh] lg:min-h-0 flex items-center pt-28 pb-10 lg:pt-36 lg:pb-10 px-6 order-1 overflow-hidden bg-gradient-warm">
        {/* Decorative botanical blobs — soft organic shapes */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full pointer-events-none hidden md:block animate-float-soft" style={{ background: 'radial-gradient(circle, #9C8AB8 0%, transparent 70%)', transform: `translate(30%, ${offset * -0.04}px)`, opacity: 0.2 }} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none hidden md:block animate-drift-slow" style={{ background: 'radial-gradient(circle, #8A9C7A 0%, transparent 70%)', transform: `translate(-30%, ${offset * 0.05}px)`, opacity: 0.18 }} />
        <div className="absolute top-1/2 left-1/4 w-[150px] h-[150px] rounded-full pointer-events-none animate-float-slow hidden lg:block" style={{ background: '#D6C27A', opacity: 0.18 }} />
        {/* Floating leaf-inspired shapes */}
        <Leaf className="absolute top-[18%] right-[8%] text-sage/15 hidden lg:block animate-float-leaf" size={42} />
        <Sprout className="absolute bottom-[22%] left-[6%] text-sage/15 hidden lg:block animate-float-soft" size={38} />
        <Leaf className="absolute top-[40%] left-[2%] text-[#D6C27A]/30 hidden xl:block animate-float-leaf" size={26} />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 lg:mb-8 glass" style={{ border: '1.5px solid #8A9C7A' }}>
              <Leaf size={14} className="text-sage" />
              <span className="font-montserrat text-xs font-bold tracking-[0.15em] uppercase text-sage">
                Naturopathic Nutritionist
              </span>
            </div>

            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.12] text-text-heading mb-5 lg:mb-6">
              Restore Balance<br />
              <em className="text-sage not-italic">Through</em> Personalised<br />
              Naturopathic Nutrition
            </h1>

            <p className="font-montserrat text-base md:text-lg font-medium text-text-body leading-[1.8] mb-8 lg:mb-10 max-w-lg">
              Supporting women through evidence-based naturopathic nutrition for hormone health, gut health, skin concerns, and metabolic wellness.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 lg:mb-12">
              <Link to="/booking" className="btn-booking btn-pulse">
                Book Consultation
                <ArrowRight size={15} />
              </Link>
              <Link to="/services" className="btn-outline">
                Explore Services
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 pt-5 lg:pt-6" style={{ borderTop: '2px solid #8A9C7A' }}>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-mellow-dark fill-yellow-mellow-dark" />
                ))}
              </div>
              <p className="font-montserrat text-sm font-medium text-text-body">
                <span className="font-bold text-text-heading">200+ women</span> supported through their wellness journey
              </p>
            </div>
          </div>

          {/* Right Image ─ responsive image heights */}
          <div className="relative w-full mt-2 lg:mt-0 lg:w-auto">
            <div className="relative z-10 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden shadow-luxury">
              <img
                src="/girl image.webp"
                alt="Teagan — Naturopathic Nutritionist"
                className="w-full h-[240px] sm:h-[280px] lg:h-[600px] object-cover"
              />
            </div>

            {/* Floating badge — glassmorphism */}
            <div className="hidden lg:block absolute -bottom-6 -left-8 glass rounded-2xl p-5 shadow-card z-20 max-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={16} className="text-sage" />
                <span className="font-montserrat text-xs font-bold text-sage uppercase tracking-wider">Evidence-Based</span>
              </div>
              <p className="font-playfair text-sm font-medium text-text-heading">Personalised nutrition protocols</p>
            </div>

            {/* Floating badge 2 — glassmorphism */}
            <div className="hidden lg:block absolute -top-6 -right-4 glass-lilac rounded-2xl p-4 shadow-soft z-20">
              <p className="font-playfair text-sm font-medium text-text-heading mb-1">Online Consultations</p>
              <p className="font-montserrat text-xs font-medium text-text-body">Available globally</p>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-40 h-40 rounded-full pointer-events-none animate-float hidden xl:block" style={{ background: '#D6C27A', opacity: 0.2 }} />
          </div>
        </div>
      </section>

      {/* ─── SPECIALISATIONS ─── */}
      <section className="relative overflow-hidden py-16 lg:py-10 px-6 order-3 bg-gradient-sage-soft">
        <Leaf className="absolute top-8 left-[8%] text-sage/10 hidden lg:block animate-float-leaf" size={40} />
        <Sparkles className="absolute bottom-10 right-[10%] text-[#D6C27A]/40 hidden lg:block animate-float-soft" size={28} />
        <BotanicalDivider />
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="section-tag">Areas of Expertise</p>
              <h2 className="section-title mb-4">
                Specialised Support for<br />
                <em className="not-italic text-sage">Your Unique Body</em>
              </h2>
              <p className="section-subtitle max-w-2xl mx-auto">
                Every woman's body is different. Teagan's naturopathic approach addresses the root causes of your symptoms rather than masking them.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialisations.map((spec, i) => (
              <ScrollReveal key={spec.title} delay={i * 100}>
                <div className="group bg-white rounded-3xl p-8 shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-500 h-full flex flex-col" style={{ border: '1px solid rgba(122, 139, 112, 0.08)' }}>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-2xl transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${spec.color}30` }}
                  >
                    <span style={{ color: spec.color }}>{spec.icon}</span>
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-text-heading mb-3">{spec.title}</h3>
                  <p className="font-montserrat text-sm font-medium text-text-body leading-relaxed mb-6 flex-1">{spec.description}</p>
                  <ul className="space-y-2">
                    {spec.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: spec.color }} />
                        <span className="font-montserrat text-sm font-medium text-text-body">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/services"
                    className="mt-6 inline-flex items-center gap-1.5 font-montserrat text-xs font-bold tracking-wider uppercase text-sage hover:text-sage-dark transition-all duration-300"
                  >
                    Learn More <ArrowRight size={12} />
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT TEAGAN ─── */}
      <section className="relative overflow-hidden py-16 lg:py-10 px-6 order-4 bg-gradient-warm">
        <Flower2 className="absolute top-12 right-[5%] text-sage/10 hidden lg:block animate-float-soft" size={34} />
        <Sprout className="absolute bottom-16 left-[6%] text-[#D6C27A]/30 hidden lg:block animate-float-leaf" size={30} />
        <BotanicalDivider />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div className="relative">
              <div className="rounded-[2.5rem] overflow-hidden shadow-luxury">
                <img
                  src="/girl image.webp"
                  alt="Teagan in her natural environment"
                  className="w-full h-[320px] sm:h-[450px] lg:h-[520px] object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute top-8 -right-6 glass-lilac rounded-2xl p-5 shadow-soft max-w-[180px]">
                <p className="font-playfair text-2xl font-bold text-text-heading mb-1">6+ yrs</p>
                <p className="font-montserrat text-xs font-medium text-text-body">Clinical experience</p>
              </div>
              <div className="absolute -bottom-6 left-8 glass rounded-2xl p-5 shadow-luxury">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} className="text-yellow-mellow-accent" />
                  <p className="font-montserrat text-xs font-bold text-text-heading">Fully Qualified</p>
                </div>
                <p className="font-montserrat text-xs font-medium text-text-body">BHSc Nutritional Medicine</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div>
              <p className="section-tag">Meet Teagan</p>
              <h2 className="section-title mb-6">
                A Passion for Women's<br />
                <em className="not-italic text-sage-dark">Whole-Body Wellness</em>
              </h2>
              <p className="font-montserrat text-base font-medium text-text-body leading-[1.85] mb-5">
                Teagan is a qualified naturopathic nutritionist with a deep passion for helping women reclaim their health. With a Bachelor of Health Science in Nutritional Medicine, she combines evidence-based science with a holistic, personalised approach.
              </p>
              <p className="font-montserrat text-base font-medium text-text-body leading-[1.85] mb-8">
                Her philosophy centres on uncovering the root causes of symptoms — rather than masking them — to create lasting transformation from the inside out.
              </p>
              <ul className="space-y-3 mb-10">
                {[
                  'BHSc Nutritional Medicine',
                  'Certified Naturopathic Nutritionist',
                  'Member of the Association for Nutrition (AFN)',
                  'Specialised in Women\'s Health & Hormones',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-sage-dark flex-shrink-0" />
                    <span className="font-montserrat text-sm font-medium text-text-body">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/about" className="btn-primary">
                My Full Story <ArrowRight size={15} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── HOW WE WORK TOGETHER ─── */}
      <section className="relative overflow-hidden py-16 lg:py-10 px-6 order-5 bg-gradient-sage-soft">
        <Leaf className="absolute top-10 left-[5%] text-sage/10 hidden lg:block animate-float-soft" size={36} />
        <Flower2 className="absolute bottom-12 right-[7%] text-[#D6C27A]/30 hidden lg:block animate-float-leaf" size={30} />
        <BotanicalDivider />
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="section-tag">The Process</p>
              <h2 className="section-title mb-4">How We Work Together</h2>
              <p className="section-subtitle max-w-xl mx-auto">
                A simple, supportive journey from your first step to lasting transformation.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line */}
            <div className="absolute top-12 left-[12%] right-[12%] h-px hidden lg:block" style={{ background: 'rgba(122, 139, 112, 0.35)' }} />

            {steps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 100}>
                <div className="relative flex flex-col items-start">
                  <div className="relative z-10 w-24 h-24 rounded-full bg-white shadow-card flex flex-col items-center justify-center mb-6" style={{ border: '2px solid rgba(122, 139, 112, 0.35)' }}>
                    <span className="font-playfair text-2xl font-bold text-sage-dark">{step.number}</span>
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-text-heading mb-3">{step.title}</h3>
                  <p className="font-montserrat text-sm font-medium text-text-body leading-relaxed">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={400}>
            <div className="text-center mt-14">
              <Link to="/booking" className="btn-booking">
                Begin Your Journey <ArrowRight size={15} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── FEATURED PROGRAMS ─── */}
      <section className="relative overflow-hidden py-16 lg:pt-6 lg:pb-10 px-6 order-2 bg-gradient-cream-beige">
        <Sprout className="absolute top-10 right-[6%] text-sage/10 hidden lg:block animate-float-soft" size={36} />
        <Leaf className="absolute bottom-12 left-[4%] text-[#D6C27A]/30 hidden lg:block animate-float-leaf" size={28} />
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="section-tag">Wellness Programmes</p>
              <h2 className="section-title mb-4">
                Transformative Programmes<br />
                <em className="not-italic text-sage-dark">Designed for You</em>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Hormone Reset Programme',
                duration: '12 Weeks',
                price: 'From £350',
                description: 'A comprehensive hormonal healing protocol addressing PCOS, PMS, cycle irregularities, and more.',
                image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600',
                tag: 'Most Popular',
                tagColor: '#A999C2',
              },
              {
                title: 'Gut Healing Programme',
                duration: '8 Weeks',
                price: 'From £350',
                description: 'Restore your gut microbiome, eliminate bloating, and achieve lasting digestive wellness.',
                image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
                tag: 'Bestseller',
                tagColor: '#9FAF93',
              },
              {
                title: 'Skin Health Programme',
                duration: '10 Weeks',
                price: 'From £320',
                description: 'Address acne, eczema, and skin inflammation through an inside-out nutritional approach.',
                image: 'https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&cs=tinysrgb&w=600',
                tag: 'Transformative',
                tagColor: '#D8C26D',
              },
              {
                title: 'Metabolic Wellness Programme',
                duration: '10 Weeks',
                price: 'From £380',
                description: 'Balance blood sugar, support thyroid health, and restore your natural energy and vitality.',
                image: 'https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&w=600',
                tag: 'Revitalising',
                tagColor: '#D8C89B',
              },
            ].map((program, i) => (
              <ScrollReveal key={program.title} delay={i * 100}>
                <div className="group bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-500 hover:border-sage/30" style={{ border: '1px solid rgba(122, 139, 112, 0.08)' }}>
                  <div className="relative overflow-hidden h-52">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <span
                      className="absolute top-4 left-4 font-montserrat text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full text-text-heading"
                      style={{ background: program.tagColor }}
                    >
                      {program.tag}
                    </span>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-montserrat text-xs font-bold text-text-small uppercase tracking-wider">{program.duration}</span>
                      <span className="font-playfair text-lg font-bold text-sage-dark">{program.price}</span>
                    </div>
                    <h3 className="font-playfair text-2xl font-bold text-text-heading mb-3">{program.title}</h3>
                    <p className="font-montserrat text-sm font-medium text-text-body leading-relaxed mb-6">{program.description}</p>
                    <div className="flex gap-3">
                      <Link to="/programs" className="btn-outline text-xs px-5 py-3">
                        Learn More
                      </Link>
                      <Link to="/booking" className="btn-booking text-xs px-5 py-3">
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={300}>
            <div className="text-center mt-12">
              <Link to="/programs" className="btn-outline">
                View All Programmes <ArrowRight size={15} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="relative overflow-hidden py-16 lg:py-10 px-6 order-6 bg-gradient-warm">
        <Sparkles className="absolute top-12 right-[8%] text-sage/10 hidden lg:block animate-float-soft" size={30} />
        <Leaf className="absolute bottom-10 left-[9%] text-[#D6C27A]/30 hidden lg:block animate-float-leaf" size={32} />
        <BotanicalDivider />
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="section-tag">Client Stories</p>
              <h2 className="section-title mb-4">
                Real Women, Real<br />
                <em className="not-italic text-sage-dark">Transformations</em>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {recentTestimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 100}>
                <div className="bg-white rounded-3xl p-8 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-500 h-full flex flex-col" style={{ border: '1px solid rgba(122, 139, 112, 0.08)' }}>
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} className="text-yellow-mellow-dark fill-yellow-mellow-dark" />
                    ))}
                  </div>
                  <blockquote className="font-playfair text-lg font-medium text-text-heading leading-relaxed flex-1 mb-6 italic">
                    "{t.quote}"
                  </blockquote>
                  <div>
                    <p className="font-montserrat text-sm font-bold text-text-heading">{t.name}</p>
                    <p className="font-montserrat text-xs font-semibold text-sage-dark mt-1">{t.tag}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={300}>
            <div className="text-center mt-12">
              <Link to="/testimonials" className="btn-outline">
                Read More Stories <ArrowRight size={15} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── ONLINE CONSULTATIONS ─── */}
      <section className="relative overflow-hidden py-16 lg:py-10 px-6 order-7 bg-gradient-sage-soft">
        <Flower2 className="absolute top-10 left-[6%] text-sage/10 hidden lg:block animate-float-soft" size={32} />
        <Sprout className="absolute bottom-14 right-[5%] text-[#D6C27A]/30 hidden lg:block animate-float-leaf" size={34} />
        <BotanicalDivider />
        <div className="max-w-7xl mx-auto">
          <div className="rounded-[2.5rem] overflow-hidden" style={{ background: 'linear-gradient(135deg, #8A9B80 0%, #7A8B70 100%)' }}>
            <div className="grid lg:grid-cols-2 gap-0 items-center">
              <div className="p-12 lg:p-16">
                <p className="font-montserrat text-xs font-bold tracking-[0.2em] uppercase text-white mb-5">
                  Why Online Works
                </p>
                <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
                  Expert Wellness Support,<br />Wherever You Are
                </h2>
                <p className="font-montserrat text-sm font-medium text-white leading-relaxed mb-8">
                  Online consultations allow Teagan to support women across the UK and beyond — with the same personalised, in-depth care as in-person visits, delivered from the comfort of your home.
                </p>
                <ul className="space-y-4 mb-10">
                  {[
                    'Flexible scheduling around your life',
                    'Access from anywhere in the world',
                    'Secure, private telehealth platform',
                    'Same personalised care and protocols',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-white flex-shrink-0" />
                      <span className="font-montserrat text-sm font-medium text-white">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 bg-white text-text-heading font-montserrat text-xs font-bold tracking-[0.15em] uppercase px-8 py-4 rounded-full transition-all duration-300 hover:shadow-luxury hover:-translate-y-0.5"
                >
                  Book Online <ArrowRight size={15} />
                </Link>
              </div>
              <div className="hidden lg:block h-[480px] relative overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/4498605/pexels-photo-4498605.jpeg?auto=compress&cs=tinysrgb&w=700"
                  alt="Online consultation"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LATEST ARTICLES ─── */}
      <section className="relative overflow-hidden py-16 lg:py-10 px-6 order-8 bg-gradient-warm">
        <Leaf className="absolute top-12 right-[7%] text-sage/10 hidden lg:block animate-float-leaf" size={34} />
        <Sparkles className="absolute bottom-12 left-[8%] text-[#D6C27A]/40 hidden lg:block animate-float-soft" size={26} />
        <BotanicalDivider />
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
              <div>
                <p className="section-tag">From the Blog</p>
                <h2 className="section-title">
                  Wellness Wisdom &<br />
                  <em className="not-italic text-sage-dark">Nourishing Insights</em>
                </h2>
              </div>
              <Link to="/blog" className="btn-outline self-start">
                View All Articles
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {recentArticles.map((article, i) => (
              <ScrollReveal key={article.title} delay={i * 100}>
                <Link to={article.id ? `/blog/${article.id}` : "/blog"} className="group block bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-500" style={{ border: '1px solid rgba(122, 139, 112, 0.08)' }}>
                  <div className="overflow-hidden h-52">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-7">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-montserrat text-xs font-bold text-sage-dark uppercase tracking-wider px-3 py-1 rounded-full" style={{ background: 'rgba(122, 139, 112, 0.2)' }}>
                        {article.category}
                      </span>
                      <span className="font-montserrat text-xs font-medium text-text-small">{article.date}</span>
                    </div>
                    <h3 className="font-playfair text-lg font-bold text-text-heading mb-3 leading-snug group-hover:text-sage-dark transition-colors duration-300">
                      {article.title}
                    </h3>
                    <p className="font-montserrat text-sm font-medium text-text-body leading-relaxed">{article.excerpt}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LUXURY CTA ─── */}
      <section className="relative overflow-hidden py-16 lg:py-10 px-6 order-9 bg-gradient-sage-soft">
        <Sprout className="absolute top-12 left-[8%] text-sage/10 hidden lg:block animate-float-soft" size={36} />
        <Flower2 className="absolute bottom-12 right-[9%] text-[#D6C27A]/30 hidden lg:block animate-float-leaf" size={32} />
        <BotanicalDivider />
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, #9C8AB8 0%, transparent 70%)', opacity: 0.35 }} />

              <p className="section-tag relative z-10">Ready to Begin?</p>
              <h2 className="section-title mb-6 relative z-10">
                Your Healing Journey<br />
                <em className="not-italic text-sage-dark">Starts With One Step</em>
              </h2>
              <p className="section-subtitle mb-10 max-w-2xl mx-auto relative z-10">
                Book your initial consultation today and receive a personalised naturopathic nutrition plan designed specifically for your body, your symptoms, and your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <Link to="/booking" className="btn-booking">
                  Book Your Consultation <ArrowRight size={15} />
                </Link>
                <Link to="/contact" className="btn-outline">
                  Ask a Question
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
