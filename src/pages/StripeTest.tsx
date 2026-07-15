import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter, Link } from '../router';
import { 
  CreditCard, 
  Settings, 
  Terminal, 
  Play, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft 
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  price_pence: number;
}

export default function StripeTest() {
  const { navigate } = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [clientName, setClientName] = useState('Test User');
  const [clientEmail, setClientEmail] = useState('test@example.com');
  const [testAmount, setTestAmount] = useState('10.00');
  
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('id, title, price_pence')
          .eq('is_active', true)
          .limit(10);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setServices(data as Service[]);
          setSelectedServiceId(data[0].id);
        }
      } catch (err: any) {
        console.error('Error fetching services:', err);
        setError('Could not fetch active services from Supabase.');
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  const handleTestPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);

    const pricePence = Math.round(parseFloat(testAmount) * 100);
    if (isNaN(pricePence) || pricePence <= 0) {
      setError('Please enter a valid payment amount.');
      setCreating(false);
      return;
    }

    try {
      const scheduledAt = new Date();
      scheduledAt.setDate(scheduledAt.getDate() + 7); // Schedule 1 week from now

      const bookingData = {
        client_name: clientName,
        client_email: clientEmail,
        client_phone: '07123456789',
        booking_type: 'initial',
        service_id: selectedServiceId || null,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: 60,
        status: 'pending_payment',
        payment_status: 'pending',
        notes: 'Stripe CLI Sandbox Test Booking',
        consultation_type: 'online',
        original_price: pricePence,
        final_price: pricePence,
        main_concern: 'Testing Stripe integration and webhooks locally',
      };

      const { data, error: insertError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select('id')
        .single();

      if (insertError || !data) {
        throw new Error(insertError?.message || 'Failed to create database booking row.');
      }

      // Success - redirect to the app's existing booking status / payment trigger route
      navigate(`/booking/status?booking_id=${data.id}&action=pay`);
    } catch (err: any) {
      console.error('[Stripe Test Sandbox Error]:', err);
      setError(err.message || 'An error occurred while creating the test booking.');
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-28 lg:pt-36 min-h-screen flex items-center justify-center" style={{ background: '#FAF8F3' }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-sage mx-auto mb-4" />
          <p className="font-montserrat text-sm text-text-body">Connecting to database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 lg:pt-36 pb-20 min-h-screen flex items-center justify-center px-6" style={{ background: '#FAF8F3' }}>
      <div className="max-w-xl w-full">
        
        {/* Navigation header */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-sm font-montserrat text-sage-dark hover:text-sage font-medium transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Return to Home
          </Link>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-soft p-8 border border-sage/15" style={{ boxShadow: '0 10px 30px -10px rgba(122, 139, 112, 0.15)' }}>
          <div className="flex items-center mb-6 text-sage">
            <div className="w-12 h-12 rounded-xl bg-sage/15 flex items-center justify-center mr-4">
              <CreditCard size={24} />
            </div>
            <div>
              <h1 className="font-playfair text-2.5xl font-medium text-text-primary">Stripe Test Sandbox</h1>
              <p className="font-montserrat text-xs text-text-secondary mt-0.5">Quickly trigger local payments and webhooks</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-montserrat flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleTestPayment} className="space-y-5">
            <div>
              <label className="block font-montserrat text-xs font-semibold text-text-primary mb-2">
                Client Name (Dummy)
              </label>
              <input 
                type="text" 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-sage/20 font-montserrat text-sm focus:outline-none focus:border-sage bg-neutral-50/50"
              />
            </div>

            <div>
              <label className="block font-montserrat text-xs font-semibold text-text-primary mb-2">
                Client Email (Dummy)
              </label>
              <input 
                type="email" 
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-sage/20 font-montserrat text-sm focus:outline-none focus:border-sage bg-neutral-50/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-montserrat text-xs font-semibold text-text-primary mb-2">
                  Select consultation / Service
                </label>
                <select 
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 font-montserrat text-sm focus:outline-none focus:border-sage bg-neutral-50/50"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                  {services.length === 0 && (
                    <option value="">No services in database</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-montserrat text-xs font-semibold text-text-primary mb-2">
                  Test Amount (GBP)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 font-montserrat text-sm text-text-secondary">£</span>
                  <input 
                    type="number" 
                    step="0.01"
                    value={testAmount}
                    onChange={(e) => setTestAmount(e.target.value)}
                    required
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-sage/20 font-montserrat text-sm focus:outline-none focus:border-sage bg-neutral-50/50"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full flex items-center justify-center py-4 rounded-xl bg-sage text-white font-montserrat font-semibold hover:bg-sage-dark transition-all duration-300 disabled:opacity-50 shadow-soft cursor-pointer text-sm"
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Generating Test Booking...
                </>
              ) : (
                <>
                  <Play size={16} className="mr-2" />
                  Generate Booking & Pay
                </>
              )}
            </button>
          </form>

          {/* Guidelines info */}
          <div className="mt-8 pt-6 border-t border-sage/10 font-montserrat text-xs text-text-secondary space-y-3">
            <div className="flex items-start">
              <Terminal size={14} className="mr-2 mt-0.5 text-sage shrink-0" />
              <div>
                <p className="font-semibold text-text-primary">Required Terminal command:</p>
                <code className="block bg-neutral-100 p-2 rounded mt-1 overflow-x-auto text-[10px] text-red-600 font-mono">
                  stripe listen --forward-to http://localhost:3000/api/stripe-webhook
                </code>
              </div>
            </div>

            <div className="flex items-start">
              <CheckCircle2 size={14} className="mr-2 mt-0.5 text-sage shrink-0" />
              <p>Use the test card number <strong className="text-text-primary">4242 4242 4242 4242</strong> to complete checkout.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
