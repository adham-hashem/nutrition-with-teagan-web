import { useEffect, useState } from 'react';
import { usePathname } from '../../router';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft,
  Save,
  Loader2,
  Eye,
  Image as ImageIcon,
  Link as LinkIcon,
  Bold,
  Italic,
  List,
} from 'lucide-react';
import ImageUploader from '../components/ImageUploader';

interface Category {
  id: string;
  name: string;
}

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: string;
  featured_image_url: string;
  meta_title: string;
  meta_description: string;
  is_published: boolean;
}

export default function BlogEditorPage() {
  const pathname = usePathname();
  const isNew = pathname === '/admin/blog/new';
  const postId = isNew ? null : pathname.split('/').pop();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  const [form, setForm] = useState<FormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category_id: '',
    featured_image_url: '',
    meta_title: '',
    meta_description: '',
    is_published: false,
  });

  useEffect(() => {
    fetchCategories();
    if (postId) fetchPost();
  }, [postId]);

  async function fetchCategories() {
    const { data } = await supabase.from('blog_categories').select('*').order('name');
    setCategories((data as Category[]) || []);
  }

  async function fetchPost() {
    setLoading(true);
    const { data, error } = await supabase.from('blog_posts').select('*').eq('id', postId).single();
    if (data) {
      setForm({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || '',
        content: data.content,
        category_id: data.category_id || '',
        featured_image_url: data.featured_image_url || '',
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        is_published: data.is_published,
      });
    }
    setLoading(false);
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 80);
  }

  async function handleSave(publish: boolean = false) {
    if (!form.title || !form.slug || !form.content) {
      alert('Please fill in required fields: title, slug, and content');
      return;
    }

    setSaving(true);
    try {
      const data = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || null,
        content: form.content,
        category_id: form.category_id || null,
        featured_image_url: form.featured_image_url || null,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
        is_published: publish,
        published_at: publish ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      if (isNew) {
        const { error } = await supabase.from('blog_posts').insert(data);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').update(data).eq('id', postId);
        if (error) throw error;
      }

      window.history.back();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-sage" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-lg hover:bg-sage/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <h1 className="font-playfair text-2xl font-medium text-text-primary">
            {isNew ? 'New Article' : 'Edit Article'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreview(!preview)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-montserrat text-sm transition-colors ${
              preview ? 'bg-sage text-white' : 'bg-sage/10 text-text-secondary hover:bg-sage/20'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sage/10 text-sage font-montserrat text-sm hover:bg-sage/20 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-sage text-white font-montserrat text-sm font-semibold hover:bg-sage-dark disabled:opacity-50 transition-colors"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Publish
          </button>
        </div>
      </div>

      {preview ? (
        <div className="bg-white rounded-2xl p-8 shadow-card">
          {form.featured_image_url && (
            <img
              src={form.featured_image_url}
              alt={form.title}
              className="w-full h-64 object-cover rounded-xl mb-6"
            />
          )}
          <h1 className="font-playfair text-4xl font-medium text-text-primary mb-4">{form.title}</h1>
          {form.excerpt && (
            <p className="font-montserrat text-lg text-text-secondary mb-6">{form.excerpt}</p>
          )}
          <div className="prose prose-sage max-w-none">
            <div
              className="font-montserrat text-text-secondary leading-relaxed"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {form.content}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => {
                  setForm({ ...form, title: e.target.value });
                  if (!form.slug) {
                    setForm((prev) => ({ ...prev, title: e.target.value, slug: generateSlug(e.target.value) }));
                  }
                }}
                placeholder="Article title..."
                className="w-full px-4 py-3 rounded-xl border border-sage/20 font-playfair text-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-sage/30"
              />
            </div>

            {/* Slug */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                Slug (URL)
              </label>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-text-light flex-shrink-0" />
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="article-url-slug"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                Excerpt
              </label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={2}
                placeholder="Brief summary for previews..."
                className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sage/30"
              />
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                Content
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={16}
                placeholder="Write your article content here..."
                className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sage/30"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                Category
              </label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                Featured Image
              </label>
              <ImageUploader
                value={form.featured_image_url}
                onChange={(url) => setForm({ ...form, featured_image_url: url })}
                folder="nutrition-teagan/blog"
                aspectRatio="landscape"
              />
            </div>

            {/* SEO */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <h3 className="font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">
                SEO Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-montserrat text-xs text-text-light mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={form.meta_title}
                    onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                    placeholder="Custom meta title..."
                    className="w-full px-4 py-2 rounded-xl border border-sage/20 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-xs text-text-light mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={form.meta_description}
                    onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                    rows={3}
                    placeholder="Description for search engines..."
                    className="w-full px-4 py-2 rounded-xl border border-sage/20 font-montserrat text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sage/30"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
