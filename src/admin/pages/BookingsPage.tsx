import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  CalendarDays,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Clock,
  Mail,
  Phone,
  Package,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit2,
  Trash2,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Booking {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  booking_type: 'initial' | 'follow-up' | 'programme';
  programme_id: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: 'pending' | 'pending_payment' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes: string | null;
  created_at: string;
  programmes?: { title: string } | null;
}

interface Programme {
  id: string;
  title: string;
}

const statusConfig = {
  pending: { color: 'bg-yellow-mellow/10 text-yellow-mellow-dark', icon: AlertCircle },
  pending_payment: { color: 'bg-lilac/15 text-lilac-dark', icon: Clock },
  confirmed: { color: 'bg-sage/10 text-sage', icon: CheckCircle2 },
  completed: { color: 'bg-sage/10 text-sage', icon: CheckCircle2 },
  cancelled: { color: 'bg-red-100 text-red-600', icon: XCircle },
  'no-show': { color: 'bg-gray-100 text-gray-500', icon: XCircle },
};

const typeLabels = {
  initial: 'Initial Consultation',
  'follow-up': 'Follow-Up',
  programme: 'Programme',
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [saving, setSaving] = useState(false);

  // Pagination
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchData();
  }, [page, statusFilter, typeFilter]);

  async function fetchData() {
    setLoading(true);
    try {
      // Fetch programmes for dropdown
      const { data: programmesData } = await supabase
        .from('programmes')
        .select('id, title')
        .eq('is_active', true);
      setProgrammes(programmesData || []);

      // Build query
      let query = supabase
        .from('bookings')
        .select('*, programmes(title)', { count: 'exact' })
        .order('scheduled_at', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      if (typeFilter !== 'all') {
        query = query.eq('booking_type', typeFilter);
      }

      const { data, count, error } = await query;
      if (error) throw error;

      setBookings((data as Booking[]) || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredBookings = bookings.filter((b) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      b.client_name.toLowerCase().includes(searchLower) ||
      b.client_email.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  function openModal(booking: Booking, mode: 'view' | 'edit') {
    setSelectedBooking(booking);
    setModalMode(mode);
    setShowModal(true);
  }

  function openCreateModal() {
    setSelectedBooking({
      id: '',
      client_name: '',
      client_email: '',
      client_phone: null,
      booking_type: 'initial',
      programme_id: null,
      scheduled_at: new Date().toISOString(),
      duration_minutes: 60,
      status: 'pending',
      notes: null,
      created_at: new Date().toISOString(),
    });
    setModalMode('create');
    setShowModal(true);
  }

  async function handleSave() {
    if (!selectedBooking) return;
    setSaving(true);

    try {
      const data = {
        client_name: selectedBooking.client_name,
        client_email: selectedBooking.client_email,
        client_phone: selectedBooking.client_phone,
        booking_type: selectedBooking.booking_type,
        programme_id:
          selectedBooking.booking_type === 'programme' ? selectedBooking.programme_id : null,
        scheduled_at: selectedBooking.scheduled_at,
        duration_minutes: selectedBooking.duration_minutes,
        status: selectedBooking.status,
        notes: selectedBooking.notes,
        updated_at: new Date().toISOString(),
      };

      if (modalMode === 'create') {
        const { error } = await supabase.from('bookings').insert(data);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('bookings')
          .update(data)
          .eq('id', selectedBooking.id);
        if (error) throw error;
      }

      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving booking:', error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (!error) {
      fetchData();
    }
  }

  async function updateStatus(id: string, status: Booking['status']) {
    const { error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) {
      fetchData();
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-medium text-text-primary">Bookings</h1>
          <p className="font-montserrat text-sm text-text-secondary mt-1">
            Manage client consultations and programme bookings
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-sage text-white font-montserrat font-semibold text-sm px-5 py-3 rounded-xl hover:bg-sage-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Booking
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 bg-white"
            >
              <option value="all">All Types</option>
              <option value="initial">Initial</option>
              <option value="follow-up">Follow-Up</option>
              <option value="programme">Programme</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-sage" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-12 text-center">
            <CalendarDays className="w-12 h-12 text-sage/20 mx-auto mb-4" />
            <p className="font-montserrat text-sm text-text-light">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-warm">
                <tr>
                  <th className="text-left px-6 py-4 font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Client
                  </th>
                  <th className="text-left px-6 py-4 font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Type
                  </th>
                  <th className="text-left px-6 py-4 font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Date & Time
                  </th>
                  <th className="text-left px-6 py-4 font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage/10">
                {filteredBookings.map((booking) => {
                  const StatusIcon = statusConfig[booking.status].icon;
                  return (
                    <tr key={booking.id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-montserrat text-sm font-medium text-text-primary">
                            {booking.client_name}
                          </p>
                          <p className="font-montserrat text-xs text-text-light">{booking.client_email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-montserrat text-sm text-text-secondary">
                          {typeLabels[booking.booking_type]}
                          {booking.booking_type === 'programme' && booking.programmes && (
                            <span className="block text-xs text-text-light">
                              {booking.programmes.title}
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-text-light" />
                          <div>
                            <p className="font-montserrat text-sm text-text-primary">
                              {formatDate(booking.scheduled_at)}
                            </p>
                            <p className="font-montserrat text-xs text-text-light">
                              {formatTime(booking.scheduled_at)} ({booking.duration_minutes} min)
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-montserrat text-xs font-medium ${statusConfig[booking.status].color}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => updateStatus(booking.id, 'confirmed')}
                            disabled={booking.status === 'confirmed'}
                            className="p-2 rounded-lg hover:bg-sage/10 disabled:opacity-30 transition-colors"
                            title="Mark Confirmed"
                          >
                            <CheckCircle2 className="w-4 h-4 text-sage" />
                          </button>
                          <button
                            onClick={() => openModal(booking, 'edit')}
                            className="p-2 rounded-lg hover:bg-sage/10 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-text-secondary" />
                          </button>
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-sage/10">
            <p className="font-montserrat text-sm text-text-light">
              Showing {page * pageSize + 1} - {Math.min((page + 1) * pageSize, totalCount)} of{' '}
              {totalCount}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg hover:bg-sage/10 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-text-secondary" />
              </button>
              <span className="font-montserrat text-sm text-text-secondary">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-lg hover:bg-sage/10 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-luxury">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-xl font-medium text-text-primary">
                {modalMode === 'create' ? 'New Booking' : modalMode === 'edit' ? 'Edit Booking' : 'Booking Details'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-sage/10 transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={selectedBooking.client_name}
                    onChange={(e) =>
                      setSelectedBooking({ ...selectedBooking, client_name: e.target.value })
                    }
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm disabled:bg-cream"
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={selectedBooking.client_email}
                    onChange={(e) =>
                      setSelectedBooking({ ...selectedBooking, client_email: e.target.value })
                    }
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm disabled:bg-cream"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={selectedBooking.client_phone || ''}
                    onChange={(e) =>
                      setSelectedBooking({ ...selectedBooking, client_phone: e.target.value || null })
                    }
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm disabled:bg-cream"
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Booking Type
                  </label>
                  <select
                    value={selectedBooking.booking_type}
                    onChange={(e) =>
                      setSelectedBooking({
                        ...selectedBooking,
                        booking_type: e.target.value as Booking['booking_type'],
                      })
                    }
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm disabled:bg-cream"
                  >
                    <option value="initial">Initial Consultation</option>
                    <option value="follow-up">Follow-Up</option>
                    <option value="programme">Programme</option>
                  </select>
                </div>
              </div>

              {selectedBooking.booking_type === 'programme' && (
                <div>
                  <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Programme
                  </label>
                  <select
                    value={selectedBooking.programme_id || ''}
                    onChange={(e) =>
                      setSelectedBooking({
                        ...selectedBooking,
                        programme_id: e.target.value || null,
                      })
                    }
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm disabled:bg-cream"
                  >
                    <option value="">Select a programme</option>
                    {programmes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={selectedBooking.scheduled_at.slice(0, 16)}
                    onChange={(e) =>
                      setSelectedBooking({
                        ...selectedBooking,
                        scheduled_at: new Date(e.target.value).toISOString(),
                      })
                    }
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm disabled:bg-cream"
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={selectedBooking.duration_minutes}
                    onChange={(e) =>
                      setSelectedBooking({
                        ...selectedBooking,
                        duration_minutes: parseInt(e.target.value) || 60,
                      })
                    }
                    disabled={modalMode === 'view'}
                    className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm disabled:bg-cream"
                  />
                </div>
              </div>

              <div>
                <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Status
                </label>
                <select
                  value={selectedBooking.status}
                  onChange={(e) =>
                    setSelectedBooking({
                      ...selectedBooking,
                      status: e.target.value as Booking['status'],
                    })
                  }
                  disabled={modalMode === 'view'}
                  className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm disabled:bg-cream"
                >
                  <option value="pending">Pending</option>
                  <option value="pending_payment">Pending Payment</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                </select>
              </div>

              <div>
                <label className="block font-montserrat text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Notes
                </label>
                <textarea
                  value={selectedBooking.notes || ''}
                  onChange={(e) =>
                    setSelectedBooking({ ...selectedBooking, notes: e.target.value || null })
                  }
                  disabled={modalMode === 'view'}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm disabled:bg-cream resize-none"
                />
              </div>
            </div>

            {modalMode !== 'view' && (
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-sage/10">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl font-montserrat text-sm text-text-secondary hover:bg-sage/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-sage text-white font-montserrat text-sm font-semibold hover:bg-sage-dark disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {modalMode === 'create' ? 'Create Booking' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
