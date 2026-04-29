import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGlobalTheme } from '../contexts/GlobalThemeContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Eye, Search, RefreshCw, AlertCircle, Clock, CheckCircle, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

const Incidents = () => {
  const { api, isAdmin, isCompany } = useAuth();
  const { neonPrimary } = useGlobalTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/incidents');
      setIncidents(response.data.data || []);
    } catch (error) {
      console.error('Failed to load incidents:', error);
      toast.error('فشل في تحميل البلاغات');
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      completed: <span className="badge-completed"><CheckCircle size={14} /> {t('completed')}</span>,
      in_progress: <span className="badge-progress"><Clock size={14} /> {t('in_progress')}</span>,
      pending: <span className="badge-pending"><AlertCircle size={14} /> {t('pending')}</span>,
      approved: <span className="badge-approved">مقبول</span>,
      rejected: <span className="badge-rejected">مرفوض</span>,
      assigned: <span className="badge-assigned">مسند</span>,
    };
    return statusMap[status] || <span className="badge-pending">{status}</span>;
  };

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      urgent: <span className="badge-urgent">{t('priority_urgent')}</span>,
      high: <span className="badge-high">{t('priority_high')}</span>,
      medium: <span className="badge-medium">{t('priority_medium')}</span>,
      low: <span className="badge-low">{t('priority_low')}</span>,
    };
    return priorityMap[priority] || <span className="badge-medium">{priority}</span>;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    let tableRows = '';
    filteredIncidents.forEach((incident, idx) => {
      tableRows += `
        <tr>
          <td style="text-align:center">${idx + 1}</td>
          <td>${incident.title}</td>
          ${isAdmin() ? `<td>${incident.company_name || '-'}</td>` : ''}
          <td>${incident.status === 'completed' ? 'مكتمل' : incident.status === 'in_progress' ? 'قيد المعالجة' : 'قيد الانتظار'}</td>
          <td>${incident.priority === 'urgent' ? 'عاجل' : incident.priority === 'high' ? 'مرتفع' : incident.priority === 'medium' ? 'متوسط' : 'منخفض'}</td>
          <td dir="ltr">${formatDate(incident.created_at)}</td>
        </tr>
      `;
    });
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
        <head><meta charset="UTF-8"><title>تقرير البلاغات - اتصالات الجزائر</title>
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
          <div class="header"><h2>اتصالات الجزائر - قسنطينة</h2><h3>تقرير البلاغات</h3><p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-EG')}</p></div>
          <table><thead><tr><th>#</th><th>العنوان</th>${isAdmin() ? '<th>المؤسسة</th>' : ''}<th>الحالة</th><th>الأولوية</th><th>التاريخ</th></tr></thead><tbody>${tableRows}</tbody></table>
          <div class="footer">تم الطباعة من نظام اتصالات الجزائر - قسنطينة</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inc.status === filterStatus;
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
            <FileText size={28} style={{ color: neonPrimary }} /> {t('incidents')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{t('manage_incidents')}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" onClick={handlePrint} style={{ padding: '10px 20px', borderRadius: '40px' }}>
            <Printer size={18} /> {t('print')}
          </button>
          {isCompany() && (
            <button className="btn-primary" onClick={() => navigate('/incidents/new')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '40px' }}>
              <Plus size={18} /> {t('new_incident')}
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input type="text" className="neon-input" placeholder={t('search_incidents')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ paddingRight: '40px' }} />
        </div>
        <select className="neon-input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ width: '160px' }}>
          <option value="all">{t('all_status')}</option>
          <option value="pending">{t('pending')}</option>
          <option value="approved">مقبول</option>
          <option value="in_progress">{t('in_progress')}</option>
          <option value="completed">{t('completed')}</option>
          <option value="rejected">مرفوض</option>
        </select>
        <button className="btn-outline" onClick={fetchIncidents} style={{ padding: '12px 20px', borderRadius: '40px' }}>
          <RefreshCw size={18} /> {t('refresh')}
        </button>
      </div>

      <div className="table-wrapper">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>{t('title')}</th>
              {isAdmin() && <th>{t('company')}</th>}
              <th>{t('status')}</th>
              <th>{t('priority')}</th>
              <th>{t('date')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncidents.length === 0 ? (
              <tr>
                <td colSpan={isAdmin() ? 7 : 6} style={{ textAlign: 'center', padding: '40px' }}>
                  <FileText size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                  <p>لا توجد بلاغات حالياً</p>
                </td>
              </tr>
            ) : (
              filteredIncidents.map((incident, idx) => (
                <motion.tr key={incident.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} whileHover={{ backgroundColor: 'var(--border)' }}>
                  <td style={{ direction: 'ltr' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 500 }}>{incident.title}</td>
                  {isAdmin() && <td>{incident.company_name || '-'}</td>}
                  <td>{getStatusBadge(incident.status)}</td>
                  <td>{getPriorityBadge(incident.priority)}</td>
                  <td dir="ltr">{formatDate(incident.created_at)}</td>
                  <td>
                    <button className="icon-btn-sm" onClick={() => navigate(`/incidents/${incident.id}`)} title={t('view_details')}>
                      <Eye size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Incidents;