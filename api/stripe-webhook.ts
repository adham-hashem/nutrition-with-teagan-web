import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Helper to get raw body as buffer for Stripe signature verification
async function buffer(readable: any) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

// Disable bodyParser so we get the raw request body
export const config = {
  api: {
    bodyParser: false,
  },
};

function escapeHtml(text: string | null | undefined): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const formatPrice = (pence: number) => {
  const amount = pence / 100;
  return amount % 1 === 0 ? `£${amount}` : `£${amount.toFixed(2)}`;
};

const formatDateTime = (isoString: string) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleString('en-GB', {
      timeZone: 'Europe/London',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return isoString;
  }
};

async function sendTelegramNotification(message: string, attempt = 1, maxAttempts = 3) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!token || !chatId) {
    console.log('[Telegram Notifier] Bot Token or Chat ID not configured. Skipping notification.');
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HTTP ${response.status} - ${errText}`);
    }

    console.log('[Telegram Notifier] Notification sent successfully.');
  } catch (error: any) {
    console.error(`[Telegram Notifier] Error (Attempt ${attempt}/${maxAttempts}):`, error.message || error);

    if (attempt < maxAttempts) {
      const delay = attempt * 2000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return sendTelegramNotification(message, attempt + 1, maxAttempts);
    }
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).json({ message: 'Missing stripe-signature or webhook secret configuration' });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('[Stripe Webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`[Stripe Webhook] Received event: ${event.type}`);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    const stripeSessionId = session.id;

    try {
      // 1. Find the booking
      let bookingQuery = supabase.from('bookings').select('*');
      if (bookingId) {
        bookingQuery = bookingQuery.eq('id', bookingId);
      } else {
        bookingQuery = bookingQuery.eq('stripe_session_id', stripeSessionId);
      }

      const { data: booking, error: fetchError } = await bookingQuery.single();

      if (fetchError || !booking) {
        console.error('[Stripe Webhook] Associated booking not found:', fetchError || 'No booking');
        return res.status(404).json({ message: 'Booking not found for this session' });
      }

      // If already confirmed, don't repeat the process
      if (booking.status === 'confirmed' && booking.payment_status === 'paid') {
        console.log('[Stripe Webhook] Booking already confirmed.');
        return res.status(200).json({ received: true, alreadyProcessed: true });
      }

      // 2. Update booking status
      const { data: updatedBooking, error: updateError } = await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('id', booking.id)
        .select('*')
        .single();

      if (updateError || !updatedBooking) {
        console.error('[Stripe Webhook] Error updating booking:', updateError);
        return res.status(500).json({ message: 'Failed to update booking status' });
      }

      console.log(`[Stripe Webhook] Booking ${updatedBooking.id} updated to confirmed/paid.`);

      // 3. Retrieve service or programme titles to build the Telegram message
      let serviceTitle = 'Nutrition Consultation';
      let programmeTitle: string | null = null;

      if (updatedBooking.booking_type === 'programme' && updatedBooking.programme_id) {
        const { data: programme } = await supabase
          .from('programmes')
          .select('title')
          .eq('id', updatedBooking.programme_id)
          .single();
        if (programme) programmeTitle = programme.title;
      } else if (updatedBooking.service_id) {
        const { data: service } = await supabase
          .from('services')
          .select('title')
          .eq('id', updatedBooking.service_id)
          .single();
        if (service) serviceTitle = service.title;
      }

      // 4. Construct and send Telegram notification
      const clientName = escapeHtml(updatedBooking.client_name);
      const clientEmail = escapeHtml(updatedBooking.client_email);
      const clientPhone = escapeHtml(updatedBooking.client_phone) || 'Not Provided';
      const scheduledAtFormatted = formatDateTime(updatedBooking.scheduled_at);
      const durationMinutes = updatedBooking.duration_minutes;
      const consultationType = escapeHtml(updatedBooking.consultation_type);
      const finalPrice = typeof updatedBooking.final_price === 'number' ? formatPrice(updatedBooking.final_price) : 'Paid via Stripe';

      let discountDetails = '';
      if (updatedBooking.discount_code && typeof updatedBooking.discount_amount === 'number') {
        discountDetails = ` (Promo: ${escapeHtml(updatedBooking.discount_code)} - Saved ${formatPrice(updatedBooking.discount_amount)})`;
      }

      const mainConcern = escapeHtml(updatedBooking.main_concern);
      const symptomsText = updatedBooking.symptoms ? escapeHtml(updatedBooking.symptoms.trim()) : 'None';
      const medicationsText = updatedBooking.medications ? escapeHtml(updatedBooking.medications.trim()) : 'None';
      const notesText = updatedBooking.notes ? escapeHtml(updatedBooking.notes.trim()) : 'None';

      const message = `🌿 <b>New Booking Confirmed (Paid)!</b> 🌿\n\n` +
                      `👤 <b>Client:</b> ${clientName}\n` +
                      `✉️ <b>Email:</b> ${clientEmail}\n` +
                      `📞 <b>Phone:</b> ${clientPhone}\n\n` +
                      `✨ <b>Service:</b> ${escapeHtml(serviceTitle)}\n` +
                      (programmeTitle ? `📦 <b>Programme:</b> ${escapeHtml(programmeTitle)}\n` : '') +
                      `📅 <b>Date/Time:</b> ${scheduledAtFormatted}\n` +
                      `⏳ <b>Duration:</b> ${durationMinutes} mins\n` +
                      `💻 <b>Format:</b> ${consultationType === 'online' ? 'Online (Telehealth)' : consultationType === 'in_person' ? 'In-Person' : 'Hybrid'}\n` +
                      `💰 <b>Paid Amount:</b> ${finalPrice}${discountDetails}\n\n` +
                      `🎯 <b>Main Health Concern:</b> ${mainConcern}\n` +
                      `🩹 <b>Symptoms:</b> ${symptomsText}\n` +
                      `💊 <b>Medications/Supps:</b> ${medicationsText}\n` +
                      `📝 <b>Additional Notes:</b> ${notesText}\n\n` +
                      `📅 <i>Confirmed at: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })} (UK Time)</i>`;

      await sendTelegramNotification(message);

      return res.status(200).json({ received: true, updated: true });
    } catch (dbErr: any) {
      console.error('[Stripe Webhook] Database processing error:', dbErr);
      return res.status(500).json({ message: 'Internal server error processing database updates' });
    }
  }

  return res.status(200).json({ received: true });
}
