import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Calendar, 
  Clock, 
  CreditCard, 
  User, 
  Mail, 
  ArrowLeft 
} from 'lucide-react';
import { Link } from '../router';

interface BookingDetails {
  id: string;
  client_name: string;
  client_email: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  payment_status: string;
  final_price: number;
  original_price: number;
  booking_type: string;
  consultation_type: string;
  services?: { title: string } | null;
  programmes?: { title: string } | null;
}

export default function BookingStatus() {
  const params = new URLSearchParams(window.location.search);
  const bookingId = params.get('booking_id');
  const urlStatus = params.get('status'); // 'success' or 'cancel'

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      setError('Invalid booking URL. Missing booking reference.');
      setLoading(false);
      return;
    }

    async function fetchBooking() {
      try {
        const { data, error: dbError } = await supabase
          .from('bookings')
          .select('*, services(title), programmes(title)')
          .eq('id', bookingId)
          .single();

        if (dbError || !data) {
          console.error('[BookingStatus] DB Error:', dbError);
          setError('We could not retrieve your booking details. Please double-check your link.');
        } else {
          setBooking(data as BookingDetails);
          
          // Complete free bookings or redirect paid bookings to Stripe.
          const action = params.get('action');
          if (action === 'pay' && data.status === 'pending_payment') {
            initiatePayment(data as BookingDetails);
          }
        }
      } catch (err) {
        console.error('[BookingStatus] Fetch Exception:', err);
        setError('An unexpected error occurred while loading booking details.');
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [bookingId]);

  async function initiatePayment(currentBooking: BookingDetails) {
    const isFree = currentBooking.original_price === 0 && currentBooking.final_price === 0;
    setRedirecting(true);
    setError(null);
    try {
      const response = await fetch(isFree ? '/api/confirm-free-booking' : '/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId: currentBooking.id }),
      });

      console.log('[BookingStatus] API response status:', response.status, response.statusText);

      if (!response.ok) {
        let errMsg = 'Failed to create payment session.';
        try {
          const errData = await response.json();
          errMsg = errData.message || errMsg;
        } catch (jsonErr) {
          errMsg = `HTTP ${response.status}: ${response.statusText || 'Server Error'}. If running locally, please ensure you use 'vercel dev' to run API functions.`;
        }
        throw new Error(errMsg);
      }

      let data: any;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error('API returned invalid JSON response. If running locally, please ensure you use \'vercel dev\'.');
      }

      if (isFree && data.confirmed) {
        setBooking({ ...currentBooking, status: 'confirmed', payment_status: 'paid' });
        return;
      }

      if (!data.url) {
        throw new Error('Stripe Checkout URL was not returned by the API.');
      }

      console.log('[BookingStatus] Redirecting to Stripe Checkout:', data.url);
      window.location.href = data.url; // Redirect to Stripe Checkout
    } catch (err: any) {
      console.error('[BookingStatus] Payment Initiation Error:', err);
      setError(err.message || 'Could not redirect to Stripe. Please try clicking Retry Payment.');
      setRedirecting(false);
    }
  }

  const formatPrice = (pence: number) => {
    const amount = pence / 100;
    return amount % 1 === 0 ? `£${amount}` : `£${amount.toFixed(2)}`;
  };

  const getBookingTitle = () => {
    if (!booking) return '';
    if (booking.booking_type === 'programme') {
      return booking.programmes?.title || 'Programme Enrolment';
    }
    return booking.services?.title || 'Nutrition Consultation';
  };

  // 1. Loading State
  if (loading || redirecting) {
    return (
      <div className="pt-28 lg:pt-36 min-h-screen flex items-center justify-center" style={{ background: '#FAF8F3' }}>
        <div className="text-center px-6">
          <Loader2 className="w-12 h-12 animate-spin text-sage mx-auto mb-6" />
          <h2 className="font-playfair text-2xl font-medium text-text-primary mb-2">
            {redirecting ? (booking?.final_price === 0 ? 'Confirming Booking...' : 'Connecting to Stripe...') : 'Retrieving Booking...'}
          </h2>
          <p className="font-montserrat text-sm text-text-light max-w-sm mx-auto leading-relaxed">
            {redirecting 
              ? (booking?.final_price === 0 ? 'Please wait while we confirm your free appointment.' : 'We are setting up your secure checkout session. You will be redirected shortly.')
              : 'Please wait while we retrieve your reservation details.'}
          </p>
        </div>
      </div>
    );
  }

  // 2. Error State
  if (error || !booking) {
    return (
      <div className="pt-28 lg:pt-36 min-h-screen flex items-center justify-center" style={{ background: '#FAF8F3' }}>
        <div className="max-w-md w-full text-center px-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={30} className="text-red-600" />
          </div>
          <h2 className="font-playfair text-2xl font-medium text-text-primary mb-3">Something went wrong</h2>
          <p className="font-montserrat text-sm text-text-secondary mb-8 leading-relaxed">
            {error || 'The booking details could not be found or loaded.'}
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-sage text-white font-montserrat text-sm font-semibold hover:bg-sage-dark transition-all duration-300 shadow-soft"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Booking
          </Link>
        </div>
      </div>
    );
  }

  // Determine actual status state to show
  // If URL has status=success, OR database already says status=confirmed and payment=paid, show Success.
  // Else, show Cancel/Retry payment UI.
  const isPaid = (booking.status === 'confirmed' && booking.payment_status === 'paid') || (urlStatus === 'success' && booking.final_price > 0);
  const isFree = booking.original_price === 0 && booking.final_price === 0;
  const isCancelled = booking.status === 'cancelled';

  return (
    <div className="pt-28 lg:pt-36 pb-20 min-h-screen flex items-center justify-center px-6" style={{ background: '#FAF8F3' }}>
      <div className="max-w-xl w-full">
        {isPaid ? (
          /* SUCCESS STATE */
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-sage/15 flex items-center justify-center mx-auto mb-8 animate-pulse-soft">
              <CheckCircle2 size={40} className="text-sage" />
            </div>
            <h1 className="font-playfair text-3.5xl font-medium text-text-primary mb-3">Booking Confirmed!</h1>
            <p className="font-montserrat text-sm text-text-secondary leading-relaxed mb-2">
              Thank you, <strong>{booking.client_name}</strong>. {isFree ? 'Your free appointment is confirmed.' : 'Your payment was successful and your appointment is locked in.'}
            </p>
            <p className="font-montserrat text-xs text-sage-dark font-medium mb-8">
              {isFree ? `Your booking details are shown below for ${booking.client_email}.` : `A confirmation email and receipt have been sent to ${booking.client_email}.`}
            </p>

            <div className="bg-white rounded-3xl p-8 shadow-soft text-left border border-sage/10 mb-8 transition-transform hover:scale-[1.01] duration-300">
              <h3 className="font-montserrat text-xs font-bold uppercase tracking-wider text-text-light mb-5 pb-3 border-b border-cream-warm">
                Appointment Summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-montserrat text-xs font-semibold text-text-light">Date</h4>
                    <p className="font-montserrat text-sm font-medium text-text-primary">
                      {new Date(booking.scheduled_at).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-montserrat text-xs font-semibold text-text-light">Time & Duration</h4>
                    <p className="font-montserrat text-sm font-medium text-text-primary">
                      {new Date(booking.scheduled_at).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} ({booking.duration_minutes} Minutes)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-montserrat text-xs font-semibold text-text-light">Service & Payment</h4>
                    <p className="font-montserrat text-sm font-medium text-text-primary">
                      {getBookingTitle()} — <span className="text-sage font-bold">{isFree ? 'Free' : `Paid (${formatPrice(booking.final_price)})`}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-sage mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-montserrat text-xs font-semibold text-text-light">Consultation Format</h4>
                    <p className="font-montserrat text-sm font-medium text-text-primary capitalize">
                      {booking.consultation_type === 'online' ? 'Online (Telehealth Video)' : booking.consultation_type === 'in_person' ? 'In-Person Consultation' : 'Hybrid Package'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/"
              className="inline-block px-8 py-3.5 rounded-full bg-sage text-white font-montserrat text-sm font-semibold hover:bg-sage-dark transition-all duration-300 shadow-soft hover:-translate-y-0.5"
            >
              Return Home
            </Link>
          </div>
        ) : isCancelled ? (
          /* EXPIRED/CANCELLED STATE */
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-8">
              <AlertCircle size={40} className="text-red-500" />
            </div>
            <h1 className="font-playfair text-3.5xl font-medium text-text-primary mb-3">Reservation Expired</h1>
            <p className="font-montserrat text-sm text-text-secondary leading-relaxed mb-3">
              The 45-minute reservation window for this slot has expired, and the appointment has been released back to the public.
            </p>
            <p className="font-montserrat text-xs text-text-light mb-8">
              If you still wish to book a consultation, please select a new slot from the booking page.
            </p>

            <Link
              to="/booking"
              className="inline-block px-8 py-3.5 rounded-full bg-sage text-white font-montserrat text-sm font-semibold hover:bg-sage-dark transition-all duration-300 shadow-soft hover:-translate-y-0.5"
            >
              Book a New Appointment
            </Link>
          </div>
        ) : (
          /* CANCEL/RETRY STATE */
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-yellow-mellow/15 flex items-center justify-center mx-auto mb-8">
              <AlertCircle size={40} className="text-yellow-mellow-dark" />
            </div>
            <h1 className="font-playfair text-3.5xl font-medium text-text-primary mb-3">{isFree ? 'Booking Pending' : 'Payment Pending'}</h1>
            <p className="font-montserrat text-sm text-text-secondary leading-relaxed mb-3">
              Your appointment slot is temporarily reserved for you for <strong>45 minutes</strong> {isFree ? 'while we confirm your booking.' : 'while we wait for payment.'}
            </p>
            <p className="font-montserrat text-xs text-red-600 font-medium mb-8">
              {isFree ? 'Please confirm below. If the reservation expires, choose a new slot.' : 'Please complete payment below. If unpaid within 45 minutes, this slot will automatically release back to the public.'}
            </p>

            <div className="bg-white rounded-3xl p-8 shadow-soft text-left border border-yellow-mellow/10 mb-8">
              <h3 className="font-montserrat text-xs font-bold uppercase tracking-wider text-text-light mb-5 pb-3 border-b border-cream-warm">
                Reserved Slot Details
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-yellow-mellow-dark flex-shrink-0" />
                  <span className="font-montserrat text-sm text-text-primary">
                    {new Date(booking.scheduled_at).toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-mellow-dark flex-shrink-0" />
                  <span className="font-montserrat text-sm text-text-primary">
                    {new Date(booking.scheduled_at).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} ({booking.duration_minutes} Mins)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-yellow-mellow-dark flex-shrink-0" />
                  <span className="font-montserrat text-sm font-semibold text-text-primary">
                    {getBookingTitle()} — <span className="text-text-body">{formatPrice(booking.final_price)}</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => initiatePayment(booking)}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-sage text-white font-montserrat text-sm font-semibold hover:bg-sage-dark transition-all duration-300 shadow-soft hover:-translate-y-0.5 active:translate-y-0"
              >
                <CreditCard size={18} /> {isFree ? 'Confirm Free Booking' : 'Retry Payment & Confirm Booking'}
              </button>
            </div>

            <div className="flex justify-center gap-4">
              <Link
                to="/booking"
                className="inline-flex items-center text-xs font-semibold font-montserrat text-text-light hover:text-text-primary transition-colors"
              >
                <ArrowLeft size={14} className="mr-1" /> Rebook different slot
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
