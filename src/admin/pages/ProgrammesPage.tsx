import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  GripVertical,
  Image as ImageIcon,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import ImageUploader from '../components/ImageUploader';

interface Programme {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  duration_weeks: number;
  duration_minutes: number;
  price_pence: number;
  tag: string | null;
  tag_color: string;
  image_url: string | null;
  suitable_for: string[];
  includes: string[];
  outcomes: string[];
  is_active: boolean;
  is_featured: boolean;
  consultation_type: 'online' | 'in_person' | 'hybrid';
  display_order: number;
  created_at: string;
  updated_at: string;
}

const formatGBP = (pence: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  }).format(pence / 100);
};

const defaultProgramme: Omit<Programme, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  subtitle: '',
  description: '',
  duration_weeks: 8,
  duration_minutes: 60,
  price_pence: 35000,
  tag: '',
  tag_color: '#7F9473',
  image_url: '',
  suitable_for: [],
  includes: [],
  outcomes: [],
  is_active: true,
  is_featured: false,
  consultation_type: 'online',
  display_order: 0,
};

export default function ProgrammesPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
  const [saving, setSaving] = useState(false);
  const [arrayInput, setArrayInput] = useState({
    suitable_for: '',
    includes: '',
    outcomes: '',
  });

  useEffect(() => {
    fetchProgrammes();
  }, []);

  async function fetchProgrammes() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('programmes')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProgrammes((data as Programme[]) || []);
    } catch (error) {
      console.error('Error fetching programmes:', error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setSelectedProgramme({
      ...defaultProgramme,
      id: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      display_order: programmes.length,
    });
    setArrayInput({ suitable_for: '', includes: '', outcomes: '' });
    setModalMode('create');
    setShowModal(true);
  }

  function openEditModal(programme: Programme) {
    setSelectedProgramme(programme);
    setArrayInput({
      suitable_for: programme.suitable_for.join(', '),
      includes: programme.includes.join('\n'),
      outcomes: programme.outcomes.join('\n'),
    });
    setModalMode('edit');
    setShowModal(true);
  }

  async function handleSave() {
    if (!selectedProgramme) return;
    setSaving(true);

    try {
      const data = {
        title: selectedProgramme.title,
        subtitle: selectedProgramme.subtitle,
        description: selectedProgramme.description,
        duration_weeks: selectedProgramme.duration_weeks,
        duration_minutes: selectedProgramme.duration_minutes,
        price_pence: selectedProgramme.price_pence,
        tag: selectedProgramme.tag,
        tag_color: selectedProgramme.tag_color,
        image_url: selectedProgramme.image_url,
        suitable_for: arrayInput.suitable_for
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        includes: arrayInput.includes
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        outcomes: arrayInput.outcomes
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        is_active: selectedProgramme.is_active,
        is_featured: selectedProgramme.is_featured,
        consultation_type: selectedProgramme.consultation_type,
        display_order: selectedProgramme.display_order,
        updated_at: new Date().toISOString(),
      };

      if (modalMode === 'create') {
        const { error } = await supabase.from('programmes').insert(data);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('programmes')
          .update(data)
          .eq('id', selectedProgramme.id);
        if (error) throw error;
      }

      setShowModal(false);
      fetchProgrammes();
    } catch (error) {
      console.error('Error saving programme:', error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this programme?')) return;

    const { error } = await supabase.from('programmes').delete().eq('id', id);
    if (!error) {
      fetchProgrammes();
    }
  }

  async function toggleActive(programme: Programme) {
    const { error } = await supabase
      .from('programmes')
      .update({ is_active: !programme.is_active, updated_at: new Date().toISOString() })
      .eq('id', programme.id);
    if (!error) {
      fetchProgrammes();
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-text-heading">Health Programmes</h1>
          <p className="font-montserrat text-sm text-text-body mt-1">
            Manage wellness programmes for Step 2 of the booking flow. Programmes are optional add-ons that enhance consultations.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary text-sm px-5 py-2.5"
        >
          <Plus className="w-4 h-4" />
          New Programme
        </button>
      </div>

      {/* Programmes Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-sage" />
        </div>
      ) : programmes.length === 0 ? (
        <div className="bg-white rounded-2xl py-12 text-center shadow-card">
          <Package className="w-12 h-12 text-sage/20 mx-auto mb-4" />
          <p className="font-montserrat text-sm text-text-light">No programmes yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {programmes.map((programme) => (
            <div
              key={programme.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-card transition-all ${
                !programme.is_active ? 'opacity-60' : ''
              }`}
            >
              {/* Image */}
              {programme.image_url ? (
                <div className="h-40 relative">
                  <img
                    src={programme.image_url}
                    alt={programme.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {programme.tag && (
                    <span
                      className="absolute top-4 left-4 inline-block px-3 py-1 rounded-full font-montserrat text-xs font-semibold text-text-primary"
                      style={{ background: programme.tag_color }}
                    >
                      {programme.tag}
                    </span>
                  )}
                </div>
              ) : (
                <div className="h-32 bg-sage/10 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-sage/30" />
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-playfair text-xl font-medium text-text-primary">
                      {programme.title}
                    </h3>
                    {programme.subtitle && (
                      <p className="font-montserrat text-xs text-text-light mt-0.5">
                        {programme.subtitle}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleActive(programme)}
                    className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                      programme.is_active
                        ? 'bg-sage/10 text-sage hover:bg-sage/20'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                    title={programme.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {programme.is_active ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <span className="font-montserrat text-sm text-text-secondary">
                    {programme.duration_weeks} weeks
                  </span>
                  <span className="font-playfair text-lg font-medium text-sage">
                    {formatGBP(programme.price_pence)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {programme.suitable_for.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-1 rounded-lg bg-sage/10 font-montserrat text-xs text-sage"
                    >
                      {s}
                    </span>
                  ))}
                  {programme.suitable_for.length > 3 && (
                    <span className="px-2 py-1 font-montserrat text-xs text-text-light">
                      +{programme.suitable_for.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-sage/10">
                  <button
                    onClick={() => openEditModal(programme)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-sage/10 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-text-secondary" />
                    <span className="font-montserrat text-sm text-text-secondary">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(programme.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                    <span className="font-montserrat text-sm text-red-400">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedProgramme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-luxury">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-xl font-medium text-text-primary">
                {modalMode === 'create' ? 'New Programme' : 'Edit Programme'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-sage/10 transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={selectedProgramme.title}
                    onChange={(e) =>
                      setSelectedProgramme({ ...selectedProgramme, title: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={selectedProgramme.subtitle || ''}
                    onChange={(e) =>
                      setSelectedProgramme({ ...selectedProgramme, subtitle: e.target.value || null })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Description
                </label>
                <textarea
                  value={selectedProgramme.description || ''}
                  onChange={(e) =>
                    setSelectedProgramme({
                      ...selectedProgramme,
                      description: e.target.value || null,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Duration (weeks)
                  </label>
                  <input
                    type="number"
                    value={selectedProgramme.duration_weeks}
                    onChange={(e) =>
                      setSelectedProgramme({
                        ...selectedProgramme,
                        duration_weeks: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-sage/30 font-montserrat text-sm focus:border-sage-dark focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Price (£)
                  </label>
                  <input
                    type="number"
                    value={selectedProgramme.price_pence / 100}
                    onChange={(e) =>
                      setSelectedProgramme({
                        ...selectedProgramme,
                        price_pence: Math.round((parseFloat(e.target.value) || 0) * 100),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-sage/30 font-montserrat text-sm focus:border-sage-dark focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Consultation Type
                  </label>
                  <select
                    value={selectedProgramme.consultation_type}
                    onChange={(e) =>
                      setSelectedProgramme({
                        ...selectedProgramme,
                        consultation_type: e.target.value as 'online' | 'in_person' | 'hybrid',
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-sage/30 font-montserrat text-sm focus:border-sage-dark focus:outline-none"
                  >
                    <option value="online">Online</option>
                    <option value="in_person">In-Person</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedProgramme.is_active}
                    onChange={(e) =>
                      setSelectedProgramme({ ...selectedProgramme, is_active: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-2 border-sage/30 text-sage-dark focus:ring-sage-dark"
                  />
                  <span className="font-montserrat text-sm text-text-body">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedProgramme.is_featured}
                    onChange={(e) =>
                      setSelectedProgramme({ ...selectedProgramme, is_featured: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-2 border-sage/30 text-yellow-mellow-dark focus:ring-yellow-mellow-dark"
                  />
                  <span className="font-montserrat text-sm text-text-body">Featured</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Tag
                  </label>
                  <input
                    type="text"
                    value={selectedProgramme.tag || ''}
                    onChange={(e) =>
                      setSelectedProgramme({ ...selectedProgramme, tag: e.target.value || null })
                    }
                    placeholder="e.g. Most Popular"
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm"
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Tag Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={selectedProgramme.tag_color}
                      onChange={(e) =>
                        setSelectedProgramme({ ...selectedProgramme, tag_color: e.target.value })
                      }
                      className="w-10 h-10 rounded-lg border border-sage/20"
                    />
                    <input
                      type="text"
                      value={selectedProgramme.tag_color}
                      onChange={(e) =>
                        setSelectedProgramme({ ...selectedProgramme, tag_color: e.target.value })
                      }
                      className="flex-1 px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Programme Image
                </label>
                <ImageUploader
                  value={selectedProgramme.image_url || ''}
                  onChange={(url) =>
                    setSelectedProgramme({ ...selectedProgramme, image_url: url || null })
                  }
                  folder="nutrition-teagan/programmes"
                  aspectRatio="landscape"
                />
              </div>

              <div>
                <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Suitable For (comma separated)
                </label>
                <input
                  type="text"
                  value={arrayInput.suitable_for}
                  onChange={(e) => setArrayInput({ ...arrayInput, suitable_for: e.target.value })}
                  placeholder="PCOS, PMS, Irregular periods"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm"
                />
              </div>

              <div>
                <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  What's Included (one per line)
                </label>
                <textarea
                  value={arrayInput.includes}
                  onChange={(e) => setArrayInput({ ...arrayInput, includes: e.target.value })}
                  rows={4}
                  placeholder="Initial consultation&#10;Personalised nutrition plan&#10;Weekly check-ins"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm resize-none"
                />
              </div>

              <div>
                <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Expected Outcomes (one per line)
                </label>
                <textarea
                  value={arrayInput.outcomes}
                  onChange={(e) => setArrayInput({ ...arrayInput, outcomes: e.target.value })}
                  rows={4}
                  placeholder="Regulated cycle&#10;Reduced PMS&#10;Improved energy"
                  className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={selectedProgramme.is_active}
                  onChange={(e) =>
                    setSelectedProgramme({ ...selectedProgramme, is_active: e.target.checked })
                  }
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
                disabled={saving || !selectedProgramme.title}
                className="px-5 py-2.5 rounded-xl bg-sage text-white font-montserrat text-sm font-semibold hover:bg-sage-dark disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {modalMode === 'create' ? 'Create Programme' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
