import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: any, res: any) {
  // CORS Headers for API calls
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { bookingId } = req.body;
  if (!bookingId) {
    return res.status(400).json({ message: 'Missing bookingId' });
  }

  try {
    // 1. Fetch booking details from database using service role (bypass RLS)
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      console.error('[Stripe Session] Error fetching booking:', fetchError);
      return res.status(404).json({ message: 'Booking not found' });
    }

    // 2. Validate status is pending_payment
    if (booking.status !== 'pending_payment') {
      // If already confirmed or cancelled, do not allow payment retry
      return res.status(400).json({ message: `Booking status is ${booking.status}, cannot initiate payment` });
    }

    // 3. Determine description and name for line items
    let lineItemName = 'Nutrition Consultation';
    if (booking.booking_type === 'programme') {
      if (booking.programme_id) {
        const { data: programme } = await supabase
          .from('programmes')
          .select('title')
          .eq('id', booking.programme_id)
          .single();
        if (programme) {
          lineItemName = programme.title;
        }
      }
    } else {
      if (booking.service_id) {
        const { data: service } = await supabase
          .from('services')
          .select('title')
          .eq('id', booking.service_id)
          .single();
        if (service) {
          lineItemName = service.title;
        }
      }
    }

    // Ensure final_price is valid (it is stored in pence, e.g. 18000 for £180)
    const pricePence = booking.final_price || 0;
    if (pricePence <= 0) {
      return res.status(400).json({ message: 'Invalid booking price' });
    }

    // 4. Create Stripe Checkout Session
    const baseUrl = process.env.VERCEL_ENV === 'production'
      ? 'https://www.nutritionwithteagan.com'
      : (process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}` 
          : (req.headers.origin || 'http://localhost:5173'));

    const successUrl = process.env.STRIPE_SUCCESS_URL 
      ? process.env.STRIPE_SUCCESS_URL.replace('{CHECKOUT_SESSION_ID}', '{CHECKOUT_SESSION_ID}')
      : `${baseUrl}/booking/status?booking_id=${booking.id}&status=success&session_id={CHECKOUT_SESSION_ID}`;

    const cancelUrl = process.env.STRIPE_CANCEL_URL
      ? process.env.STRIPE_CANCEL_URL.replace('{CHECKOUT_SESSION_ID}', '{CHECKOUT_SESSION_ID}')
      : `${baseUrl}/booking/status?booking_id=${booking.id}&status=cancel`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: booking.client_email,
      expires_at: Math.floor(Date.now() / 1000) + 40 * 60, // Expire session in 40 minutes (Stripe min is 30 mins)
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: lineItemName,
              description: `Appointment scheduled for ${new Date(booking.scheduled_at).toLocaleDateString('en-GB')}`,
            },
            unit_amount: pricePence,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        bookingId: booking.id,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // 5. Update booking with stripe_session_id
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ stripe_session_id: session.id })
      .eq('id', booking.id);

    if (updateError) {
      console.error('[Stripe Session] Error updating booking session ID:', updateError);
      return res.status(500).json({ message: 'Failed to save Stripe session ID' });
    }

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('[Stripe Session] Session creation error:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}
