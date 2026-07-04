import { useState, useEffect } from 'react';
import { Link, usePathname } from '../router';
import { ArrowLeft, Clock, Calendar, Loader2 } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

export default function BlogPost() {
  const pathname = usePathname();
  const id = pathname.split('/').filter(Boolean).pop() || '';

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchArticle() {
      if (!id) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*, blog_categories(name)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setArticle(data);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Article not found');
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-28 lg:pt-36 min-h-screen flex items-center justify-center" style={{ background: '#FAF8F3' }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-sage mx-auto mb-4" />
          <p className="font-montserrat text-sm text-text-body">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="pt-28 lg:pt-36 min-h-screen flex items-center justify-center px-6" style={{ background: '#FAF8F3' }}>
        <div className="max-w-lg w-full text-center">
          <h1 className="font-playfair text-2xl font-bold text-text-heading mb-3">Article Not Found</h1>
          <p className="font-montserrat text-sm text-text-body mb-6">
            The article you are looking for might have been removed or is temporarily unavailable.
          </p>
          <Link to="/blog" className="btn-primary">
            Back to Journal
          </Link>
        </div>
      </div>
    );
  }

  const wordCount = article.content?.split(/\s+/).length || 0;
  const readTime = Math.max(3, Math.ceil(wordCount / 200));
  const dateObj = article.published_at ? new Date(article.published_at) : new Date(article.created_at);
  const formattedDate = dateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="pt-28 lg:pt-36 overflow-x-hidden" style={{ background: '#FAF8F3' }}>
      <SEO
        title={`${article.title} | Nutrition with Teagan`}
        description={article.excerpt || article.meta_description || ''}
      />

      <article className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            {/* Back Button */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sage hover:text-sage-dark font-montserrat text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 mb-8 hover:-translate-x-1"
            >
              <ArrowLeft size={16} /> Back to Journal
            </Link>
          </ScrollReveal>

          <ScrollReveal>
            {/* Featured Image */}
            {article.featured_image_url && (
              <div className="rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-card mb-8 aspect-[16/10] md:h-[450px]">
                <img
                  src={article.featured_image_url}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </ScrollReveal>

          <ScrollReveal>
            {/* Category */}
            <span className="font-montserrat text-xs font-semibold text-sage uppercase tracking-wider px-3.5 py-1.5 bg-sage/10 rounded-full mb-5 inline-block">
              {article.blog_categories?.name || 'Nutrition'}
            </span>

            {/* Title */}
            <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-medium text-text-primary mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Meta Details */}
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap border-y border-sage/15 py-4 mb-8">
              {article.author_name && (
                <span className="font-montserrat text-xs text-text-light">
                  By <strong className="text-text-primary font-semibold">{article.author_name}</strong>
                </span>
              )}
              {article.author_name && <span className="w-1 h-1 rounded-full bg-sage/30" />}
              <span className="font-montserrat text-xs text-text-light flex items-center gap-1.5">
                <Calendar size={12} className="text-sage" /> {formattedDate}
              </span>
              <span className="w-1 h-1 rounded-full bg-sage/30" />
              <span className="font-montserrat text-xs text-text-light flex items-center gap-1.5">
                <Clock size={12} className="text-sage" /> {readTime} min read
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            {/* Content Body */}
            <div className="prose prose-sage max-w-none">
              <div
                className="font-montserrat text-text-secondary text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-wrap"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {article.content}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </article>

      {/* Newsletter CTA */}
      <section className="py-20 px-6 animate-fade-in" style={{ background: '#F4EFE6' }}>
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
                className="flex-1 px-5 py-3.5 rounded-full border border-sage/30 bg-white font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 transition shadow-sm"
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
