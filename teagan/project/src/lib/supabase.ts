import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          client_name: string;
          client_email: string;
          client_phone: string | null;
          booking_type: 'initial' | 'follow-up' | 'programme';
          programme_id: string | null;
          scheduled_at: string;
          duration_minutes: number;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_name: string;
          client_email: string;
          client_phone?: string | null;
          booking_type: 'initial' | 'follow-up' | 'programme';
          programme_id?: string | null;
          scheduled_at: string;
          duration_minutes?: number;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_name?: string;
          client_email?: string;
          client_phone?: string | null;
          booking_type?: 'initial' | 'follow-up' | 'programme';
          programme_id?: string | null;
          scheduled_at?: string;
          duration_minutes?: number;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      programmes: {
        Row: {
          id: string;
          title: string;
          subtitle: string | null;
          description: string | null;
          duration_weeks: number;
          price_pence: number;
          tag: string | null;
          tag_color: string;
          image_url: string | null;
          suitable_for: string[];
          includes: string[];
          outcomes: string[];
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          subtitle?: string | null;
          description?: string | null;
          duration_weeks: number;
          price_pence: number;
          tag?: string | null;
          tag_color?: string;
          image_url?: string | null;
          suitable_for?: string[];
          includes?: string[];
          outcomes?: string[];
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          subtitle?: string | null;
          description?: string | null;
          duration_weeks?: number;
          price_pence?: number;
          tag?: string | null;
          tag_color?: string;
          image_url?: string | null;
          suitable_for?: string[];
          includes?: string[];
          outcomes?: string[];
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      blog_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          category_id: string | null;
          featured_image_url: string | null;
          meta_title: string | null;
          meta_description: string | null;
          published_at: string | null;
          is_published: boolean;
          author_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          category_id?: string | null;
          featured_image_url?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          published_at?: string | null;
          is_published?: boolean;
          author_name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string;
          category_id?: string | null;
          featured_image_url?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          published_at?: string | null;
          is_published?: boolean;
          author_name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      availability_templates: {
        Row: {
          id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          is_working_day: boolean;
        };
        Insert: {
          id?: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          is_working_day?: boolean;
        };
        Update: {
          id?: string;
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
          is_working_day?: boolean;
        };
      };
      availability_exceptions: {
        Row: {
          id: string;
          exception_date: string;
          exception_type: 'holiday' | 'blocked' | 'special';
          reason: string | null;
          alternative_hours: { start: string; end: string } | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          exception_date: string;
          exception_type: 'holiday' | 'blocked' | 'special';
          reason?: string | null;
          alternative_hours?: { start: string; end: string } | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          exception_date?: string;
          exception_type?: 'holiday' | 'blocked' | 'special';
          reason?: string | null;
          alternative_hours?: { start: string; end: string } | null;
          created_at?: string;
        };
      };
      contact_messages: {
        Row: {
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
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject?: string | null;
          message: string;
          status?: 'unread' | 'read' | 'replied' | 'archived';
          replied_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          subject?: string | null;
          message?: string;
          status?: 'unread' | 'read' | 'replied' | 'archived';
          replied_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          client_name: string;
          client_location: string | null;
          programme: string | null;
          image_url: string | null;
          rating: number;
          quote: string;
          is_approved: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_name: string;
          client_location?: string | null;
          programme?: string | null;
          image_url?: string | null;
          rating?: number;
          quote: string;
          is_approved?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_name?: string;
          client_location?: string | null;
          programme?: string | null;
          image_url?: string | null;
          rating?: number;
          quote?: string;
          is_approved?: boolean;
          display_order?: number;
          created_at?: string;
        };
      };
      faq_items: {
        Row: {
          id: string;
          question: string;
          answer: string;
          category: string;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          category?: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          category?: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      website_sections: {
        Row: {
          id: string;
          section_key: string;
          title: string | null;
          subtitle: string | null;
          content: string | null;
          image_url: string | null;
          cta_text: string | null;
          cta_link: string | null;
          metadata: Record<string, unknown>;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_key: string;
          title?: string | null;
          subtitle?: string | null;
          content?: string | null;
          image_url?: string | null;
          cta_text?: string | null;
          cta_link?: string | null;
          metadata?: Record<string, unknown>;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_key?: string;
          title?: string | null;
          subtitle?: string | null;
          content?: string | null;
          image_url?: string | null;
          cta_text?: string | null;
          cta_link?: string | null;
          metadata?: Record<string, unknown>;
          updated_at?: string;
        };
      };
    };
  };
};
