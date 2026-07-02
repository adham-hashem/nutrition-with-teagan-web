import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Mail,
  Search,
  CheckCircle2,
  Circle,
  Archive,
  Reply,
  MoreVertical,
  Trash2,
  X,
  Loader2,
  Clock,
  MailOpen,
} from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  replied_at: string | null;
  notes: string | null;
  created_at: string;
}

const statusConfig = {
  unread: { color: 'bg-lilac/10 text-lilac', icon: Circle, label: 'Unread' },
  read: { color: 'bg-sage/10 text-sage', icon: CheckCircle2, label: 'Read' },
  replied: { color: 'bg-sage/10 text-sage', icon: Reply, label: 'Replied' },
  archived: { color: 'bg-gray-100 text-gray-500', icon: Archive, label: 'Archived' },
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  async function fetchMessages() {
    setLoading(true);
    try {
      let query = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setMessages((data as Message[]) || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: Message['status']) {
    const updateData: Partial<Message> = { status };
    if (status === 'replied') {
      updateData.replied_at = new Date().toISOString();
    }

    const { error } = await supabase.from('contact_messages').update(updateData).eq('id', id);
    if (!error) {
      fetchMessages();
    }
  }

  async function saveNotes() {
    if (!selectedMessage) return;
    setSaving(true);
    const { error } = await supabase
      .from('contact_messages')
      .update({ notes: selectedMessage.notes })
      .eq('id', selectedMessage.id);
    if (!error) {
      setShowModal(false);
      fetchMessages();
    }
    setSaving(false);
  }

  async function deleteMessage(id: string) {
    if (!confirm('Delete this message?')) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (!error) fetchMessages();
  }

  const filteredMessages = messages.filter((m) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(searchLower) ||
      m.email.toLowerCase().includes(searchLower) ||
      (m.subject && m.subject.toLowerCase().includes(searchLower))
    );
  });

  function openMessage(message: Message) {
    setSelectedMessage(message);
    setShowModal(true);
    if (message.status === 'unread') {
      updateStatus(message.id, 'read');
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-playfair text-3xl font-medium text-text-primary">Messages</h1>
        <p className="font-montserrat text-sm text-text-secondary mt-1">
          Contact form submissions from your website
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
            <input
              type="text"
              placeholder="Search by name, email or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-sage/30"
            />
          </div>

          <div className="flex gap-2">
            {(['all', 'unread', 'read', 'replied', 'archived'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl font-montserrat text-sm transition-colors ${
                  statusFilter === status
                    ? 'bg-sage text-white'
                    : 'bg-sage/10 text-text-secondary hover:bg-sage/20'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-sage" />
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="py-12 text-center">
            <Mail className="w-12 h-12 text-sage/20 mx-auto mb-4" />
            <p className="font-montserrat text-sm text-text-light">No messages found</p>
          </div>
        ) : (
          <div className="divide-y divide-sage/10">
            {filteredMessages.map((message) => {
              const config = statusConfig[message.status];
              const StatusIcon = config.icon;
              return (
                <div
                  key={message.id}
                  onClick={() => openMessage(message)}
                  className={`flex items-start gap-4 p-5 cursor-pointer transition-colors hover:bg-cream/50 ${
                    message.status === 'unread' ? 'bg-lilac/5' : ''
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      message.status === 'unread' ? 'bg-lilac/15' : 'bg-sage/10'
                    }`}
                  >
                    {message.status === 'unread' ? (
                      <Mail className="w-5 h-5 text-lilac" />
                    ) : (
                      <MailOpen className="w-5 h-5 text-sage" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-montserrat text-sm font-medium text-text-primary">
                        {message.name}
                      </p>
                      <span className={`px-2 py-0.5 rounded font-montserrat text-xs ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="font-montserrat text-xs text-text-light mb-2">{message.email}</p>
                    {message.subject && (
                      <p className="font-montserrat text-sm text-text-secondary font-medium mb-1">
                        {message.subject}
                      </p>
                    )}
                    <p className="font-montserrat text-sm text-text-light line-clamp-2">
                      {message.message}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-text-light">
                      <Clock className="w-3 h-3" />
                      {formatDate(message.created_at)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-luxury">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-xl font-medium text-text-primary">Message</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-sage/10 transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Sender Info */}
              <div className="p-4 rounded-xl bg-cream">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-montserrat text-xs uppercase tracking-wider text-text-light mb-1">
                      Name
                    </p>
                    <p className="font-montserrat text-sm font-medium text-text-primary">
                      {selectedMessage.name}
                    </p>
                  </div>
                  <div>
                    <p className="font-montserrat text-xs uppercase tracking-wider text-text-light mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="font-montserrat text-sm text-sage hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                  {selectedMessage.phone && (
                    <div>
                      <p className="font-montserrat text-xs uppercase tracking-wider text-text-light mb-1">
                        Phone
                      </p>
                      <p className="font-montserrat text-sm text-text-primary">
                        {selectedMessage.phone}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="font-montserrat text-xs uppercase tracking-wider text-text-light mb-1">
                      Date
                    </p>
                    <p className="font-montserrat text-sm text-text-primary">
                      {formatDate(selectedMessage.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Subject */}
              {selectedMessage.subject && (
                <div>
                  <p className="font-montserrat text-xs uppercase tracking-wider text-text-light mb-2">
                    Subject
                  </p>
                  <p className="font-montserrat text-sm font-medium text-text-primary">
                    {selectedMessage.subject}
                  </p>
                </div>
              )}

              {/* Message */}
              <div>
                <p className="font-montserrat text-xs uppercase tracking-wider text-text-light mb-2">
                  Message
                </p>
                <div className="p-4 rounded-xl bg-sage/5 border border-sage/10">
                  <p className="font-montserrat text-sm text-text-secondary whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="font-montserrat text-xs uppercase tracking-wider text-text-light mb-2">
                  Internal Notes
                </p>
                <textarea
                  value={selectedMessage.notes || ''}
                  onChange={(e) =>
                    setSelectedMessage({ ...selectedMessage, notes: e.target.value || null })
                  }
                  rows={3}
                  placeholder="Add notes about this message..."
                  className="w-full px-4 py-2.5 rounded-xl border border-sage/20 font-montserrat text-sm resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your enquiry'}`}
                  onClick={() => updateStatus(selectedMessage.id, 'replied')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sage text-white font-montserrat text-sm hover:bg-sage-dark transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  Reply
                </a>
                <button
                  onClick={() => {
                    updateStatus(selectedMessage.id, 'archived');
                    setShowModal(false);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-text-secondary font-montserrat text-sm hover:bg-gray-200 transition-colors"
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
                <button
                  onClick={() => {
                    deleteMessage(selectedMessage.id);
                    setShowModal(false);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-500 font-montserrat text-sm hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>

            {/* Save Notes */}
            <div className="flex justify-end mt-6 pt-4 border-t border-sage/10">
              <button
                onClick={saveNotes}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-sage text-white font-montserrat text-sm font-semibold hover:bg-sage-dark disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
