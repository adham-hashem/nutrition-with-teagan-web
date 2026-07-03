import { useState } from 'react';
import { Link } from '../router';
import { Search, ArrowRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const categories = ['All', 'Hormones', 'Gut Health', 'Nutrition', 'Skin Health', "Women's Wellness", 'Lifestyle Tips'];

const articles = [
  {
    id: 1,
    category: 'Hormones',
    title: 'Understanding Your Cycle: A Nutritional Guide to Each Phase',
    excerpt: 'Learn how to nourish your body through each phase of your menstrual cycle for optimal hormonal balance, energy, and mood.',
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: 'December 15, 2024',
    readTime: '7 min read',
    featured: true,
  },
  {
    id: 2,
    category: 'Gut Health',
    title: 'The Gut-Skin Connection: Why Your Skin Starts in the Gut',
    excerpt: 'Discover the science behind the gut-skin axis and how healing your microbiome can clear your complexion naturally.',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: 'November 28, 2024',
    readTime: '5 min read',
    featured: false,
  },
  {
    id: 3,
    category: 'Nutrition',
    title: '5 Anti-Inflammatory Foods Every Woman Should Eat Weekly',
    excerpt: 'These powerful whole foods reduce systemic inflammation and support hormones, skin, and sustained energy levels.',
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: 'November 12, 2024',
    readTime: '4 min read',
    featured: false,
  },
  {
    id: 4,
    category: 'Hormones',
    title: 'PCOS & Nutrition: What the Evidence Actually Says',
    excerpt: 'Cutting through the noise to share the evidence-based nutritional strategies that truly help with PCOS management.',
    image: 'https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: 'October 30, 2024',
    readTime: '9 min read',
    featured: false,
  },
  {
    id: 5,
    category: 'Skin Health',
    title: 'Hormonal Acne: The Inside-Out Approach That Actually Works',
    excerpt: 'Why topical treatments alone often fail for hormonal acne — and the nutritional strategies that address the root cause.',
    image: 'https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: 'October 14, 2024',
    readTime: '6 min read',
    featured: false,
  },
  {
    id: 6,
    category: "Women's Wellness",
    title: 'Seed Cycling for Hormone Balance: Does It Actually Work?',
    excerpt: 'Exploring the science (and art) behind seed cycling for hormonal support — what the research says and how to try it.',
    image: 'https://images.pexels.com/photos/4057064/pexels-photo-4057064.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: 'September 22, 2024',
    readTime: '5 min read',
    featured: false,
  },
  {
    id: 7,
    category: 'Lifestyle Tips',
    title: 'Stress & Hormones: How Cortisol Impacts Your Entire Body',
    excerpt: 'Understanding the profound impact chronic stress has on your hormones, gut, skin, and overall wellbeing — and what to do.',
    image: 'https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: 'September 8, 2024',
    readTime: '8 min read',
    featured: false,
  },
  {
    id: 8,
    category: 'Gut Health',
    title: 'How to Build a Gut-Friendly Plate (Without the Overwhelm)',
    excerpt: 'A simple, practical guide to building meals that support a thriving gut microbiome — no complicated diets required.',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    date: 'August 25, 2024',
    readTime: '5 min read',
    featured: false,
  },
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = articles.filter((a) => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory;
    const matchSearch =
      searchQuery === '' ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered.find((a) => a.featured && activeCategory === 'All' && searchQuery === '');
  const rest = featured ? filtered.filter((a) => !a.featured) : filtered;

  return (
    <div className="pt-24 overflow-x-hidden" style={{ background: '#FAF8F3' }}>
      {/* Header */}
      <section className="py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-15" style={{ background: 'radial-gradient(ellipse, #9FAF93 0%, transparent 70%)' }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="section-tag">The Journal</p>
          <h1 className="section-title mb-5">
            Wellness Wisdom &<br />
            <em className="not-italic text-sage">Nourishing Insights</em>
          </h1>
          <p className="section-subtitle mb-10">
            Evidence-based articles on hormones, gut health, skin, and women's wellness to support your healing journey.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-4 rounded-full border border-sage/25 bg-white font-montserrat text-sm text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-sage/30 transition shadow-card"
            />
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-montserrat text-xs font-semibold tracking-wider uppercase px-5 py-2.5 rounded-full transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-sage text-white shadow-soft'
                    : 'bg-white border border-sage/20 text-text-secondary hover:border-sage hover:text-sage'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <section className="px-6 mb-16">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <Link to="#" className="group block bg-white rounded-[2.5rem] overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative overflow-hidden h-64 lg:h-auto">
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-5 left-5">
                      <span className="bg-sage text-white font-montserrat text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-full">
                        Featured Article
                      </span>
                    </div>
                  </div>
                  <div className="p-10 lg:p-14 flex flex-col justify-center">
                    <span className="font-montserrat text-xs font-semibold text-sage uppercase tracking-wider px-3 py-1.5 bg-sage/10 rounded-full self-start mb-5">
                      {featured.category}
                    </span>
                    <h2 className="font-playfair text-3xl font-medium text-text-primary mb-4 leading-snug group-hover:text-sage transition-colors duration-300">
                      {featured.title}
                    </h2>
                    <p className="font-montserrat text-sm text-text-secondary leading-relaxed mb-7">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="font-montserrat text-xs text-text-light">{featured.date}</span>
                        <span className="w-1 h-1 rounded-full bg-text-light" />
                        <span className="font-montserrat text-xs text-text-light">{featured.readTime}</span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 font-montserrat text-xs font-semibold uppercase tracking-wider text-sage group-hover:gap-3 transition-all duration-300">
                        Read More <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Article Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {rest.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-playfair text-2xl text-text-secondary mb-3">No articles found</p>
              <p className="font-montserrat text-sm text-text-light">Try a different search term or category</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((article, i) => (
                <ScrollReveal key={article.id} delay={i * 80}>
                  <Link to="#" className="group block bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-500 h-full">
                    <div className="overflow-hidden h-52">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-7 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-montserrat text-xs font-semibold text-sage uppercase tracking-wider px-3 py-1.5 bg-sage/10 rounded-full">
                          {article.category}
                        </span>
                        <span className="font-montserrat text-xs text-text-light">{article.readTime}</span>
                      </div>
                      <h3 className="font-playfair text-lg font-medium text-text-primary mb-3 leading-snug group-hover:text-sage transition-colors duration-300 flex-1">
                        {article.title}
                      </h3>
                      <p className="font-montserrat text-sm text-text-secondary leading-relaxed mb-5">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-sage/10">
                        <span className="font-montserrat text-xs text-text-light">{article.date}</span>
                        <span className="inline-flex items-center gap-1 font-montserrat text-xs font-semibold uppercase tracking-wider text-sage group-hover:gap-2 transition-all duration-300">
                          Read <ArrowRight size={11} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-6" style={{ background: '#F4EFE6' }}>
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal>
            <p className="section-tag">Never Miss an Article</p>
            <h2 className="section-title mb-5">
              Wellness Insights<br />
              <em className="not-italic text-sage">Straight to Your Inbox</em>
            </h2>
            <p className="section-subtitle mb-8">
              Subscribe to receive nourishing articles, seasonal wellness tips, and exclusive content from Teagan.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-5 py-3.5 rounded-full border border-sage/30 bg-white font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 transition"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
