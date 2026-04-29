import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGlobalTheme } from '../contexts/GlobalThemeContext';
import { useTranslation } from 'react-i18next';
import { Activity, Search, RefreshCw, CheckCircle, Clock, AlertCircle, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

const Interventions = () => {
  const { api } = useAuth();
  const { neonPrimary } = useGlobalTheme();
  const { t } = useTranslation();
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => { fetchInterventions(); }, []);

  const fetchInterventions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/interventions');
      setInterventions(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to load interventions:', error);
      toast.error(t('error_loading_data'));
      setInterventions([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'completed') return <span className="badge-completed"><CheckCircle size={14} /> {t('completed')}</span>;
    if (status === 'in_progress') return <span className="badge-progress"><Clock size={14} /> {t('in_progress')}</span>;
    if (status === 'assigned') return <span className="badge-pending"><AlertCircle size={14} /> {t('assigned')}</span>;
    if (status === 'approved') return <span className="badge-approved">موافق</span>;
    if (status === 'rejected') return <span className="badge-rejected">مرفوض</span>;
    return <span className="badge-pending">{status}</span>;
  };

  const getStatusText = (status) => {
    const names = { 
      assigned: t('assigned'), 
      in_progress: t('in_progress'), 
      completed: t('completed'), 
      approved: t('approved'), 
      rejected: t('rejected') 
    };
    return names[status] || status;
  };

  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    let tableRows = '';
    filteredInterventions.forEach((inv, idx) => {
      tableRows += `
        <tr>
          <td style="text-align:center">${idx + 1}</td>
          <td>${inv.incident?.title || '-'}</td>
          <td>${inv.technician?.name || '-'}</td>
          <td>${getStatusText(inv.status)}</td>
          <td dir="ltr">${formatDate(inv.started_at)}</td>
          <td dir="ltr">${formatDate(inv.completed_at)}</td>
        </tr>
      `;
    });
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
        <head><meta charset="UTF-8"><title>تقرير التدخلات - اتصالات الجزائر</title>
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
          <div class="header"><h2>اتصالات الجزائر - قسنطينة</h2><h3>تقرير التدخلات</h3><p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-EG')}</p></div>
          <table><thead><tr><th>#</th><th>البلاغ</th><th>الفني</th><th>الحالة</th><th>تاريخ البدء</th><th>تاريخ الانتهاء</th></tr></thead><tbody>${tableRows}</tbody></table>
          <div class="footer">تم الطباعة من نظام اتصالات الجزائر - قسنطينة</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const filteredInterventions = interventions.filter((inv) => {
    const matchesSearch = inv.incident?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.technician?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
            <Activity size={28} style={{ color: neonPrimary }} /> {t('interventions')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>إدارة التدخلات الميدانية</p>
        </div>
        <button className="btn-outline" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '40px' }}>
          <Printer size={18} /> {t('print')}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            className="neon-input"
            placeholder={t('search_interventions')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingRight: '40px' }}
          />
        </div>
        <select
          className="neon-input"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ width: '160px' }}
        >
          <option value="all">{t('all_status')}</option>
          <option value="assigned">{t('assigned')}</option>
          <option value="in_progress">{t('in_progress')}</option>
          <option value="completed">{t('completed')}</option>
          <option value="approved">{t('approved')}</option>
          <option value="rejected">{t('rejected')}</option>
        </select>
        <button className="btn-outline" onClick={fetchInterventions} style={{ padding: '12px 20px', borderRadius: '40px' }}>
          <RefreshCw size={18} /> {t('refresh')}
        </button>
      </div>

      <div className="table-wrapper">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>{t('incident')}</th>
              <th>{t('technician')}</th>
              <th>{t('status')}</th>
              <th>{t('started_at')}</th>
              <th>{t('completed_at')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredInterventions.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                  <Activity size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                  <p>{t('no_interventions')}</p>
                </td>
              </tr>
            ) : (
              filteredInterventions.map((inv, idx) => (
                <motion.tr
                  key={inv.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ backgroundColor: 'var(--border)' }}
                >
                  <td style={{ direction: 'ltr' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 500 }}>{inv.incident?.title || '-'}</td>
                  <td>{inv.technician?.name || '-'}</td>
                  <td>{getStatusBadge(inv.status)}</td>
                  <td dir="ltr">{formatDate(inv.started_at)}</td>
                  <td dir="ltr">{formatDate(inv.completed_at)}</td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Interventions;