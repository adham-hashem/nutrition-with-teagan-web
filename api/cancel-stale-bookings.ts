import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: any, res: any) {
  // If CRON_SECRET is configured in Vercel, verify it to restrict execution
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Stale window: 45 minutes ago
    const fortyFiveMinutesAgo = new Date(Date.now() - 45 * 60 * 1000).toISOString();

    // Update bookings with status='pending_payment' and created_at < fortyFiveMinutesAgo
    const { data, error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        payment_status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('status', 'pending_payment')
      .lt('created_at', fortyFiveMinutesAgo)
      .select('id, client_name, client_email, scheduled_at');

    if (error) {
      console.error('[Stale Bookings Cleanup] Error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log(`[Stale Bookings Cleanup] Cancelled ${data?.length || 0} stale bookings.`);

    return res.status(200).json({
      success: true,
      cancelled_count: data?.length || 0,
      cancelled_bookings: data || []
    });
  } catch (error: any) {
    console.error('[Stale Bookings Cleanup] Exception:', error);
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}
