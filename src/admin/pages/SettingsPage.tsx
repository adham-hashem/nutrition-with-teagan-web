import { useAdminAuth } from '../auth/AdminAuth';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Globe } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAdminAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-playfair text-3xl font-medium text-text-primary">Settings</h1>
        <p className="font-montserrat text-sm text-text-secondary mt-1">
          Manage your admin settings and preferences
        </p>
      </div>

      {/* Account Section */}
      <div className="bg-white rounded-2xl p-6 shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-sage" />
          <h2 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-text-primary">
            Account
          </h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-cream">
            <div>
              <p className="font-montserrat text-sm font-medium text-text-primary">Email</p>
              <p className="font-montserrat text-xs text-text-light">{user?.email}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-sage/10 text-sage font-montserrat text-xs">
              Administrator
            </span>
          </div>
        </div>
      </div>

      {/* Website Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-sage" />
          <h2 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-text-primary">
            Website Settings
          </h2>
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-cream">
            <p className="font-montserrat text-sm font-medium text-text-primary mb-1">
              Public Website
            </p>
            <p className="font-montserrat text-xs text-text-light mb-3">
              View or manage the public-facing website content
            </p>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sage text-white font-montserrat text-sm hover:bg-sage-dark transition-colors"
            >
              View Website
            </a>
          </div>
        </div>
      </div>

      {/* Database Info */}
      <div className="bg-white rounded-2xl p-6 shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-5 h-5 text-sage" />
          <h2 className="font-montserrat text-sm font-semibold uppercase tracking-wider text-text-primary">
            Database
          </h2>
        </div>
        <div className="space-y-3">
          <p className="font-montserrat text-sm text-text-secondary">
            Your data is securely stored in Supabase with automatic backups and row-level security
            enabled on all tables.
          </p>
          <div className="flex items-center gap-2 text-sage">
            <Shield className="w-4 h-4" />
            <span className="font-montserrat text-xs">Row Level Security Enabled</span>
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="bg-gradient-sage rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <SettingsIcon className="w-5 h-5" />
          <h2 className="font-montserrat text-sm font-semibold uppercase tracking-wider">
            Need Help?
          </h2>
        </div>
        <p className="font-montserrat text-sm opacity-90 leading-relaxed">
          For assistance with the admin dashboard or to report any issues, please contact your
          developer or system administrator.
        </p>
      </div>
    </div>
  );
}
