import { useState } from 'react';
import { Link } from '../router';
import { ArrowRight, ChevronDown } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const faqs = [
  {
    category: 'Consultations',
    questions: [
      {
        q: 'Do you offer online consultations?',
        a: 'Yes! All consultations are conducted online via a secure, private telehealth platform. This allows Teagan to support women across the UK and internationally, providing the same personalised, in-depth care you\'d receive in person — from the comfort of your own home.',
      },
      {
        q: 'What does an initial consultation involve?',
        a: 'Your initial consultation (60–75 minutes) is a thorough deep-dive into your health history, current symptoms, diet, lifestyle, sleep, stress, and health goals. Teagan will ask detailed questions to understand your body holistically. Following the consultation, you\'ll receive a personalised written nutrition plan, supplement recommendations, and lifestyle strategies.',
      },
      {
        q: 'What should I prepare before my consultation?',
        a: "Before your consultation, it's helpful to think about: your main health concerns and symptoms, your current diet and eating patterns, any medications or supplements you\'re taking, relevant medical history and test results, and your health goals. Teagan will send you a health questionnaire to complete prior to your appointment, which covers all of these areas.",
      },
      {
        q: 'How long until I see results?',
        a: 'Every body is different, and results depend on the complexity of your concerns and how consistently you follow your personalised plan. Many clients notice improvements in energy, digestion, or mood within 2–4 weeks. Hormonal and skin concerns typically show significant improvement at the 6–12 week mark. Teagan will set realistic, individualised expectations during your consultation.',
      },
    ],
  },
  {
    category: 'Testing & Investigations',
    questions: [
      {
        q: 'Do I need testing before seeing Teagan?',
        a: "You don't need to have any tests done before your consultation. Teagan can work with you based on your symptoms, health history, and dietary analysis alone. However, if you have recent blood tests, hormone panels, or other investigations, please bring these — they can provide valuable information. Teagan may also recommend specific functional tests after your consultation if they\'re clinically indicated.",
      },
      {
        q: 'What types of testing might Teagan recommend?',
        a: 'Depending on your concerns, Teagan may recommend tests such as comprehensive blood panels (hormones, thyroid, iron, vitamin D, B12), DUTCH hormone testing, gut microbiome analysis, food sensitivity testing, or comprehensive stool analysis. All tests are optional and always discussed with you first.',
      },
    ],
  },
  {
    category: 'Ongoing Support',
    questions: [
      {
        q: 'How often should I book follow-up consultations?',
        a: 'For most clients, a follow-up consultation every 4–6 weeks is recommended in the initial stages of your program. This allows Teagan to review your progress, answer questions, adjust your protocol as your body responds, and provide ongoing support. The frequency reduces as you stabilise and achieve your health goals.',
      },
      {
        q: 'What happens after my consultation?',
        a: "After your initial consultation, you'll receive your personalised written nutrition plan, supplement recommendations, and any relevant resources within 48–72 hours. You'll also have access to Teagan via the client portal for any quick questions between appointments. For programme clients, you'll have scheduled follow-up consultations included in your package.",
      },
      {
        q: 'Do you offer ongoing support between consultations?',
        a: 'Yes. Programme clients have access to between-session messaging support through the client portal. This allows you to ask quick questions, share updates, or get clarification on your protocol without waiting for your next appointment. Response times are typically within 24 business hours.',
      },
    ],
  },
  {
    category: 'Approach & Philosophy',
    questions: [
      {
        q: 'What is naturopathic nutrition?',
        a: "Naturopathic nutrition is an evidence-based, holistic approach to health that uses food, nutrients, and lifestyle medicine to support the body's natural healing processes. It differs from conventional dietetics by taking a whole-body approach — considering gut health, hormones, stress, sleep, and lifestyle alongside diet — and addressing root causes of symptoms rather than managing them in isolation.",
      },
      {
        q: "How does Teagan's approach differ from seeing a GP or dietitian?",
        a: 'Teagan\'s naturopathic approach is deeply personalised and holistic. Rather than treating symptoms in isolation, she investigates the underlying causes — whether hormonal imbalances, gut dysbiosis, nutrient deficiencies, or lifestyle factors. She takes a thorough, 60+ minute consultation (compared to a typical 15-minute GP visit) and creates a comprehensive, individualised protocol. Her approach complements conventional medical care — she never advises stopping medications without your GP\'s guidance.',
      },
      {
        q: 'Can I work with Teagan alongside my GP or specialist?',
        a: "Absolutely. Teagan works collaboratively with other healthcare practitioners and is happy to liaise with your GP or specialist if needed. She will never advise you to stop medications or discontinue treatment recommended by your medical team. Naturopathic nutrition is intended to complement, not replace, conventional medical care.",
      },
    ],
  },
];

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
          {faqs.map((section, i) => (
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
          ))}
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
