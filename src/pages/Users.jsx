import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGlobalTheme } from '../contexts/GlobalThemeContext';
import { useTranslation } from 'react-i18next';
import { Users, Plus, Edit, Trash2, X, Search, RefreshCw, UserCog, HardHat, Building2, Mail, Phone, Printer, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const UsersPage = () => {
  const { api, user: currentUser, isAdmin } = useAuth();
  const { neonPrimary } = useGlobalTheme();
  const { t } = useTranslation();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'technician',
    password: '',
    phone: '',
    is_active: true
  });
  const [companies, setCompanies] = useState([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error(t('error_loading_data'));
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to load companies:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCompanies();
  }, []);

  const validatePhone = (phone) => {
    if (!phone) return true;
    const phoneRegex = /^(05|06|07)[0-9]{8}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error(t('fill_required_fields'));
      return;
    }
    
    if (!editingUser && !formData.password) {
      toast.error('كلمة السر مطلوبة للمستخدم الجديد');
      return;
    }
    
    if (formData.phone && !validatePhone(formData.phone)) {
      toast.error('رقم الهاتف يجب أن يكون 10 أرقام ويبدأ بـ 05 أو 06 أو 07');
      return;
    }
    
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email.toLowerCase(),
        role: formData.role,
        phone: formData.phone,
        is_active: formData.is_active
      };
      
      // ✅ إضافة كلمة السر فقط إذا تم إدخالها (جديدة أو تغيير)
      if (formData.password) {
        payload.password = formData.password;
      }
      
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, payload);
        toast.success('✅ تم تحديث المستخدم بنجاح');
      } else {
        const response = await api.post('/users', payload);
        toast.success(`✅ تم إنشاء المستخدم بنجاح\n📧 البريد: ${formData.email}\n🔑 كلمة السر: ${formData.password}`);
      }
      
      setShowModal(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'technician', password: '', phone: '', is_active: true });
      fetchUsers();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || t('operation_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(t('confirm_delete_user', { name }))) {
      try {
        await api.delete(`/users/${id}`);
        toast.success(t('user_deleted'));
        fetchUsers();
      } catch (error) {
        toast.error(t('operation_failed'));
      }
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    let tableRows = '';
    filteredUsers.forEach((user, idx) => {
      tableRows += `
        <tr>
          <td style="text-align:center">${idx + 1}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.phone || '-'}</td>
          <td>${user.role === 'admin' ? 'مسؤول تقني' : user.role === 'technician' ? 'فني' : 'مؤسسة'}</td>
          <td>${user.is_active ? 'نشط' : 'غير نشط'}</td>
        </tr>
      `;
    });
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
        <head><meta charset="UTF-8"><title>تقرير المستخدمين - اتصالات الجزائر</title>
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
          <div class="header"><h2>اتصالات الجزائر - قسنطينة</h2><h3>تقرير المستخدمين</h3><p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-EG')}</p></div>
          <table><thead><tr><th>#</th><th>الاسم</th><th>البريد الإلكتروني</th><th>الهاتف</th><th>الدور</th><th>الحالة</th></tr></thead><tbody>${tableRows}</tbody></table>
          <div class="footer">تم الطباعة من نظام اتصالات الجزائر - قسنطينة</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const getRoleIcon = (role) => {
    if (role === 'admin') return <UserCog size={16} />;
    if (role === 'technician') return <HardHat size={16} />;
    return <Building2 size={16} />;
  };

  const getRoleName = (role) => {
    if (role === 'admin') return t('role_admin');
    if (role === 'technician') return t('role_technician');
    return t('role_company');
  };

  const getRoleClass = (role) => {
    if (role === 'admin') return 'badge-urgent';
    if (role === 'technician') return 'badge-high';
    return 'badge-approved';
  };

  const toggleShowPassword = (userId) => {
    setShowPassword(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Users size={28} style={{ color: neonPrimary }} /> {t('users')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{t('manage_users')}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" onClick={handlePrint} style={{ padding: '10px 20px', borderRadius: '40px' }}>
            <Printer size={18} /> {t('print')}
          </button>
          <button className="btn-primary" onClick={() => { setEditingUser(null); setFormData({ name: '', email: '', role: 'technician', password: '', phone: '', is_active: true }); setShowModal(true); }}>
            <Plus size={18} /> {t('add_user')}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div className="stat-card-mini" style={{ background: 'var(--bg-surface)', padding: '16px 24px', borderRadius: '20px', border: `1px solid ${neonPrimary}20`, flex: 1 }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: neonPrimary }}>{users.length}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t('total_users')}</div>
        </div>
        <div className="stat-card-mini" style={{ background: 'var(--bg-surface)', padding: '16px 24px', borderRadius: '20px', border: `1px solid #ef444420`, flex: 1 }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444' }}>{users.filter(u => u.role === 'admin').length}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t('admins')}</div>
        </div>
        <div className="stat-card-mini" style={{ background: 'var(--bg-surface)', padding: '16px 24px', borderRadius: '20px', border: `1px solid #f59e0b20`, flex: 1 }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>{users.filter(u => u.role === 'technician').length}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t('technicians')}</div>
        </div>
        <div className="stat-card-mini" style={{ background: 'var(--bg-surface)', padding: '16px 24px', borderRadius: '20px', border: `1px solid #10b98120`, flex: 1 }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>{users.filter(u => u.role === 'company').length}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t('companies')}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            className="neon-input"
            placeholder={t('search_users')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingRight: '40px' }}
          />
        </div>
        <button className="btn-outline" onClick={fetchUsers} style={{ padding: '12px 20px', borderRadius: '40px' }}>
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
              <th>{t('role')}</th>
              <th>{t('status')}</th>
              {isAdmin() && <th>كلمة السر</th>}
              <th style={{ textAlign: 'center' }}>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={isAdmin() ? 8 : 7} style={{ textAlign: 'center', padding: '40px' }}>
                  <Users size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                  <p>{t('no_users')}</p>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ backgroundColor: 'var(--border)' }}
                >
                  <td style={{ direction: 'ltr' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 500 }}>{user.name}</td>
                  <td dir="ltr">{user.email}</td>
                  <td dir="ltr">{user.phone || '—'}</td>
                  <td>
                    <span className={`badge ${getRoleClass(user.role)}`}>
                      {getRoleName(user.role)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${user.is_active ? 'badge-approved' : 'badge-pending'}`}>
                      {user.is_active ? t('active') : t('inactive')}
                    </span>
                  </td>
                  {isAdmin() && (
                    <td>
                      <button
                        className="icon-btn-sm"
                        onClick={() => toggleShowPassword(user.id)}
                        title="إظهار/إخفاء كلمة السر"
                      >
                        {showPassword[user.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <span style={{ fontFamily: 'monospace', fontSize: '12px', marginLeft: '8px' }}>
                        {showPassword[user.id] ? (user.password_preview || '********') : '********'}
                      </span>
                    </td>
                  )}
                  <td>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        className="icon-btn-sm"
                        onClick={() => {
                          setEditingUser(user);
                          setFormData({ ...user, password: '' });
                          setShowModal(true);
                        }}
                        title={t('edit')}
                      >
                        <Edit size={16} />
                      </button>
                      {currentUser?.id !== user.id && (
                        <button
                          className="icon-btn-sm"
                          style={{ color: '#ef4444' }}
                          onClick={() => handleDelete(user.id, user.name)}
                          title={t('delete')}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
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
          <motion.div className="modal-overlay" onClick={() => setShowModal(false)}>
            <motion.div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: neonPrimary }}>{editingUser ? t('edit_user') : t('add_user')}</h2>
                <button className="icon-btn-sm" onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>{t('name')} *</label>
                  <input type="text" className="neon-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                
                <div className="form-group">
                  <label>{t('email')} *</label>
                  <input type="email" className="neon-input" dir="ltr" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  <small style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>مثال: company@gmail.com</small>
                </div>
                
                <div className="form-group">
                  <label>{t('phone')}</label>
                  <input type="tel" className="neon-input" dir="ltr" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="05XXXXXXXX" />
                  <small style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>10 أرقام، يبدأ بـ 05 أو 06 أو 07</small>
                </div>
                
                <div className="form-group">
                  <label>{t('role')} *</label>
                  <select className="neon-input" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                    <option value="admin">{t('role_admin')}</option>
                    <option value="technician">{t('role_technician')}</option>
                    <option value="company">{t('role_company')}</option>
                  </select>
                </div>
                
                {formData.role === 'company' && (
                  <div className="form-group">
                    <label>{t('company')}</label>
                    <select className="neon-input" value={formData.company_id || ''} onChange={(e) => setFormData({ ...formData, company_id: parseInt(e.target.value) })}>
                      <option value="">اختر مؤسسة</option>
                      {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                )}
                
                <div className="form-group">
                  <label>
                    {editingUser ? 'كلمة السر الجديدة (اختياري)' : 'كلمة السر *'}
                    {!editingUser && <span style={{ color: '#ef4444' }}> *</span>}
                  </label>
                  <input 
                    type="password" 
                    className="neon-input" 
                    dir="ltr" 
                    value={formData.password} 
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                    required={!editingUser} 
                    placeholder={!editingUser ? "أدخل كلمة السر للمستخدم الجديد" : "اتركه فارغاً إذا لا تريد التغيير"}
                  />
                  {!editingUser && (
                    <small style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                      سيستخدم هذه كلمة السر لتسجيل الدخول
                    </small>
                  )}
                  {editingUser && (
                    <small style={{ color: '#f59e0b', fontSize: '11px' }}>
                      ⚠️ إذا تركت الحقل فارغاً، ستبقى كلمة السر القديمة كما هي
                    </small>
                  )}
                </div>
                
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
                    {t('active')}
                  </label>
                </div>
                
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '40px' }} disabled={submitting}>
                  {submitting ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : (editingUser ? t('save') : t('add'))}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UsersPage;