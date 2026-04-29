import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGlobalTheme } from '../contexts/GlobalThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  FileText, Download, Printer, Calendar, TrendingUp, 
  BarChart3, FileBarChart, CheckCircle,
  Building2, FileSignature
} from 'lucide-react';
import toast from 'react-hot-toast';

const Reports = () => {
  const { api } = useAuth();
  const { neonPrimary } = useGlobalTheme();
  const { t } = useTranslation();
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState('incidents');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [format, setFormat] = useState('pdf');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reports');
      setReports(response.data.data || []);
    } catch (error) {
      console.error('Failed to load reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const reportsList = [
    { id: 'incidents', title: t('incidents_report'), icon: <FileText size={28} />, description: t('incidents_report_desc'), color: '#3b82f6' },
    { id: 'tasks', title: t('tasks_report'), icon: <TrendingUp size={28} />, description: t('tasks_report_desc'), color: '#10b981' },
    { id: 'companies', title: t('companies_report'), icon: <Building2 size={28} />, description: t('companies_report_desc'), color: '#8b5cf6' },
    { id: 'interventions', title: t('interventions_report'), icon: <FileSignature size={28} />, description: t('interventions_report_desc'), color: '#f59e0b' },
    { id: 'performance', title: t('performance_report'), icon: <BarChart3 size={28} />, description: t('performance_report_desc'), color: '#ec489a' },
  ];

  const generateReport = async () => {
    setGenerating(true);
    try {
      const response = await api.post('/reports', { 
        type: reportType, 
        start_date: dateRange.start,
        end_date: dateRange.end
      });
      
      if (format === 'pdf') {
        window.open(`${api.defaults.baseURL}/reports/${response.data.id}/download`, '_blank');
      } else {
        handlePrintPreview();
      }
      toast.success('تم إنشاء التقرير بنجاح');
      fetchReports();
    } catch (error) {
      console.error('Generate failed:', error);
      handlePrintPreview();
      toast.success('تم إنشاء التقرير (نسخة تجريبية)');
    } finally {
      setTimeout(() => setGenerating(false), 1500);
    }
  };

  const handlePrintPreview = () => {
    const printWindow = window.open('', '_blank');
    const reportTitle = reportsList.find(r => r.id === reportType)?.title || t('report');
    const today = new Date();
    const currentDate = formatDate(today);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>${reportTitle} - اتصالات الجزائر</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Cairo', 'Segoe UI', sans-serif; 
              padding: 40px; 
              background: white; 
              color: #1e293b;
              direction: rtl;
            }
            .header { text-align: center; margin-bottom: 30px; }
            h2 { color: #006633; margin-bottom: 10px; }
            h3 { color: #1e293b; margin-bottom: 20px; }
            .info-box { background: #f8fafc; padding: 15px; border-radius: 12px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: right; }
            th { background: #f5f5f5; font-weight: bold; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
            .stats { display: flex; gap: 20px; justify-content: center; margin: 20px 0; flex-wrap: wrap; }
            .stat { text-align: center; padding: 15px; background: #f1f5f9; border-radius: 12px; min-width: 100px; }
            .stat-value { font-size: 24px; font-weight: bold; color: #006633; }
            .stat-label { font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>اتصالات الجزائر - قسنطينة</h2>
            <h3>${reportTitle}</h3>
            <p>تاريخ التقرير: ${currentDate}</p>
            ${dateRange.start ? `<p>الفترة: من ${dateRange.start} إلى ${dateRange.end || 'اليوم'}</p>` : ''}
          </div>
          
          <div class="stats">
            <div class="stat"><div class="stat-value">0</div><div class="stat-label">إجمالي البلاغات</div></div>
            <div class="stat"><div class="stat-value">0</div><div class="stat-label">قيد المعالجة</div></div>
            <div class="stat"><div class="stat-value">0</div><div class="stat-label">مكتملة</div></div>
          </div>
          
          <div class="info-box">
            <p><strong>ملخص التقرير:</strong> هذا تقرير يوضح إحصائيات ${reportTitle} في النظام.</p>
            <p><strong>تاريخ الإنشاء:</strong> ${currentDate}</p>
            <p><strong>نوع التقرير:</strong> ${format === 'pdf' ? 'PDF' : 'طباعة'}</p>
          </div>
          
          <table>
            <thead><tr><th>#</th><th>العنوان</th><th>التاريخ</th><th>الحالة</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>مثال على بلاغ</td><td>${currentDate}</td><td>مكتمل</td></tr>
              <tr><td>2</td><td>مثال آخر</td><td>${currentDate}</td><td>قيد المعالجة</td></tr>
            </tbody>
          </table>
          
          <div class="footer">تم إنشاء هذا التقرير بواسطة نظام اتصالات الجزائر - ${currentDate}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const handleDownload = async (report) => {
    try {
      window.open(`${api.defaults.baseURL}/reports/${report.id}/download`, '_blank');
      toast.success('جاري تحميل التقرير');
    } catch (error) {
      toast.error(t('download_failed'));
    }
  };

  const handleDelete = async (report) => {
    if (!window.confirm(t('confirm_delete'))) return;
    try {
      await api.delete(`/reports/${report.id}`);
      toast.success(t('delete_success'));
      fetchReports();
    } catch (error) {
      toast.error(t('delete_failed'));
    }
  };

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
      style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}
    >
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
          <FileBarChart size={32} style={{ color: neonPrimary }} /> {t('reports_page')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>إنشاء وعرض التقارير والإحصائيات</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {reportsList.map((report) => (
          <motion.div
            key={report.id}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setReportType(report.id)}
            style={{
              background: 'var(--bg-surface)',
              borderRadius: '28px',
              padding: '28px',
              border: `2px solid ${reportType === report.id ? neonPrimary : 'var(--border)'}`,
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: reportType === report.id ? `0 0 20px ${neonPrimary}40` : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ 
                width: '56px', height: '56px', 
                background: `${report.color}20`, 
                borderRadius: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: report.color
              }}>
                {report.icon}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>{report.title}</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5' }}>{report.description}</p>
            {reportType === report.id && (
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: neonPrimary }}>
                <CheckCircle size={16} /> <span style={{ fontSize: '12px' }}>{t('selected')}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div style={{ 
        background: 'var(--bg-surface)', 
        borderRadius: '32px', 
        padding: '32px', 
        border: `1px solid ${neonPrimary}30`,
        marginBottom: '32px'
      }}>
        <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '700', color: neonPrimary }}>
          {t('report_settings')}
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: 'var(--text-primary)' }}>
              <Calendar size={16} style={{ display: 'inline', marginLeft: '8px' }} /> {t('date_range')}
            </label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input 
                type="date" 
                className="neon-input" 
                value={dateRange.start} 
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                style={{ flex: 1 }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>→</span>
              <input 
                type="date" 
                className="neon-input" 
                value={dateRange.end} 
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                style={{ flex: 1 }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {t('export_format')}
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setFormat('pdf')}
                style={{
                  padding: '10px 24px',
                  borderRadius: '40px',
                  background: format === 'pdf' ? neonPrimary : 'var(--border)',
                  color: format === 'pdf' ? '#000' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                PDF
              </button>
              <button 
                onClick={() => setFormat('print')}
                style={{
                  padding: '10px 24px',
                  borderRadius: '40px',
                  background: format === 'print' ? neonPrimary : 'var(--border)',
                  color: format === 'print' ? '#000' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                {t('print_preview')}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button 
            className="btn-outline" 
            onClick={handlePrintPreview}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', borderRadius: '40px' }}
          >
            <Printer size={18} /> {t('print_preview')}
          </button>
          <button 
            className="btn-primary" 
            onClick={generateReport} 
            disabled={generating}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 32px', borderRadius: '40px' }}
          >
            {generating ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : <Download size={18} />}
            {generating ? t('generating') : t('generate')}
          </button>
        </div>
      </div>

      {reports.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600', color: neonPrimary }}>التقارير السابقة</h3>
          <div className="table-wrapper">
            <table style={{ width: '100%' }}>
              <thead>
                <tr><th>#</th><th>العنوان</th><th>تاريخ الإنشاء</th><th>{t('actions')}</th></tr>
              </thead>
              <tbody>
                {reports.map((report, idx) => (
                  <tr key={report.id}>
                    <td>{idx + 1}</td>
                    <td>{report.title}</td>
                    <td dir="ltr">{formatDate(report.created_at)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="icon-btn-sm" onClick={() => handleDownload(report)} title={t('download')}>
                          <Download size={16} />
                        </button>
                        <button className="icon-btn-sm" style={{ color: '#ef4444' }} onClick={() => handleDelete(report)} title={t('delete')}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Reports;