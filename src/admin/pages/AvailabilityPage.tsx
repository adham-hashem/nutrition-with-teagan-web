import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  Calendar,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface AvailabilityTemplate {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_working_day: boolean;
}

interface AvailabilityException {
  id: string;
  exception_date: string;
  exception_type: 'holiday' | 'blocked' | 'special';
  reason: string | null;
  alternative_hours: { start: string; end: string } | null;
  created_at: string;
}

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AvailabilityPage() {
  const [templates, setTemplates] = useState<AvailabilityTemplate[]>([]);
  const [exceptions, setExceptions] = useState<AvailabilityException[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'template' | 'exception'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<AvailabilityTemplate | null>(null);
  const [selectedException, setSelectedException] = useState<AvailabilityException | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [templatesData, exceptionsData] = await Promise.all([
        supabase.from('availability_templates').select('*').order('day_of_week'),
        supabase.from('availability_exceptions').select('*').order('exception_date', { ascending: true }),
      ]);

      setTemplates((templatesData.data as AvailabilityTemplate[]) || []);
      setExceptions((exceptionsData.data as AvailabilityException[]) || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  }

  function openTemplateModal(template: AvailabilityTemplate) {
    setSelectedTemplate(template);
    setModalMode('template');
    setShowModal(true);
  }

  function openExceptionModal(exception?: AvailabilityException) {
    setSelectedException(
      exception || {
        id: '',
        exception_date: new Date().toISOString().split('T')[0],
        exception_type: 'blocked',
        reason: '',
        alternative_hours: null,
        created_at: new Date().toISOString(),
      }
    );
    setModalMode('exception');
    setShowModal(true);
  }

  async function saveTemplate() {
    if (!selectedTemplate) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('availability_templates')
        .update({
          start_time: selectedTemplate.start_time,
          end_time: selectedTemplate.end_time,
          is_working_day: selectedTemplate.is_working_day,
        })
        .eq('id', selectedTemplate.id);

      if (error) throw error;
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setSaving(false);
    }
  }

  async function saveException() {
    if (!selectedException) return;
    setSaving(true);
    try {
      const data = {
        exception_date: selectedException.exception_date,
        exception_type: selectedException.exception_type,
        reason: selectedException.reason || null,
        alternative_hours: selectedException.alternative_hours,
      };

      if (selectedException.id) {
        const { error } = await supabase
          .from('availability_exceptions')
          .update(data)
          .eq('id', selectedException.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('availability_exceptions').insert(data);
        if (error) throw error;
      }

      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving exception:', error);
    } finally {
      setSaving(false);
    }
  }

  async function deleteException(id: string) {
    if (!confirm('Remove this exception?')) return;
    const { error } = await supabase.from('availability_exceptions').delete().eq('id', id);
    if (!error) fetchData();
  }

  const formatTime = (time: string) => {
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const exceptionTypeConfig = {
    holiday: { color: 'bg-lilac/10 text-lilac', label: 'Holiday' },
    blocked: { color: 'bg-red-50 text-red-600', label: 'Blocked' },
    special: { color: 'bg-sage/10 text-sage', label: 'Special Hours' },
  };

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
      <div>
        <h1 className="font-playfair text-3xl font-medium text-text-primary">Availability</h1>
        <p className="font-montserrat text-sm text-text-secondary mt-1">
          Manage your working hours and blocked dates
        </p>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-white rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-text-primary">
            Weekly Schedule
          </h2>
          <div className="flex items-center gap-2 text-xs text-text-light">
            <Clock className="w-4 h-4" />
            Times in GMT/BST
          </div>
        </div>

        <div className="space-y-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`flex items-center justify-between p-4 rounded-xl ${
                template.is_working_day ? 'bg-cream' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    template.is_working_day ? 'bg-sage text-white' : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {template.is_working_day ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-montserrat text-sm font-medium text-text-primary">
                    {dayNames[template.day_of_week]}
                  </p>
                  {template.is_working_day ? (
                    <p className="font-montserrat text-xs text-text-light">
                      {formatTime(template.start_time)} - {formatTime(template.end_time)}
                    </p>
                  ) : (
                    <p className="font-montserrat text-xs text-text-light">Day off</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => openTemplateModal(template)}
                className="p-2 rounded-lg hover:bg-sage/10 transition-colors"
              >
                <Edit2 className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Exceptions */}
      <div className="bg-white rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-text-primary">
            Exceptions & Blocked Dates
          </h2>
          <button
            onClick={() => openExceptionModal()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sage text-white font-montserrat text-sm hover:bg-sage-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Exception
          </button>
        </div>

        {exceptions.length === 0 ? (
          <div className="py-8 text-center">
            <Calendar className="w-10 h-10 text-sage/20 mx-auto mb-3" />
            <p className="font-montserrat text-sm text-text-light">No exceptions scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">
            {exceptions.map((exception) => {
              const typeConfig = exceptionTypeConfig[exception.exception_type];
              return (
                <div
                  key={exception.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-cream"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeConfig.color}`}>
                      {exception.exception_type === 'holiday' ? (
                        <Calendar className="w-5 h-5" />
                      ) : exception.exception_type === 'blocked' ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-montserrat text-sm font-medium text-text-primary">
                        {formatDate(exception.exception_date)}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`px-2 py-0.5 rounded font-montserrat text-xs ${typeConfig.color}`}
                        >
                          {typeConfig.label}
                        </span>
                        {exception.reason && (
                          <span className="font-montserrat text-xs text-text-light">
                            {exception.reason}
                          </span>
                        )}
                        {exception.alternative_hours && (
                          <span className="font-montserrat text-xs text-sage">
                            {exception.alternative_hours.start} - {exception.alternative_hours.end}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openExceptionModal(exception)}
                      className="p-2 rounded-lg hover:bg-sage/10 transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-text-secondary" />
                    </button>
                    <button
                      onClick={() => deleteException(exception.id)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-luxury">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-xl font-medium text-text-primary">
                {modalMode === 'template' ? 'Edit Hours' : 'Add Exception'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-sage/10 transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            {modalMode === 'template' && selectedTemplate && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-cream">
                  <p className="font-montserrat text-sm font-medium text-text-primary">
                    {dayNames[selectedTemplate.day_of_week]}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_working_day"
                    checked={selectedTemplate.is_working_day}
                    onChange={(e) =>
                      setSelectedTemplate({ ...selectedTemplate, is_working_day: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-sage/30 text-sage focus:ring-sage"
                  />
                  <label htmlFor="is_working_day" className="font-montserrat text-sm text-text-secondary">
                    Working day
                  </label>
                </div>

                {selectedTemplate.is_working_day && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={selectedTemplate.start_time}
                        onChange={(e) =>
                          setSelectedTemplate({ ...selectedTemplate, start_time: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={selectedTemplate.end_time}
                        onChange={(e) =>
                          setSelectedTemplate({ ...selectedTemplate, end_time: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-sage/10">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-xl font-montserrat text-sm text-text-secondary hover:bg-sage/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveTemplate}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-sage text-white font-montserrat text-sm font-semibold hover:bg-sage-dark disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save
                  </button>
                </div>
              </div>
            )}

            {modalMode === 'exception' && selectedException && (
              <div className="space-y-4">
                <div>
                  <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedException.exception_date}
                    onChange={(e) =>
                      setSelectedException({ ...selectedException, exception_date: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm"
                  />
                </div>

                <div>
                  <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Type
                  </label>
                  <select
                    value={selectedException.exception_type}
                    onChange={(e) =>
                      setSelectedException({
                        ...selectedException,
                        exception_type: e.target.value as AvailabilityException['exception_type'],
                        alternative_hours: e.target.value === 'special' ? { start: '09:00', end: '13:00' } : null,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm"
                  >
                    <option value="holiday">Holiday</option>
                    <option value="blocked">Blocked</option>
                    <option value="special">Special Hours</option>
                  </select>
                </div>

                <div>
                  <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Reason (optional)
                  </label>
                  <input
                    type="text"
                    value={selectedException.reason || ''}
                    onChange={(e) =>
                      setSelectedException({ ...selectedException, reason: e.target.value || null })
                    }
                    placeholder="e.g. Annual leave, Conference"
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm"
                  />
                </div>

                {selectedException.exception_type === 'special' && selectedException.alternative_hours && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={selectedException.alternative_hours.start}
                        onChange={(e) =>
                          setSelectedException({
                            ...selectedException,
                            alternative_hours: {
                              ...selectedException.alternative_hours!,
                              start: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={selectedException.alternative_hours.end}
                        onChange={(e) =>
                          setSelectedException({
                            ...selectedException,
                            alternative_hours: {
                              ...selectedException.alternative_hours!,
                              end: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-sage/10">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-xl font-montserrat text-sm text-text-secondary hover:bg-sage/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveException}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-sage text-white font-montserrat text-sm font-semibold hover:bg-sage-dark disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
