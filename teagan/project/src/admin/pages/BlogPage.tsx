import { useEffect, useState } from 'react';
import { Link } from '../../router';
import { supabase } from '../../lib/supabase';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Calendar,
  X,
  Loader2,
  ChevronRight,
  Tag,
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category_id: string | null;
  featured_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  is_published: boolean;
  author_name: string;
  created_at: string;
  updated_at: string;
  blog_categories?: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [statusFilter]);

  async function fetchPosts() {
    setLoading(true);
    try {
      let query = supabase
        .from('blog_posts')
        .select('*, blog_categories(name)')
        .order('created_at', { ascending: false });

      if (statusFilter === 'published') {
        query = query.eq('is_published', true);
      } else if (statusFilter === 'draft') {
        query = query.eq('is_published', false);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPosts((data as BlogPost[]) || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    const { data } = await supabase.from('blog_categories').select('*').order('name');
    setCategories((data as Category[]) || []);
  }

  async function togglePublished(post: BlogPost) {
    const newStatus = !post.is_published;
    const updateData: Partial<BlogPost> = {
      is_published: newStatus,
      published_at: newStatus ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('blog_posts').update(updateData).eq('id', post.id);
    if (!error) {
      fetchPosts();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (!error) fetchPosts();
  }

  const filteredPosts = posts.filter((post) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchLower) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchLower))
    );
  });

  function formatDate(dateStr: string | null) {
    if (!dateStr) return 'Not published';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 60);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-medium text-text-primary">Blog</h1>
          <p className="font-montserrat text-sm text-text-secondary mt-1">
            Create and manage blog articles
          </p>
        </div>
        <Link
          to="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-sage text-white font-montserrat font-semibold text-sm px-5 py-3 rounded-xl hover:bg-sage-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-xl font-montserrat text-sm transition-colors ${
                statusFilter === 'all'
                  ? 'bg-sage text-white'
                  : 'bg-sage/10 text-text-secondary hover:bg-sage/20'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-4 py-2 rounded-xl font-montserrat text-sm transition-colors ${
                statusFilter === 'published'
                  ? 'bg-sage text-white'
                  : 'bg-sage/10 text-text-secondary hover:bg-sage/20'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-4 py-2 rounded-xl font-montserrat text-sm transition-colors ${
                statusFilter === 'draft'
                  ? 'bg-sage text-white'
                  : 'bg-sage/10 text-text-secondary hover:bg-sage/20'
              }`}
            >
              Drafts
            </button>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-sage" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="w-12 h-12 text-sage/20 mx-auto mb-4" />
            <p className="font-montserrat text-sm text-text-light">No articles found</p>
          </div>
        ) : (
          <div className="divide-y divide-sage/10">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-4 p-4 hover:bg-cream/50 transition-colors"
              >
                {/* Image */}
                <div className="w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-sage/10">
                  {post.featured_image_url ? (
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-sage/30" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-montserrat text-sm font-medium text-text-primary truncate">
                      {post.title}
                    </h3>
                    <span
                      className={`flex-shrink-0 px-2 py-0.5 rounded-full font-montserrat text-xs ${
                        post.is_published
                          ? 'bg-sage/10 text-sage'
                          : 'bg-yellow-mellow/10 text-yellow-mellow-dark'
                      }`}
                    >
                      {post.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-light">
                    {post.blog_categories && (
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {post.blog_categories.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.published_at || post.created_at)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublished(post)}
                    className={`p-2 rounded-lg transition-colors ${
                      post.is_published
                        ? 'bg-sage/10 text-sage hover:bg-sage/20'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                    title={post.is_published ? 'Unpublish' : 'Publish'}
                  >
                    {post.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <Link
                    to={`/admin/blog/edit/${post.id}`}
                    className="p-2 rounded-lg hover:bg-sage/10 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4 text-text-secondary" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="bg-white rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-text-primary">
            Categories
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sage/10 text-sage font-montserrat text-sm"
            >
              <Tag className="w-3 h-3" />
              {cat.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
