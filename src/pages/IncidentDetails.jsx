import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGlobalTheme } from '../contexts/GlobalThemeContext';
import { useTranslation } from 'react-i18next';
import { ArrowRight, AlertCircle, CheckCircle, Clock, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

const IncidentDetails = () => {
  const { id } = useParams();
  const { api, isAdmin } = useAuth();
  const { neonPrimary } = useGlobalTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchIncident();
      if (isAdmin()) {
        fetchTechnicians();
      }
    }
  }, [id]);

  const fetchIncident = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('جاري جلب البلاغ رقم:', id);
      
      const response = await api.get(`/incidents/${id}`);
      console.log('الرد من الخادم:', response.data);
      
      setIncident(response.data);
    } catch (error) {
      console.error('فشل تحميل البلاغ:', error);
      setError(error.response?.data?.message || 'فشل في تحميل البلاغ');
      toast.error('فشل في تحميل البلاغ');
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const response = await api.get('/users?role=technician');
      setTechnicians(response.data.data || []);
    } catch (error) {
      console.error('Failed to load technicians:', error);
    }
  };

  const handleApprove = async () => {
    if (!selectedTechnician) {
      toast.error('الرجاء اختيار فني');
      return;
    }
    try {
      await api.post(`/incidents/${incident.id}/approve`, {
        technician_id: selectedTechnician,
        admin_notes: adminNotes
      });
      toast.success('✅ تم قبول البلاغ وإسناده للفني');
      setShowAssignModal(false);
      setSelectedTechnician('');
      setAdminNotes('');
      fetchIncident();
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل قبول البلاغ');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      toast.error('الرجاء كتابة سبب الرفض');
      return;
    }
    try {
      await api.post(`/incidents/${incident.id}/reject`, {
        rejection_reason: rejectionReason
      });
      toast.success('❌ تم رفض البلاغ');
      setShowRejectModal(false);
      setRejectionReason('');
      fetchIncident();
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل رفض البلاغ');
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // ✅ دالة الطباعة الجديدة مع شعار copepa.png وتنسيق احترافي
  const handlePrint = () => {
    if (!incident) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>Fiche d'Intervention - اتصالات الجزائر</title>
          <style>
            body { font-family: 'Cairo', sans-serif; padding: 40px; background: white; direction: rtl; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #006633; padding-bottom: 20px; }
            .logo-img { width: 100px; height: auto; margin-bottom: 10px; }
            h2 { color: #006633; margin: 10px 0; }
            h3 { color: #1e293b; margin-bottom: 20px; }
            .content { border: 1px solid #ddd; padding: 20px; border-radius: 16px; margin-top: 20px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
            .info-row { display: flex; margin: 10px 0; }
            .info-label { font-weight: bold; width: 120px; }
            .info-value { flex: 1; }
            .priority-badge { display: inline-block; padding: 5px 15px; border-radius: 30px; font-size: 14px; }
            .priority-urgent { background: #fef2f2; color: #dc2626; }
            .priority-high { background: #fff7ed; color: #ea580c; }
            .priority-medium { background: #fffbeb; color: #d97706; }
            .priority-low { background: #f0fdf4; color: #16a34a; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="http://localhost:8000/images/copepa.png" class="logo-img" alt="شعار اتصالات الجزائر" onerror="this.style.display='none'">
            <h2>اتصالات الجزائر - قسنطينة</h2>
            <h3>${incident.title}</h3>
          </div>

          <div class="content">
            <div class="info-row"><div class="info-label">رقم البلاغ:</div><div class="info-value">${incident.id}</div></div>
            <div class="info-row"><div class="info-label">الوصف:</div><div class="info-value">${incident.description}</div></div>
            <div class="info-row"><div class="info-label">الحالة:</div><div class="info-value">${incident.status === 'in_progress' ? 'قيد المعالجة' : incident.status === 'completed' ? 'مكتمل' : incident.status === 'approved' ? 'مقبول' : incident.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}</div></div>
            <div class="info-row"><div class="info-label">الأولوية:</div><div class="info-value"><span class="priority-badge priority-${incident.priority}">${incident.priority === 'urgent' ? 'عاجل' : incident.priority === 'high' ? 'مرتفع' : incident.priority === 'medium' ? 'متوسط' : 'منخفض'}</span></div></div>
            <div class="info-row"><div class="info-label">تاريخ الإنشاء:</div><div class="info-value">${formatDate(incident.created_at)}</div></div>
            ${incident.company_name ? `<div class="info-row"><div class="info-label">المؤسسة:</div><div class="info-value">${incident.company_name}</div></div>` : ''}
            ${incident.technician_name ? `<div class="info-row"><div class="info-label">الفني:</div><div class="info-value">${incident.technician_name}</div></div>` : ''}
            ${incident.admin_notes ? `<div class="info-row"><div class="info-label">ملاحظات المسؤول:</div><div class="info-value">${incident.admin_notes}</div></div>` : ''}
            ${incident.rejection_reason ? `<div class="info-row"><div class="info-label">سبب الرفض:</div><div class="info-value" style="color:#dc2626">${incident.rejection_reason}</div></div>` : ''}
          </div>

          <div class="footer">
            <p>© ${new Date().getFullYear()} اتصالات الجزائر - جميع الحقوق محفوظة</p>
            <p>📞 031 12 34 56 | ✉️ support@algerietelecom.dz</p>
            <p>تاريخ الطباعة: ${formatDate(new Date())}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const getStatusBadge = () => {
    if (!incident) return null;
    const status = incident.status;
    if (status === 'completed') return <span className="badge-completed"><CheckCircle size={14} /> {t('completed')}</span>;
    if (status === 'in_progress') return <span className="badge-progress"><Clock size={14} /> {t('in_progress')}</span>;
    if (status === 'approved') return <span className="badge-approved">مقبول</span>;
    if (status === 'rejected') return <span className="badge-rejected">مرفوض</span>;
    return <span className="badge-pending"><AlertCircle size={14} /> {t('pending')}</span>;
  };

  const getPriorityBadge = () => {
    if (!incident) return null;
    const priority = incident.priority;
    if (priority === 'urgent') return <span className="badge-urgent">{t('priority_urgent')}</span>;
    if (priority === 'high') return <span className="badge-high">{t('priority_high')}</span>;
    if (priority === 'medium') return <span className="badge-medium">{t('priority_medium')}</span>;
    return <span className="badge-low">{t('priority_low')}</span>;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>جاري تحميل البلاغ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: '#ef4444' }}>{error}</p>
        <button className="btn-primary" onClick={() => navigate('/incidents')} style={{ marginTop: '16px' }}>
          العودة إلى البلاغات
        </button>
      </div>
    );
  }

  if (!incident) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>البلاغ غير موجود</p>
        <button className="btn-primary" onClick={() => navigate('/incidents')} style={{ marginTop: '16px' }}>
          العودة إلى البلاغات
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ padding: '24px' }}>
      <button className="btn-outline" onClick={() => navigate('/incidents')} style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ArrowRight size={18} /> العودة إلى البلاغات
      </button>

      <div style={{ background: 'var(--bg-surface)', borderRadius: '32px', padding: '32px', border: `1px solid ${neonPrimary}20` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>{incident.title}</h1>
          <button className="btn-outline" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '40px' }}>
            <Printer size={18} /> طباعة
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label style={{ color: 'var(--text-secondary)' }}>الحالة</label>
            <div style={{ marginTop: '8px' }}>{getStatusBadge()}</div>
          </div>
          <div>
            <label style={{ color: 'var(--text-secondary)' }}>الأولوية</label>
            <div style={{ marginTop: '8px' }}>{getPriorityBadge()}</div>
          </div>
          {incident.company && (
            <div>
              <label style={{ color: 'var(--text-secondary)' }}>المؤسسة</label>
              <div style={{ marginTop: '8px', fontWeight: '500' }}>{incident.company.name}</div>
            </div>
          )}
          <div>
            <label style={{ color: 'var(--text-secondary)' }}>تاريخ الإنشاء</label>
            <div style={{ marginTop: '8px', fontWeight: '500' }}>{formatDate(incident.created_at)}</div>
          </div>
          {incident.technician && (
            <div>
              <label style={{ color: 'var(--text-secondary)' }}>الفني المسند</label>
              <div style={{ marginTop: '8px', fontWeight: '500' }}>{incident.technician.name}</div>
            </div>
          )}
        </div>

        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid var(--border)` }}>
          <h3 style={{ marginBottom: '12px', color: neonPrimary }}>وصف البلاغ</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{incident.description}</p>
        </div>

        {incident.admin_notes && (
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid var(--border)` }}>
            <h3 style={{ marginBottom: '12px', color: neonPrimary }}>ملاحظات المسؤول</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{incident.admin_notes}</p>
          </div>
        )}

        {incident.rejection_reason && (
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid var(--border)` }}>
            <h3 style={{ marginBottom: '12px', color: '#ef4444' }}>سبب الرفض</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{incident.rejection_reason}</p>
          </div>
        )}

        {isAdmin() && incident.status === 'pending' && (
          <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
            <button className="btn-primary" style={{ background: '#10b981' }} onClick={() => setShowAssignModal(true)}>
              قبول البلاغ
            </button>
            <button className="btn-outline" style={{ borderColor: '#dc2626', color: '#dc2626' }} onClick={() => setShowRejectModal(true)}>
              رفض البلاغ
            </button>
          </div>
        )}
      </div>

      {/* مودال إسناد البلاغ لفني */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '20px', color: neonPrimary }}>قبول البلاغ وإسناده لفني</h3>
            <div className="form-group">
              <label>اختر الفني</label>
              <select className="neon-input" value={selectedTechnician} onChange={(e) => setSelectedTechnician(e.target.value)}>
                <option value="">-- اختر فني --</option>
                {technicians.map(tech => (
                  <option key={tech.id} value={tech.id}>{tech.name} - {tech.email}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>ملاحظات إضافية</label>
              <textarea className="neon-input" rows="3" value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="ملاحظات (اختياري)" />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn-outline" onClick={() => setShowAssignModal(false)}>إلغاء</button>
              <button className="btn-primary" onClick={handleApprove}>تأكيد القبول</button>
            </div>
          </div>
        </div>
      )}

      {/* مودال رفض البلاغ */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '20px', color: '#ef4444' }}>رفض البلاغ</h3>
            <div className="form-group">
              <label>سبب الرفض *</label>
              <textarea className="neon-input" rows="3" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="اكتب سبب رفض البلاغ..." />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn-outline" onClick={() => setShowRejectModal(false)}>إلغاء</button>
              <button className="btn-primary" style={{ background: '#dc2626' }} onClick={handleReject}>تأكيد الرفض</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default IncidentDetails;