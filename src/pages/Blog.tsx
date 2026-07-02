import { useState, useEffect } from 'react';
import { Search, ArrowRight, Loader2 } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { supabase } from '../lib/supabase';

interface Article {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
}

export default function Blog() {
  const [categories, setCategories] = useState<string[]>(['All']);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchBlogData() {
      try {
        setLoading(true);
        // Fetch categories
        const { data: catData, error: catError } = await supabase
          .from('blog_categories')
          .select('name');
        
        if (catError) throw catError;
        if (catData) {
          setCategories(['All', ...catData.map((c) => c.name)]);
        }

        // Fetch published blog posts
        const { data: postsData, error: postsError } = await supabase
          .from('blog_posts')
          .select('*, blog_categories(name)')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        if (postsError) throw postsError;

        if (postsData) {
          const mappedArticles: Article[] = postsData.map((row) => {
            const wordCount = row.content?.split(/\s+/).length || 0;
            const readTimeMinutes = Math.max(3, Math.ceil(wordCount / 200));
            const dateObj = row.published_at ? new Date(row.published_at) : new Date(row.created_at);
            const formattedDate = dateObj.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            return {
              id: row.id,
              category: row.blog_categories?.name || 'Uncategorised',
              title: row.title,
              excerpt: row.excerpt || '',
              image: row.featured_image_url || 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600',
              date: formattedDate,
              readTime: `${readTimeMinutes} min read`,
            };
          });
          setArticles(mappedArticles);
        }
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogData();
  }, []);

  const filtered = articles.filter((a) => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory;
    const matchSearch =
      searchQuery === '' ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = activeCategory === 'All' && searchQuery === '' && filtered.length > 0 ? filtered[0] : null;
  const rest = featured ? filtered.slice(1) : filtered;

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center" style={{ background: '#FAF8F3' }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-sage mx-auto mb-4" />
          <p className="font-montserrat text-sm text-text-body">Loading articles...</p>
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
              <div className="group block bg-white rounded-[2.5rem] overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500">
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
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Article Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-playfair text-2xl text-text-secondary mb-3">No articles found</p>
              <p className="font-montserrat text-sm text-text-light">Try a different search term or category</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((article, i) => (
                <ScrollReveal key={article.id} delay={i * 80}>
                  <div className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-500 h-full">
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
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
