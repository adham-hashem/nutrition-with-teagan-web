// Vercel serverless function to securely send booking notifications to Telegram.
// Avoids exposing bot credentials to the client.

// Helper to escape HTML tags for Telegram parse_mode: 'HTML'
function escapeHtml(text: string | null | undefined): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

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

    const resData: any = await response.json();
    if (!resData.ok) {
      throw new Error(`API responded with ok=false: ${JSON.stringify(resData)}`);
    }

    console.log('[Telegram Notifier] Notification sent successfully.');
  } catch (error: any) {
    console.error(`[Telegram Notifier] Error (Attempt ${attempt}/${maxAttempts}):`, error.message || error);

    if (attempt < maxAttempts) {
      const delay = attempt * 2000;
      console.log(`[Telegram Notifier] Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return sendTelegramNotification(message, attempt + 1, maxAttempts);
    } else {
      console.error('[Telegram Notifier] Max attempts reached. Notification failed.');
    }
  }
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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const booking = req.body;

    const clientName = escapeHtml(booking.client_name);
    const clientEmail = escapeHtml(booking.client_email);
    const clientPhone = escapeHtml(booking.client_phone) || 'Not Provided';
    const serviceTitle = escapeHtml(booking.service_title);
    const programmeTitle = booking.programme_title ? escapeHtml(booking.programme_title) : null;
    const scheduledAtFormatted = formatDateTime(booking.scheduled_at);
    const durationMinutes = booking.duration_minutes;
    const consultationType = escapeHtml(booking.consultation_type);
    const finalPrice = typeof booking.final_price === 'number' ? formatPrice(booking.final_price) : 'Not Specified';
    
    let discountDetails = '';
    if (booking.discount_code && typeof booking.discount_amount === 'number') {
      discountDetails = ` (Promo: ${escapeHtml(booking.discount_code)} - Saved ${formatPrice(booking.discount_amount)})`;
    }

    const mainConcern = escapeHtml(booking.main_concern);
    const symptomsText = booking.symptoms ? escapeHtml(booking.symptoms.trim()) : 'None';
    const medicationsText = booking.medications ? escapeHtml(booking.medications.trim()) : 'None';
    const notesText = booking.notes ? escapeHtml(booking.notes.trim()) : 'None';

    const message = `🌿 <b>New Booking Received!</b> 🌿\n\n` +
                    `👤 <b>Client:</b> ${clientName}\n` +
                    `✉️ <b>Email:</b> ${clientEmail}\n` +
                    `📞 <b>Phone:</b> ${clientPhone}\n\n` +
                    `✨ <b>Service:</b> ${serviceTitle}\n` +
                    (programmeTitle ? `📦 <b>Programme:</b> ${programmeTitle}\n` : '') +
                    `📅 <b>Date/Time:</b> ${scheduledAtFormatted}\n` +
                    `⏳ <b>Duration:</b> ${durationMinutes} mins\n` +
                    `💻 <b>Format:</b> ${consultationType === 'online' ? 'Online (Telehealth)' : consultationType === 'in_person' ? 'In-Person' : 'Hybrid'}\n` +
                    `💰 <b>Final Price:</b> ${finalPrice}${discountDetails}\n\n` +
                    `🎯 <b>Main Health Concern:</b> ${mainConcern}\n` +
                    `🩹 <b>Symptoms:</b> ${symptomsText}\n` +
                    `💊 <b>Medications/Supps:</b> ${medicationsText}\n` +
                    `📝 <b>Additional Notes:</b> ${notesText}\n\n` +
                    `📅 <i>Submitted at: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })} (UK Time)</i>`;

    await sendTelegramNotification(message);

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('[Telegram API handler] Error:', error.message || error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}
