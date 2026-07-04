import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  MessageSquareQuote,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  Circle,
  Star,
  User,
} from 'lucide-react';

interface Testimonial {
  id: string;
  client_name: string;
  client_location: string | null;
  programme: string | null;
  image_url: string | null;
  rating: number;
  quote: string;
  is_approved: boolean;
  display_order: number;
  created_at: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    setLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true });
    if (!error) setTestimonials((data as Testimonial[]) || []);
    setLoading(false);
  }

  function openCreateModal() {
    setSelectedTestimonial({
      id: '',
      client_name: '',
      client_location: '',
      programme: '',
      image_url: '',
      rating: 5,
      quote: '',
      is_approved: true,
      display_order: testimonials.length,
      created_at: new Date().toISOString(),
    });
    setModalMode('create');
    setShowModal(true);
  }

  function openEditModal(testimonial: Testimonial) {
    setSelectedTestimonial(testimonial);
    setModalMode('edit');
    setShowModal(true);
  }

  async function handleSave() {
    if (!selectedTestimonial || !selectedTestimonial.client_name || !selectedTestimonial.quote) return;
    setSaving(true);

    try {
      const data = {
        client_name: selectedTestimonial.client_name,
        client_location: selectedTestimonial.client_location || null,
        programme: selectedTestimonial.programme || null,
        image_url: selectedTestimonial.image_url || null,
        rating: selectedTestimonial.rating,
        quote: selectedTestimonial.quote,
        is_approved: selectedTestimonial.is_approved,
        display_order: selectedTestimonial.display_order,
      };

      if (modalMode === 'create') {
        const { error } = await supabase.from('testimonials').insert(data);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('testimonials')
          .update(data)
          .eq('id', selectedTestimonial.id);
        if (error) throw error;
      }

      setShowModal(false);
      fetchTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this testimonial?')) return;
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (!error) fetchTestimonials();
  }

  async function toggleApproved(testimonial: Testimonial) {
    const { error } = await supabase
      .from('testimonials')
      .update({ is_approved: !testimonial.is_approved })
      .eq('id', testimonial.id);
    if (!error) fetchTestimonials();
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-medium text-text-primary">Testimonials</h1>
          <p className="font-montserrat text-sm text-text-secondary mt-1">
            Manage client testimonials displayed on your website
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-sage text-white font-montserrat font-semibold text-sm px-5 py-3 rounded-xl hover:bg-sage-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {/* Testimonials Grid */}
      {testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl py-12 text-center shadow-card">
          <MessageSquareQuote className="w-12 h-12 text-sage/20 mx-auto mb-4" />
          <p className="font-montserrat text-sm text-text-light">No testimonials yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-2xl p-5 shadow-card flex flex-col ${
                !testimonial.is_approved ? 'opacity-60' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {testimonial.image_url ? (
                    <img
                      src={testimonial.image_url}
                      alt={testimonial.client_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-sage/15 flex items-center justify-center">
                      <User className="w-6 h-6 text-sage" />
                    </div>
                  )}
                  <div>
                    <p className="font-montserrat text-sm font-medium text-text-primary">
                      {testimonial.client_name}
                    </p>
                    {testimonial.client_location && (
                      <p className="font-montserrat text-xs text-text-light">
                        {testimonial.client_location}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleApproved(testimonial)}
                  className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                    testimonial.is_approved
                      ? 'bg-sage/10 text-sage hover:bg-sage/20'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                  title={testimonial.is_approved ? 'Unapprove' : 'Approve'}
                >
                  {testimonial.is_approved ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? 'text-yellow-mellow fill-yellow-mellow'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
                {testimonial.programme && (
                  <span className="ml-2 px-2 py-0.5 rounded bg-sage/10 text-sage font-montserrat text-xs">
                    {testimonial.programme}
                  </span>
                )}
              </div>

              {/* Quote */}
              <blockquote className="font-playfair text-sm text-text-secondary italic leading-relaxed flex-1 mb-4">
                "{testimonial.quote}"
              </blockquote>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-sage/10">
                <button
                  onClick={() => openEditModal(testimonial)}
                  className="p-2 rounded-lg hover:bg-sage/10 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4 text-text-secondary" />
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
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

      {/* Modal */}
      {showModal && selectedTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-luxury">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-xl font-medium text-text-primary">
                {modalMode === 'create' ? 'Add Testimonial' : 'Edit Testimonial'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-sage/10 transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  value={selectedTestimonial.client_name}
                  onChange={(e) =>
                    setSelectedTestimonial({ ...selectedTestimonial, client_name: e.target.value })
                  }
                  placeholder="Sarah M."
                  className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={selectedTestimonial.client_location || ''}
                    onChange={(e) =>
                      setSelectedTestimonial({
                        ...selectedTestimonial,
                        client_location: e.target.value || null,
                      })
                    }
                    placeholder="London"
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm"
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Programme
                  </label>
                  <input
                    type="text"
                    value={selectedTestimonial.programme || ''}
                    onChange={(e) =>
                      setSelectedTestimonial({
                        ...selectedTestimonial,
                        programme: e.target.value || null,
                      })
                    }
                    placeholder="Hormone Reset Programme"
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setSelectedTestimonial({ ...selectedTestimonial, rating })}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          rating <= selectedTestimonial.rating
                            ? 'text-yellow-mellow fill-yellow-mellow'
                            : 'text-gray-200 hover:text-yellow-mellow/50'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Quote
                </label>
                <textarea
                  value={selectedTestimonial.quote}
                  onChange={(e) =>
                    setSelectedTestimonial({ ...selectedTestimonial, quote: e.target.value })
                  }
                  rows={4}
                  placeholder="What the client said..."
                  className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm resize-none"
                />
              </div>

              <div>
                <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={selectedTestimonial.display_order}
                  onChange={(e) =>
                    setSelectedTestimonial({
                      ...selectedTestimonial,
                      display_order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_approved"
                  checked={selectedTestimonial.is_approved}
                  onChange={(e) =>
                    setSelectedTestimonial({ ...selectedTestimonial, is_approved: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-sage/30 text-sage focus:ring-sage"
                />
                <label htmlFor="is_approved" className="font-montserrat text-sm text-text-secondary">
                  Approved (visible on website)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-sage/10">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl font-montserrat text-sm text-text-secondary hover:bg-sage/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !selectedTestimonial.client_name || !selectedTestimonial.quote}
                className="px-5 py-2.5 rounded-xl bg-sage text-white font-montserrat text-sm font-semibold hover:bg-sage-dark disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {modalMode === 'create' ? 'Add Testimonial' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
