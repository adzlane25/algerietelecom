import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGlobalTheme } from '../contexts/GlobalThemeContext';
import { useTranslation } from 'react-i18next';
import { Building2, Plus, Edit, Trash2, X, Check, Mail, Phone, MapPin, Search, RefreshCw, Printer, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Companies = () => {
  const { api } = useAuth();
  const { neonPrimary } = useGlobalTheme();
  const { t } = useTranslation();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    fax: '',
    address: '',
    is_active: true
  });

  useEffect(() => { fetchCompanies(); }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await api.get('/companies');
      setCompanies(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error(t('error_loading_data'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error(t('name_required'));
      return;
    }
    
    if (!formData.email) {
      toast.error('البريد الإلكتروني مطلوب');
      return;
    }
    
    if (!editing && !formData.password) {
      toast.error('كلمة السر مطلوبة للمؤسسة الجديدة');
      return;
    }
    
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        fax: formData.fax,
        address: formData.address,
        is_active: formData.is_active
      };
      
      if (formData.password) {
        payload.password = formData.password;
      }
      
      if (editing) {
        await api.put(`/companies/${editing.id}`, payload);
        toast.success(t('company_updated'));
      } else {
        await api.post('/companies', payload);
        toast.success(`✅ تم إنشاء المؤسسة بنجاح.\n📧 البريد: ${formData.email}\n🔑 كلمة السر: ${formData.password}`);
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ name: '', email: '', password: '', phone: '', fax: '', address: '', is_active: true });
      fetchCompanies();
    } catch (error) {
      toast.error(error.response?.data?.message || t('operation_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(t('confirm_delete_company', { name }))) {
      try {
        await api.delete(`/companies/${id}`);
        toast.success(t('company_deleted'));
        fetchCompanies();
      } catch (error) {
        toast.error(t('operation_failed'));
      }
    }
  };

  const handleArchive = async (id, isActive) => {
    try {
      await api.put(`/companies/${id}`, { is_active: !isActive });
      toast.success(isActive ? t('company_archived') : t('company_restored'));
      fetchCompanies();
    } catch (error) {
      toast.error(t('operation_failed'));
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    let tableRows = '';
    filteredCompanies.forEach((company, idx) => {
      tableRows += `
        <tr>
          <td style="text-align:center">${idx + 1}</td>
          <td>${company.name}</td>
          <td>${company.email || '-'}</td>
          <td>${company.phone || '-'}</td>
          <td>${company.fax || '-'}</td>
          <td>${company.is_active ? 'نشط' : 'غير نشط'}</td>
        </tr>
      `;
    });
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
        <head><meta charset="UTF-8"><title>تقرير المؤسسات - اتصالات الجزائر</title>
        <style>
          body { font-family: 'Cairo', sans-serif; padding: 40px; background: white; direction: rtl; }
          .header { text-align: center; margin-bottom: 30px; }
          h2 { color: #006633; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: right; }
          th { background: #f5f5f5; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #999; }
        </style>
        </head>
        <body>
          <div class="header"><h2>اتصالات الجزائر - قسنطينة</h2><h3>تقرير المؤسسات</h3><p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-EG')}</p></div>
          <table><thead><tr><th>#</th><th>اسم المؤسسة</th><th>البريد الإلكتروني</th><th>الهاتف</th><th>الفاكس</th><th>الحالة</th></tr></thead><tbody>${tableRows}</tbody></table>
          <div class="footer">تم الطباعة من نظام اتصالات الجزائر - قسنطينة</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  const filteredCompanies = companies.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>{t('loading')}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: '24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
            <Building2 size={28} style={{ color: neonPrimary }} /> {t('companies')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{t('manage_companies')}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" onClick={handlePrint} style={{ padding: '10px 20px', borderRadius: '40px' }}>
            <Printer size={18} /> {t('print')}
          </button>
          <button className="btn-primary" onClick={() => { setEditing(null); setFormData({ name: '', email: '', password: '', phone: '', fax: '', address: '', is_active: true }); setShowModal(true); }}>
            <Plus size={18} /> {t('add_company')}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div className="stat-card-mini" style={{ background: 'var(--bg-surface)', padding: '16px 24px', borderRadius: '20px', border: `1px solid ${neonPrimary}20`, flex: 1, minWidth: '150px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: neonPrimary }}>{companies.length}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t('total_companies')}</div>
        </div>
        <div className="stat-card-mini" style={{ background: 'var(--bg-surface)', padding: '16px 24px', borderRadius: '20px', border: `1px solid #10b98120`, flex: 1, minWidth: '150px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>{companies.filter(c => c.is_active).length}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t('active_companies')}</div>
        </div>
        <div className="stat-card-mini" style={{ background: 'var(--bg-surface)', padding: '16px 24px', borderRadius: '20px', border: `1px solid #f59e0b20`, flex: 1, minWidth: '150px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>{companies.filter(c => !c.is_active).length}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t('archived_companies')}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            className="neon-input"
            placeholder={t('search_companies')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingRight: '40px' }}
          />
        </div>
        <button className="btn-outline" onClick={fetchCompanies} style={{ padding: '12px 20px', borderRadius: '40px' }}>
          <RefreshCw size={18} /> {t('refresh')}
        </button>
      </div>

      <div className="table-wrapper">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>{t('name')}</th>
              <th>{t('email')}</th>
              <th>{t('phone')}</th>
              <th>الفاكس</th>
              <th>{t('status')}</th>
              <th style={{ textAlign: 'center' }}>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                  <Building2 size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                  <p>{t('no_companies')}</p>
                </td>
              </tr>
            ) : (
              filteredCompanies.map((company, idx) => (
                <motion.tr
                  key={company.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ backgroundColor: 'var(--border)' }}
                >
                  <td style={{ direction: 'ltr' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 500 }}>{company.name}</td>
                  <td dir="ltr">{company.email || '—'}</td>
                  <td dir="ltr">{company.phone || '—'}</td>
                  <td dir="ltr">{company.fax || '—'}</td>
                  <td>
                    <span className={`badge ${company.is_active ? 'badge-approved' : 'badge-pending'}`}>
                      {company.is_active ? t('active') : t('archived')}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button className="icon-btn-sm" onClick={() => { setEditing(company); setFormData({ ...company, password: '' }); setShowModal(true); }} title={t('edit')}>
                        <Edit size={16} />
                      </button>
                      <button className="icon-btn-sm" onClick={() => handleArchive(company.id, company.is_active)} title={company.is_active ? t('archive') : t('restore')}>
                        {company.is_active ? <X size={16} /> : <Check size={16} />}
                      </button>
                      <button className="icon-btn-sm" style={{ color: '#ef4444' }} onClick={() => handleDelete(company.id, company.name)} title={t('delete')}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: neonPrimary }}>{editing ? t('edit_company') : t('add_company')}</h2>
                <button className="icon-btn-sm" onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>اسم المؤسسة *</label>
                  <input type="text" className="neon-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                
                <div className="form-group">
                  <label>البريد الإلكتروني *</label>
                  <input type="email" className="neon-input" dir="ltr" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  <small style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>سيستخدم هذا البريد لتسجيل الدخول</small>
                </div>
                
                <div className="form-group">
                  <label>كلمة السر {!editing && '*'}</label>
                  <input 
                    type="password" 
                    className="neon-input" 
                    dir="ltr" 
                    value={formData.password} 
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                    required={!editing}
                  />
                  {!editing && (
                    <small style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                      سيستخدم هذه كلمة السر لتسجيل الدخول
                    </small>
                  )}
                </div>
                
                <div className="form-group">
                  <label>رقم الهاتف</label>
                  <input type="tel" className="neon-input" dir="ltr" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="05XXXXXXXX" />
                  <small style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>10 أرقام، يبدأ بـ 05 أو 06 أو 07</small>
                </div>
                
                <div className="form-group">
                  <label>الفاكس</label>
                  <input type="tel" className="neon-input" dir="ltr" value={formData.fax} onChange={(e) => setFormData({ ...formData, fax: e.target.value })} />
                </div>
                
                <div className="form-group">
                  <label>العنوان</label>
                  <input type="text" className="neon-input" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
                
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
                    نشط
                  </label>
                </div>
                
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '40px' }} disabled={submitting}>
                  {submitting ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : (editing ? 'حفظ التغييرات' : 'إضافة مؤسسة')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Companies;