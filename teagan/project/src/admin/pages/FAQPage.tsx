import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  Circle,
  GripVertical,
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const defaultCategories = ['general', 'bookings', 'programmes', 'nutrition', 'payment'];

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedFaq, setSelectedFaq] = useState<FAQItem | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFAQs();
  }, []);

  async function fetchFAQs() {
    setLoading(true);
    const { data, error } = await supabase
      .from('faq_items')
      .select('*')
      .order('display_order', { ascending: true });
    if (!error) setFaqs((data as FAQItem[]) || []);
    setLoading(false);
  }

  function openCreateModal() {
    setSelectedFaq({
      id: '',
      question: '',
      answer: '',
      category: 'general',
      display_order: faqs.length,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setModalMode('create');
    setShowModal(true);
  }

  function openEditModal(faq: FAQItem) {
    setSelectedFaq(faq);
    setModalMode('edit');
    setShowModal(true);
  }

  async function handleSave() {
    if (!selectedFaq || !selectedFaq.question || !selectedFaq.answer) return;
    setSaving(true);

    try {
      const data = {
        question: selectedFaq.question,
        answer: selectedFaq.answer,
        category: selectedFaq.category,
        display_order: selectedFaq.display_order,
        is_active: selectedFaq.is_active,
        updated_at: new Date().toISOString(),
      };

      if (modalMode === 'create') {
        const { error } = await supabase.from('faq_items').insert(data);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('faq_items').update(data).eq('id', selectedFaq.id);
        if (error) throw error;
      }

      setShowModal(false);
      fetchFAQs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this FAQ?')) return;
    const { error } = await supabase.from('faq_items').delete().eq('id', id);
    if (!error) fetchFAQs();
  }

  async function toggleActive(faq: FAQItem) {
    const { error } = await supabase
      .from('faq_items')
      .update({ is_active: !faq.is_active, updated_at: new Date().toISOString() })
      .eq('id', faq.id);
    if (!error) fetchFAQs();
  }

  const filteredFaqs = categoryFilter === 'all' ? faqs : faqs.filter((f) => f.category === categoryFilter);

  const categories = [...new Set(faqs.map((f) => f.category))];

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
          <h1 className="font-playfair text-3xl font-medium text-text-primary">FAQ</h1>
          <p className="font-montserrat text-sm text-text-secondary mt-1">
            Manage frequently asked questions
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-sage text-white font-montserrat font-semibold text-sm px-5 py-3 rounded-xl hover:bg-sage-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Question
        </button>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-2xl p-4 shadow-card">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-4 py-2 rounded-xl font-montserrat text-sm transition-colors ${
              categoryFilter === 'all'
                ? 'bg-sage text-white'
                : 'bg-sage/10 text-text-secondary hover:bg-sage/20'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl font-montserrat text-sm capitalize transition-colors ${
                categoryFilter === cat
                  ? 'bg-sage text-white'
                  : 'bg-sage/10 text-text-secondary hover:bg-sage/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {filteredFaqs.length === 0 ? (
          <div className="py-12 text-center">
            <HelpCircle className="w-12 h-12 text-sage/20 mx-auto mb-4" />
            <p className="font-montserrat text-sm text-text-light">No FAQs found</p>
          </div>
        ) : (
          <div className="divide-y divide-sage/10">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className={`p-5 ${!faq.is_active ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-montserrat text-sm font-medium text-text-primary">
                        {faq.question}
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-sage/10 text-sage font-montserrat text-xs capitalize">
                        {faq.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-montserrat text-xs ${
                          faq.is_active
                            ? 'bg-sage/10 text-sage'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {faq.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    <p className="font-montserrat text-sm text-text-secondary leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(faq)}
                      className={`p-2 rounded-lg transition-colors ${
                        faq.is_active
                          ? 'bg-sage/10 text-sage hover:bg-sage/20'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title={faq.is_active ? 'Hide' : 'Show'}
                    >
                      {faq.is_active ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => openEditModal(faq)}
                      className="p-2 rounded-lg hover:bg-sage/10 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-text-secondary" />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-luxury">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-xl font-medium text-text-primary">
                {modalMode === 'create' ? 'Add Question' : 'Edit Question'}
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
                  Question
                </label>
                <input
                  type="text"
                  value={selectedFaq.question}
                  onChange={(e) => setSelectedFaq({ ...selectedFaq, question: e.target.value })}
                  placeholder="What is the question?"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm"
                />
              </div>

              <div>
                <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Answer
                </label>
                <textarea
                  value={selectedFaq.answer}
                  onChange={(e) => setSelectedFaq({ ...selectedFaq, answer: e.target.value })}
                  rows={4}
                  placeholder="The answer to the question..."
                  className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Category
                  </label>
                  <select
                    value={selectedFaq.category}
                    onChange={(e) => setSelectedFaq({ ...selectedFaq, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm capitalize"
                  >
                    {defaultCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={selectedFaq.display_order}
                    onChange={(e) =>
                      setSelectedFaq({ ...selectedFaq, display_order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={selectedFaq.is_active}
                  onChange={(e) => setSelectedFaq({ ...selectedFaq, is_active: e.target.checked })}
                  className="w-5 h-5 rounded border-sage/30 text-sage focus:ring-sage"
                />
                <label htmlFor="is_active" className="font-montserrat text-sm text-text-secondary">
                  Active (visible on website)
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
                disabled={saving || !selectedFaq.question || !selectedFaq.answer}
                className="px-5 py-2.5 rounded-xl bg-sage text-white font-montserrat text-sm font-semibold hover:bg-sage-dark disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {modalMode === 'create' ? 'Add Question' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
