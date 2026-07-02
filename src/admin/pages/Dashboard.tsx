import { useEffect, useState } from 'react';
import { Link } from '../../router';
import { supabase } from '../../lib/supabase';
import {
  CalendarDays,
  Mail,
  Package,
  FileText,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface Booking {
  id: string;
  client_name: string;
  client_email: string;
  scheduled_at: string;
  booking_type: string;
  status: string;
  programme_id: string | null;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  created_at: string;
  status: string;
}

interface Stats {
  totalBookings: number;
  pendingBookings: number;
  unreadMessages: number;
  activeProgrammes: number;
  publishedPosts: number;
}

const formatGBP = (pence: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  }).format(pence / 100);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch stats
        const [bookingsCount, pendingCount, messagesCount, programmesCount, postsCount] =
          await Promise.all([
            supabase.from('bookings').select('id', { count: 'exact', head: true }),
            supabase
              .from('bookings')
              .select('id', { count: 'exact', head: true })
              .eq('status', 'pending'),
            supabase
              .from('contact_messages')
              .select('id', { count: 'exact', head: true })
              .eq('status', 'unread'),
            supabase
              .from('programmes')
              .select('id', { count: 'exact', head: true })
              .eq('is_active', true),
            supabase
              .from('blog_posts')
              .select('id', { count: 'exact', head: true })
              .eq('is_published', true),
          ]);

        setStats({
          totalBookings: bookingsCount.count || 0,
          pendingBookings: pendingCount.count || 0,
          unreadMessages: messagesCount.count || 0,
          activeProgrammes: programmesCount.count || 0,
          publishedPosts: postsCount.count || 0,
        });

        // Fetch upcoming bookings
        const now = new Date().toISOString();
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('*')
          .gte('scheduled_at', now)
          .eq('status', 'confirmed')
          .order('scheduled_at', { ascending: true })
          .limit(5);

        setUpcomingBookings((bookingsData as Booking[]) || []);

        // Fetch recent messages
        const { data: messagesData } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentMessages((messagesData as Message[]) || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-sage" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-playfair text-3xl font-medium text-text-primary mb-2">Dashboard</h1>
        <p className="font-montserrat text-sm text-text-secondary">
          Welcome back! Here's an overview of your practice.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-sage/10">
              <CalendarDays className="w-5 h-5 text-sage" />
            </div>
            <span className="font-montserrat text-xs text-text-light uppercase tracking-wider">
              Total Bookings
            </span>
          </div>
          <p className="font-playfair text-3xl font-medium text-text-primary">
            {stats?.totalBookings ?? 0}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-lilac/10">
              <Clock className="w-5 h-5 text-lilac" />
            </div>
            <span className="font-montserrat text-xs text-text-light uppercase tracking-wider">
              Pending
            </span>
          </div>
          <p className="font-playfair text-3xl font-medium text-text-primary">
            {stats?.pendingBookings ?? 0}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-yellow-mellow/10">
              <Mail className="w-5 h-5 text-yellow-mellow-dark" />
            </div>
            <span className="font-montserrat text-xs text-text-light uppercase tracking-wider">
              Unread Messages
            </span>
          </div>
          <p className="font-playfair text-3xl font-medium text-text-primary">
            {stats?.unreadMessages ?? 0}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-sage/10">
              <Package className="w-5 h-5 text-sage" />
            </div>
            <span className="font-montserrat text-xs text-text-light uppercase tracking-wider">
              Active Programmes
            </span>
          </div>
          <p className="font-playfair text-3xl font-medium text-text-primary">
            {stats?.activeProgrammes ?? 0}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-gold-light/20">
              <FileText className="w-5 h-5 text-gold" />
            </div>
            <span className="font-montserrat text-xs text-text-light uppercase tracking-wider">
              Published Posts
            </span>
          </div>
          <p className="font-playfair text-3xl font-medium text-text-primary">
            {stats?.publishedPosts ?? 0}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-card">
        <h2 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-text-primary mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            to="/admin/bookings"
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-sage/5 hover:bg-sage/10 transition-colors"
          >
            <CalendarDays className="w-4 h-4 text-sage" />
            <span className="font-montserrat text-sm text-text-primary">New Booking</span>
          </Link>
          <Link
            to="/admin/blog"
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-sage/5 hover:bg-sage/10 transition-colors"
          >
            <FileText className="w-4 h-4 text-sage" />
            <span className="font-montserrat text-sm text-text-primary">New Post</span>
          </Link>
          <Link
            to="/admin/availability"
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-sage/5 hover:bg-sage/10 transition-colors"
          >
            <Clock className="w-4 h-4 text-sage" />
            <span className="font-montserrat text-sm text-text-primary">Set Availability</span>
          </Link>
          <Link
            to="/admin/messages"
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-sage/5 hover:bg-sage/10 transition-colors"
          >
            <Mail className="w-4 h-4 text-sage" />
            <span className="font-montserrat text-sm text-text-primary">View Messages</span>
          </Link>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Bookings */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-text-primary">
              Upcoming Bookings
            </h2>
            <Link
              to="/admin/bookings"
              className="flex items-center gap-1 text-sage hover:text-sage-dark transition-colors"
            >
              <span className="font-montserrat text-xs">View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {upcomingBookings.length === 0 ? (
            <div className="py-8 text-center">
              <CalendarDays className="w-10 h-10 text-sage/20 mx-auto mb-3" />
              <p className="font-montserrat text-sm text-text-light">No upcoming bookings</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-cream hover:bg-cream-warm transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-sage/15 flex items-center justify-center">
                      <CalendarDays className="w-4 h-4 text-sage" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-montserrat text-sm font-medium text-text-primary truncate">
                      {booking.client_name}
                    </p>
                    <p className="font-montserrat text-xs text-text-light">
                      {formatDate(booking.scheduled_at)}
                    </p>
                  </div>
                  <span className="font-montserrat text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-sage/10 text-sage">
                    {booking.booking_type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-text-primary">
              Recent Messages
            </h2>
            <Link
              to="/admin/messages"
              className="flex items-center gap-1 text-sage hover:text-sage-dark transition-colors"
            >
              <span className="font-montserrat text-xs">View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="py-8 text-center">
              <Mail className="w-10 h-10 text-sage/20 mx-auto mb-3" />
              <p className="font-montserrat text-sm text-text-light">No messages yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-cream hover:bg-cream-warm transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        message.status === 'unread' ? 'bg-lilac/15' : 'bg-sage/15'
                      }`}
                    >
                      {message.status === 'unread' ? (
                        <AlertCircle className="w-4 h-4 text-lilac" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-sage" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-montserrat text-sm font-medium text-text-primary truncate">
                      {message.name}
                    </p>
                    <p className="font-montserrat text-xs text-text-light truncate">
                      {message.subject || 'No subject'}
                    </p>
                  </div>
                  <span
                    className={`font-montserrat text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                      message.status === 'unread'
                        ? 'bg-lilac/10 text-lilac'
                        : 'bg-sage/10 text-sage'
                    }`}
                  >
                    {message.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-gradient-sage rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5" />
          <h2 className="font-montserrat text-sm font-semibold uppercase tracking-wider">
            Practice Overview
          </h2>
        </div>
        <p className="font-playfair text-lg opacity-90 leading-relaxed">
          Your wellness practice is thriving. Continue providing personalised naturopathic nutrition
          to help women achieve their health goals.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 font-montserrat text-xs">
            <CalendarDays className="w-3.5 h-3.5" />
            {stats?.pendingBookings ?? 0} pending bookings
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 font-montserrat text-xs">
            <Mail className="w-3.5 h-3.5" />
            {stats?.unreadMessages ?? 0} unread messages
          </span>
        </div>
      </div>
    </div>
  );
}
