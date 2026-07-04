import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Plus, Search, Edit2, Trash2, X, Save, Percent, DollarSign,
  Calendar, Hash, ToggleLeft, ToggleRight, Copy, Check, Loader2, AlertCircle
} from 'lucide-react';

interface DiscountCode {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase_amount: number;
  max_discount_amount: number | null;
  usage_limit: number | null;
  usage_count: number;
  applicable_programmes: string[] | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

interface Programme {
  id: string;
  title: string;
}

export default function DiscountCodesPage() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 10,
    min_purchase_amount: 0,
    max_discount_amount: null as number | null,
    usage_limit: null as number | null,
    applicable_programmes: [] as string[],
    expires_at: '',
    is_active: true,
  });

  useEffect(() => {
    fetchCodes();
    fetchProgrammes();
  }, []);

  async function fetchCodes() {
    setLoading(true);
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching discount codes:', error);
    } else {
      setCodes(data || []);
    }
    setLoading(false);
  }

  async function fetchProgrammes() {
    const { data, error } = await supabase
      .from('programmes')
      .select('id, title')
      .eq('is_active', true)
      .order('title');

    if (error) {
      console.error('Error fetching programmes:', error);
    } else {
      setProgrammes(data || []);
    }
  }

  function generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code }));
  }

  function resetForm() {
    setFormData({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 10,
      min_purchase_amount: 0,
      max_discount_amount: null,
      usage_limit: null,
      applicable_programmes: [],
      expires_at: '',
      is_active: true,
    });
  }

  async function handleSave() {
    if (!formData.code) return;

    const payload = {
      code: formData.code.toUpperCase(),
      description: formData.description || null,
      discount_type: formData.discount_type,
      discount_value: formData.discount_value,
      min_purchase_amount: formData.min_purchase_amount,
      max_discount_amount: formData.max_discount_amount,
      usage_limit: formData.usage_limit,
      applicable_programmes: formData.applicable_programmes.length > 0 ? formData.applicable_programmes : null,
      expires_at: formData.expires_at || null,
      is_active: formData.is_active,
    };

    if (editingCode) {
      const { error } = await supabase
        .from('discount_codes')
        .update(payload)
        .eq('id', editingCode.id);

      if (error) {
        console.error('Error updating code:', error);
        alert('Failed to update discount code');
      } else {
        setEditingCode(null);
        resetForm();
        fetchCodes();
      }
    } else {
      const { error } = await supabase
        .from('discount_codes')
        .insert(payload);

      if (error) {
        console.error('Error creating code:', error);
        alert('Failed to create discount code: ' + error.message);
      } else {
        setIsCreating(false);
        resetForm();
        fetchCodes();
      }
    }
  }

  function handleEdit(code: DiscountCode) {
    setEditingCode(code);
    setIsCreating(false);
    setFormData({
      code: code.code,
      description: code.description || '',
      discount_type: code.discount_type,
      discount_value: code.discount_value,
      min_purchase_amount: code.min_purchase_amount,
      max_discount_amount: code.max_discount_amount,
      usage_limit: code.usage_limit,
      applicable_programmes: code.applicable_programmes || [],
      expires_at: code.expires_at ? code.expires_at.split('T')[0] : '',
      is_active: code.is_active,
    });
  }

  async function handleDelete(id: string) {
    const { error } = await supabase
      .from('discount_codes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting code:', error);
      alert('Failed to delete discount code');
    } else {
      setDeleteConfirm(null);
      fetchCodes();
    }
  }

  async function toggleActive(code: DiscountCode) {
    const { error } = await supabase
      .from('discount_codes')
      .update({ is_active: !code.is_active })
      .eq('id', code.id);

    if (error) {
      console.error('Error toggling code:', error);
    } else {
      fetchCodes();
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  const filteredCodes = codes.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-text-heading">Discount Codes</h1>
          <p className="font-montserrat text-sm text-text-body mt-1">
            Create and manage promotional codes for bookings
          </p>
        </div>
        <button
          onClick={() => { setIsCreating(true); setEditingCode(null); resetForm(); }}
          className="btn-primary text-sm px-5 py-2.5"
        >
          <Plus size={16} />
          Create Code
        </button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingCode) && (
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-playfair text-lg font-bold text-text-heading">
              {editingCode ? 'Edit Discount Code' : 'Create Discount Code'}
            </h2>
            <button
              onClick={() => { setEditingCode(null); setIsCreating(false); resetForm(); }}
              className="p-2 rounded-lg hover:bg-sage/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Code */}
            <div>
              <label className="block font-montserrat text-sm font-semibold text-text-heading mb-2">
                Code *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.code}
                  onChange={e => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g., SAVE20"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-sage/30 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-sage-dark"
                />
                <button
                  type="button"
                  onClick={generateCode}
                  className="px-4 py-2.5 rounded-xl bg-sage/10 text-sage-dark font-montserrat text-sm font-medium hover:bg-sage/20 transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Discount Type */}
            <div>
              <label className="block font-montserrat text-sm font-semibold text-text-heading mb-2">
                Discount Type *
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, discount_type: 'percentage' }))}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-montserrat text-sm transition-colors ${
                    formData.discount_type === 'percentage'
                      ? 'bg-sage-dark text-white'
                      : 'bg-sage/10 text-text-body hover:bg-sage/20'
                  }`}
                >
                  <Percent size={16} />
                  Percentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, discount_type: 'fixed' }))}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-montserrat text-sm transition-colors ${
                    formData.discount_type === 'fixed'
                      ? 'bg-sage-dark text-white'
                      : 'bg-sage/10 text-text-body hover:bg-sage/20'
                  }`}
                >
                  <DollarSign size={16} />
                  Fixed Amount (£)
                </button>
              </div>
            </div>

            {/* Discount Value */}
            <div>
              <label className="block font-montserrat text-sm font-semibold text-text-heading mb-2">
                {formData.discount_type === 'percentage' ? 'Discount %' : 'Discount Amount (£)'} *
              </label>
              <input
                type="number"
                value={formData.discount_value}
                onChange={e => setFormData(prev => ({ ...prev, discount_value: parseFloat(e.target.value) || 0 }))}
                min={formData.discount_type === 'percentage' ? 1 : 1}
                max={formData.discount_type === 'percentage' ? 100 : undefined}
                step={formData.discount_type === 'percentage' ? 1 : 0.01}
                className="w-full px-4 py-2.5 rounded-xl border border-sage/30 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-sage-dark"
              />
            </div>

            {/* Usage Limit */}
            <div>
              <label className="block font-montserrat text-sm font-semibold text-text-heading mb-2">
                Usage Limit (optional)
              </label>
              <input
                type="number"
                value={formData.usage_limit || ''}
                onChange={e => setFormData(prev => ({ ...prev, usage_limit: e.target.value ? parseInt(e.target.value) : null }))}
                placeholder="Unlimited"
                min={1}
                className="w-full px-4 py-2.5 rounded-xl border border-sage/30 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-sage-dark"
              />
            </div>

            {/* Min Purchase */}
            <div>
              <label className="block font-montserrat text-sm font-semibold text-text-heading mb-2">
                Minimum Purchase (£)
              </label>
              <input
                type="number"
                value={formData.min_purchase_amount}
                onChange={e => setFormData(prev => ({ ...prev, min_purchase_amount: parseFloat(e.target.value) || 0 }))}
                min={0}
                step={0.01}
                className="w-full px-4 py-2.5 rounded-xl border border-sage/30 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-sage-dark"
              />
            </div>

            {/* Max Discount */}
            <div>
              <label className="block font-montserrat text-sm font-semibold text-text-heading mb-2">
                Max Discount Amount (£) (optional)
              </label>
              <input
                type="number"
                value={formData.max_discount_amount || ''}
                onChange={e => setFormData(prev => ({ ...prev, max_discount_amount: e.target.value ? parseFloat(e.target.value) : null }))}
                placeholder="No maximum"
                min={1}
                step={0.01}
                className="w-full px-4 py-2.5 rounded-xl border border-sage/30 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-sage-dark"
              />
            </div>

            {/* Expires At */}
            <div>
              <label className="block font-montserrat text-sm font-semibold text-text-heading mb-2">
                Expiration Date (optional)
              </label>
              <input
                type="date"
                value={formData.expires_at}
                onChange={e => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 rounded-xl border border-sage/30 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-sage-dark text-left"
                dir="ltr"
              />
            </div>

            {/* Applicable Programmes */}
            <div>
              <label className="block font-montserrat text-sm font-semibold text-text-heading mb-2">
                Apply to Programmes (optional)
              </label>
              <select
                multiple
                value={formData.applicable_programmes}
                onChange={e => {
                  const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                  setFormData(prev => ({ ...prev, applicable_programmes: selected }));
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-sage/30 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-sage-dark h-24"
              >
                {programmes.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-text-small">Hold Ctrl/Cmd to select multiple. Leave empty for all programmes.</p>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block font-montserrat text-sm font-semibold text-text-heading mb-2">
                Description (internal use)
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Summer promotion for new clients"
                className="w-full px-4 py-2.5 rounded-xl border border-sage/30 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-sage-dark"
              />
            </div>

            {/* Active Toggle */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    formData.is_active ? 'bg-sage-dark' : 'bg-sage/30'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                    formData.is_active ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
                <span className="font-montserrat text-sm text-text-body">
                  {formData.is_active ? 'Active' : 'Inactive'}
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-sage/20">
            <button
              onClick={handleSave}
              className="btn-primary text-sm px-5 py-2.5"
            >
              <Save size={16} />
              {editingCode ? 'Update Code' : 'Create Code'}
            </button>
            <button
              onClick={() => { setEditingCode(null); setIsCreating(false); resetForm(); }}
              className="px-5 py-2.5 rounded-xl font-montserrat text-sm font-medium text-text-body hover:bg-sage/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-small" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search codes..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-sage/30 font-montserrat text-sm focus:outline-none focus:ring-2 focus:ring-sage-dark"
        />
      </div>

      {/* Codes List */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-sage-dark" />
          </div>
        ) : filteredCodes.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="w-16 h-16 rounded-2xl bg-sage/10 flex items-center justify-center mx-auto mb-4">
              <Hash className="w-8 h-8 text-sage-dark" />
            </div>
            <p className="font-montserrat text-text-body">
              {search ? 'No codes match your search' : 'No discount codes yet'}
            </p>
            {!search && (
              <button
                onClick={() => { setIsCreating(true); resetForm(); }}
                className="mt-4 font-montserrat text-sm text-sage-dark font-medium hover:underline"
              >
                Create your first code
              </button>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-sage/20">
                <th className="text-left px-6 py-4 font-montserrat text-xs font-semibold text-text-body uppercase tracking-wider">Code</th>
                <th className="text-left px-6 py-4 font-montserrat text-xs font-semibold text-text-body uppercase tracking-wider">Discount</th>
                <th className="text-left px-6 py-4 font-montserrat text-xs font-semibold text-text-body uppercase tracking-wider">Usage</th>
                <th className="text-left px-6 py-4 font-montserrat text-xs font-semibold text-text-body uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 font-montserrat text-xs font-semibold text-text-body uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCodes.map(code => (
                <tr key={code.id} className="border-b border-sage/10 hover:bg-sage/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-montserrat text-sm font-bold text-text-heading">{code.code}</span>
                      <button
                        onClick={() => copyToClipboard(code.code)}
                        className="p-1 rounded hover:bg-sage/10 transition-colors"
                      >
                        {copiedCode === code.code ? (
                          <Check className="w-4 h-4 text-sage-dark" />
                        ) : (
                          <Copy className="w-4 h-4 text-text-small" />
                        )}
                      </button>
                    </div>
                    {code.description && (
                      <p className="font-montserrat text-xs text-text-small mt-0.5">{code.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-montserrat text-sm text-text-body">
                      {code.discount_type === 'percentage'
                        ? `${code.discount_value}% off`
                        : `£${code.discount_value.toFixed(2)} off`
                      }
                    </span>
                    {code.max_discount_amount && (
                      <p className="font-montserrat text-xs text-text-small">Max £{code.max_discount_amount}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-montserrat text-sm text-text-body">
                      {code.usage_count}
                      {code.usage_limit && ` / ${code.usage_limit}`}
                    </div>
                    {code.usage_limit && code.usage_count >= code.usage_limit && (
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-600 font-montserrat text-xs">Limit reached</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {isExpired(code.expires_at) && (
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-montserrat text-xs">Expired</span>
                      )}
                      {!isExpired(code.expires_at) && code.is_active ? (
                        <span className="px-2 py-0.5 rounded bg-sage/10 text-sage-dark font-montserrat text-xs">Active</span>
                      ) : !isExpired(code.expires_at) && (
                        <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 font-montserrat text-xs">Inactive</span>
                      )}
                      {code.expires_at && !isExpired(code.expires_at) && (
                        <p className="font-montserrat text-xs text-text-small flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Expires {new Date(code.expires_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleActive(code)}
                        className="p-2 rounded-lg hover:bg-sage/10 transition-colors"
                        title={code.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {code.is_active ? (
                          <ToggleRight className="w-5 h-5 text-sage-dark" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-text-small" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(code)}
                        className="p-2 rounded-lg hover:bg-sage/10 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-text-body" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(code.id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>

                    {/* Delete Confirmation */}
                    {deleteConfirm === code.id && (
                      <div className="absolute right-6 mt-2 bg-white rounded-xl shadow-luxury border border-sage/20 p-4 z-10">
                        <p className="font-montserrat text-sm text-text-heading mb-3">Delete this code?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(code.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-500 text-white font-montserrat text-sm font-medium hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1.5 rounded-lg bg-sage/10 font-montserrat text-sm font-medium hover:bg-sage/20 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
