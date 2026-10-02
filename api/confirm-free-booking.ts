import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

function escapeHtml(value: string | null | undefined) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const bookingId = req.body?.bookingId;
  if (typeof bookingId !== 'string' || !/^[0-9a-f-]{36}$/i.test(bookingId)) {
    return res.status(400).json({ message: 'Invalid booking reference' });
  }

  try {
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.status === 'confirmed' && booking.payment_status === 'paid' && booking.final_price === 0) {
      return res.status(200).json({ confirmed: true });
    }
    if (booking.status !== 'pending_payment' || booking.payment_status !== 'pending') {
      return res.status(409).json({ message: 'This booking can no longer be confirmed' });
    }
    if (Date.now() - new Date(booking.created_at).getTime() >= 45 * 60 * 1000) {
      return res.status(409).json({ message: 'This reservation has expired. Please choose a new slot.' });
    }
    if (booking.programme_id || !booking.service_id || booking.original_price !== 0 || booking.final_price !== 0) {
      return res.status(400).json({ message: 'This booking requires payment' });
    }

    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('title, price_pence, is_active')
      .eq('id', booking.service_id)
      .single();

    if (serviceError || !service || !service.is_active || service.price_pence !== 0) {
      return res.status(400).json({ message: 'This service is not available as a free booking' });
    }

    const { data: confirmed, error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'confirmed', payment_status: 'paid', updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .eq('status', 'pending_payment')
      .eq('payment_status', 'pending')
      .select('id')
      .maybeSingle();

    if (updateError) {
      console.error('[Free Booking] Confirmation failed:', updateError);
      return res.status(500).json({ message: 'Could not confirm this booking' });
    }
    if (!confirmed) {
      return res.status(409).json({ message: 'This booking was already updated. Please refresh the page.' });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (token && chatId) {
      const message = `🌿 <b>New Free Booking Confirmed!</b>\n\n` +
        `👤 <b>Client:</b> ${escapeHtml(booking.client_name)}\n` +
        `✉️ <b>Email:</b> ${escapeHtml(booking.client_email)}\n` +
        `📞 <b>Phone:</b> ${escapeHtml(booking.client_phone) || 'Not Provided'}\n` +
        `✨ <b>Service:</b> ${escapeHtml(service.title)}\n` +
        `📅 <b>Date/Time:</b> ${new Date(booking.scheduled_at).toLocaleString('en-GB', { timeZone: 'Europe/London' })} (UK Time)\n` +
        `⏳ <b>Duration:</b> ${booking.duration_minutes} mins\n` +
        `🎯 <b>Main Health Concern:</b> ${escapeHtml(booking.main_concern)}`;
      try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
        });
        if (!response.ok) console.error('[Free Booking] Telegram notification failed:', response.status);
      } catch (error) {
        console.error('[Free Booking] Telegram notification failed:', error);
      }
    }

    return res.status(200).json({ confirmed: true });
  } catch (error) {
    console.error('[Free Booking] Unexpected error:', error);
    return res.status(500).json({ message: 'Could not confirm this booking' });
  }
}
