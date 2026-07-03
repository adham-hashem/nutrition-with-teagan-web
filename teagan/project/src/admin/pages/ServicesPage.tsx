import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Stethoscope,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  Circle,
  Star,
} from 'lucide-react';
import ImageUploader from '../components/ImageUploader';

interface Service {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  duration_minutes: number;
  price_pence: number;
  tag: string | null;
  tag_color: string;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  consultation_type: 'online' | 'in_person' | 'hybrid';
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

const defaultService: Omit<Service, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  subtitle: '',
  description: '',
  duration_minutes: 60,
  price_pence: 10000,
  tag: '',
  tag_color: '#7F9473',
  image_url: '',
  is_active: true,
  is_featured: false,
  display_order: 0,
  consultation_type: 'online',
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices((data as Service[]) || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setSelectedService({
      ...defaultService,
      id: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      display_order: services.length,
    });
    setModalMode('create');
    setShowModal(true);
  }

  function openEditModal(service: Service) {
    setSelectedService(service);
    setModalMode('edit');
    setShowModal(true);
  }

  async function handleSave() {
    if (!selectedService || !selectedService.title) return;
    setSaving(true);

    try {
      const data = {
        title: selectedService.title,
        subtitle: selectedService.subtitle,
        description: selectedService.description,
        duration_minutes: selectedService.duration_minutes,
        price_pence: selectedService.price_pence,
        tag: selectedService.tag,
        tag_color: selectedService.tag_color,
        image_url: selectedService.image_url,
        is_active: selectedService.is_active,
        is_featured: selectedService.is_featured,
        display_order: selectedService.display_order,
        consultation_type: selectedService.consultation_type,
        updated_at: new Date().toISOString(),
      };

      if (modalMode === 'create') {
        const { error } = await supabase.from('services').insert(data);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('services')
          .update(data)
          .eq('id', selectedService.id);
        if (error) throw error;
      }

      setShowModal(false);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this service?')) return;

    const { error } = await supabase.from('services').delete().eq('id', id);
    if (!error) {
      fetchServices();
    }
  }

  async function toggleActive(service: Service) {
    const { error } = await supabase
      .from('services')
      .update({ is_active: !service.is_active, updated_at: new Date().toISOString() })
      .eq('id', service.id);
    if (!error) {
      fetchServices();
    }
  }

  async function toggleFeatured(service: Service) {
    const { error } = await supabase
      .from('services')
      .update({ is_featured: !service.is_featured, updated_at: new Date().toISOString() })
      .eq('id', service.id);
    if (!error) {
      fetchServices();
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-text-heading">Consultation Types</h1>
          <p className="font-montserrat text-sm text-text-body mt-1">
            Manage consultation options for Step 1 of the booking flow. These represent the different ways clients can work with Teagan.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary text-sm px-5 py-2.5"
        >
          <Plus size={16} />
          New Consultation
        </button>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-sage-dark" />
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-2xl py-12 text-center shadow-card">
          <Stethoscope className="w-12 h-12 text-sage mx-auto mb-4 opacity-30" />
          <p className="font-montserrat text-sm text-text-body">No consultation types yet</p>
          <button
            onClick={openCreateModal}
            className="mt-4 font-montserrat text-sm text-sage-dark font-medium hover:underline"
          >
            Create your first consultation type
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-card transition-all ${
                !service.is_active ? 'opacity-60' : ''
              }`}
            >
              {/* Image */}
              {service.image_url ? (
                <div className="h-40 relative">
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {service.tag && (
                    <span
                      className="absolute top-4 left-4 inline-block px-3 py-1 rounded-full font-montserrat text-xs font-bold text-text-heading"
                      style={{ background: service.tag_color }}
                    >
                      {service.tag}
                    </span>
                  )}
                  {service.is_featured && (
                    <Star className="absolute top-4 right-4 w-5 h-5 text-yellow-mellow-dark fill-yellow-mellow-dark" />
                  )}
                </div>
              ) : (
                <div className="h-32 bg-sage/10 flex items-center justify-center relative">
                  <Stethoscope className="w-8 h-8 text-sage opacity-30" />
                  {service.is_featured && (
                    <Star className="absolute top-4 right-4 w-5 h-5 text-yellow-mellow-dark fill-yellow-mellow-dark" />
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-playfair text-xl font-bold text-text-heading">
                      {service.title}
                    </h3>
                    {service.subtitle && (
                      <p className="font-montserrat text-xs text-text-small mt-0.5">
                        {service.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFeatured(service)}
                      className={`p-2 rounded-lg transition-colors ${
                        service.is_featured
                          ? 'bg-yellow-mellow/20 text-yellow-mellow-dark'
                          : 'bg-gray-100 text-gray-400 hover:bg-yellow-mellow/10'
                      }`}
                      title={service.is_featured ? 'Remove from featured' : 'Mark as featured'}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleActive(service)}
                      className={`p-2 rounded-lg transition-colors ${
                        service.is_active
                          ? 'bg-sage/10 text-sage-dark hover:bg-sage/20'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title={service.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {service.is_active ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <span className="font-montserrat text-sm text-text-body">
                    {service.duration_minutes} min
                  </span>
                  <span className="font-playfair text-lg font-bold text-sage-dark">
                    {formatGBP(service.price_pence)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-lg font-montserrat text-xs ${
                    service.consultation_type === 'online'
                      ? 'bg-lilac/10 text-lilac-dark'
                      : service.consultation_type === 'in_person'
                      ? 'bg-yellow-mellow/10 text-yellow-mellow-dark'
                      : 'bg-sage/10 text-sage-dark'
                  }`}>
                    {service.consultation_type === 'online' ? 'Online' :
                     service.consultation_type === 'in_person' ? 'In-Person' : 'Hybrid'}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-sage/10">
                  <button
                    onClick={() => openEditModal(service)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-sage/10 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-text-body" />
                    <span className="font-montserrat text-sm text-text-body">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                    <span className="font-montserrat text-sm text-red-500">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-luxury">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-xl font-bold text-text-heading">
                {modalMode === 'create' ? 'New Consultation Type' : 'Edit Consultation Type'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-sage/10 transition-colors"
              >
                <X className="w-5 h-5 text-text-body" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block font-montserrat text-xs font-bold uppercase tracking-wider text-text-body mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={selectedService.title}
                    onChange={(e) =>
                      setSelectedService({ ...selectedService, title: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-sage/30 font-montserrat text-sm focus:border-sage-dark focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-montserrat text-xs font-bold uppercase tracking-wider text-text-body mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={selectedService.subtitle || ''}
                    onChange={(e) =>
                      setSelectedService({ ...selectedService, subtitle: e.target.value || null })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-sage/30 font-montserrat text-sm focus:border-sage-dark focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-montserrat text-xs font-bold uppercase tracking-wider text-text-body mb-2">
                  Description
                </label>
                <textarea
                  value={selectedService.description || ''}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      description: e.target.value || null,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-sage/30 font-montserrat text-sm resize-none focus:border-sage-dark focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-montserrat text-xs font-bold uppercase tracking-wider text-text-body mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={selectedService.duration_minutes}
                    onChange={(e) =>
                      setSelectedService({ ...selectedService, duration_minutes: parseInt(e.target.value) || 60 })
                    }
                    min={15}
                    step={15}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-sage/30 font-montserrat text-sm focus:border-sage-dark focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-xs font-bold uppercase tracking-wider text-text-body mb-2">
                    Price (£)
                  </label>
                  <input
                    type="number"
                    value={selectedService.price_pence / 100}
                    onChange={(e) =>
                      setSelectedService({ ...selectedService, price_pence: Math.round((parseFloat(e.target.value) || 0) * 100) })
                    }
                    min={0}
                    step={1}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-sage/30 font-montserrat text-sm focus:border-sage-dark focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-xs font-bold uppercase tracking-wider text-text-body mb-2">
                    Consultation Type
                  </label>
                  <select
                    value={selectedService.consultation_type}
                    onChange={(e) =>
                      setSelectedService({
                        ...selectedService,
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

              <div>
                <label className="block font-montserrat text-xs font-bold uppercase tracking-wider text-text-body mb-2">
                  Service Image
                </label>
                <ImageUploader
                  value={selectedService.image_url || ''}
                  onChange={(url) =>
                    setSelectedService({ ...selectedService, image_url: url || null })
                  }
                  folder="nutrition-teagan/services"
                  aspectRatio="landscape"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-montserrat text-xs font-bold uppercase tracking-wider text-text-body mb-2">
                    Tag (optional)
                  </label>
                  <input
                    type="text"
                    value={selectedService.tag || ''}
                    onChange={(e) =>
                      setSelectedService({ ...selectedService, tag: e.target.value || null })
                    }
                    placeholder="e.g., Recommended, Popular"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-sage/30 font-montserrat text-sm focus:border-sage-dark focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-xs font-bold uppercase tracking-wider text-text-body mb-2">
                    Tag Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={selectedService.tag_color}
                      onChange={(e) =>
                        setSelectedService({ ...selectedService, tag_color: e.target.value })
                      }
                      className="w-10 h-10 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedService.tag_color}
                      onChange={(e) =>
                        setSelectedService({ ...selectedService, tag_color: e.target.value })
                      }
                      className="flex-1 px-4 py-2.5 rounded-xl border-2 border-sage/30 font-montserrat text-sm focus:border-sage-dark focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedService.is_active}
                    onChange={(e) =>
                      setSelectedService({ ...selectedService, is_active: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-2 border-sage/30 text-sage-dark focus:ring-sage-dark"
                  />
                  <span className="font-montserrat text-sm text-text-body">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedService.is_featured}
                    onChange={(e) =>
                      setSelectedService({ ...selectedService, is_featured: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-2 border-sage/30 text-yellow-mellow-dark focus:ring-yellow-mellow-dark"
                  />
                  <span className="font-montserrat text-sm text-text-body">Featured</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-sage/20">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary text-sm px-5 py-2.5"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {modalMode === 'create' ? 'Create Service' : 'Save Changes'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl font-montserrat text-sm font-medium text-text-body hover:bg-sage/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
