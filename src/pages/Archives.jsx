import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGlobalTheme } from '../contexts/GlobalThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  Archive, Search, RefreshCw, Upload, 
  Download, Trash2, Printer, FileText,
  Image, File, X
} from 'lucide-react';
import toast from 'react-hot-toast';

const Archives = () => {
  const { api, user, isAdmin, isCompany } = useAuth();
  const { neonPrimary } = useGlobalTheme();
  const { t } = useTranslation();

  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technical',
    file: null,
  });

  useEffect(() => {
    fetchArchives();
    fetchStatistics();
  }, []);

  const fetchArchives = async () => {
    try {
      setLoading(true);
      const response = await api.get('/archives');
      setArchives(response.data.data || []);
    } catch (error) {
      console.error('Failed to load archives:', error);
      toast.error(t('error_loading_data'));
      setArchives([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/archives/statistics');
      setStatistics(response.data);
    } catch (error) {
      console.error('Failed to load statistics:', error);
      setStatistics(null);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      toast.error(t('select_file'));
      return;
    }
    if (!formData.title) {
      toast.error(t('title_required'));
      return;
    }

    setUploading(true);
    const data = new FormData();
    data.append('file', formData.file);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);

    try {
      await api.post('/archives', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(t('upload_success'));
      setShowUploadModal(false);
      setFormData({ title: '', description: '', category: 'technical', file: null });
      fetchArchives();
      fetchStatistics();
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error.response?.data?.message || t('upload_failed'));
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (archive) => {
    try {
      const response = await api.get(`/archives/${archive.id}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', archive.file_name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`تم تحميل ${archive.title}`);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(t('download_failed'));
    }
  };

  const handleDelete = async (archive) => {
    if (!window.confirm(t('confirm_delete'))) return;
    try {
      await api.delete(`/archives/${archive.id}`);
      toast.success(t('delete_success'));
      fetchArchives();
      fetchStatistics();
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error(t('delete_failed'));
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const handlePrint = (archive) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>${archive.title} - أرشيف اتصالات الجزائر</title>
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
            .content { border: 1px solid #ddd; padding: 20px; border-radius: 16px; margin-top: 20px; }
            .info-row { display: flex; margin: 10px 0; }
            .info-label { font-weight: bold; width: 100px; }
            .info-value { flex: 1; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>اتصالات الجزائر - قسنطينة</h2>
            <h3>${archive.title}</h3>
          </div>
          <div class="content">
            <div class="info-row"><div class="info-label">التاريخ:</div><div class="info-value">${formatDate(archive.created_at)}</div></div>
            <div class="info-row"><div class="info-label">الوصف:</div><div class="info-value">${archive.description || 'لا يوجد وصف'}</div></div>
            <div class="info-row"><div class="info-label">التصنيف:</div><div class="info-value">${archive.category}</div></div>
            <div class="info-row"><div class="info-label">الحجم:</div><div class="info-value">${(archive.file_size / 1024).toFixed(2)} KB</div></div>
          </div>
          <div class="footer">تم الطباعة من نظام اتصالات الجزائر - قسنطينة - ${formatDate(new Date())}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  const printAllArchives = () => {
    if (filteredArchives.length === 0) {
      toast.error(t('no_documents_to_print'));
      return;
    }
    
    const printWindow = window.open('', '_blank');
    let tableRows = '';
    filteredArchives.forEach((doc, idx) => {
      tableRows += `
        <tr>
          <td style="text-align:center">${idx + 1}</td>
          <td>${doc.title}</td>
          <td>${doc.category}</td>
          <td>${doc.description?.substring(0, 60) || '-'}</td>
          <td dir="ltr">${formatDate(doc.created_at)}</td>
        </tr>
      `;
    });
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
        <head><meta charset="UTF-8"><title>تقرير الأرشيف - اتصالات الجزائر</title>
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
          <div class="header"><h2>اتصالات الجزائر - قسنطينة</h2><h3>قائمة المستندات المؤرشفة</h3><p>تاريخ الطباعة: ${formatDate(new Date())}</p></div>
          <table><thead><tr><th>#</th><th>العنوان</th><th>التصنيف</th><th>الوصف</th><th>تاريخ الإضافة</th></tr></thead><tbody>${tableRows}</tbody></table>
          <div class="footer">تم الطباعة من نظام اتصالات الجزائر - قسنطينة - إجمالي المستندات: ${filteredArchives.length}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryName = (category) => {
    const categories = {
      incident: t('incident'),
      intervention: t('intervention'),
      report: t('report'),
      contract: t('contract'),
      technical: t('technical_docs'),
      administrative: t('administrative'),
      other: t('other'),
    };
    return categories[category] || category;
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return <FileText size={24} />;
    if (fileType?.includes('image')) return <Image size={24} />;
    return <File size={24} />;
  };

  const filteredArchives = archives.filter((a) => {
    const matchesSearch = a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
            <Archive size={28} style={{ color: neonPrimary }} /> {t('smart_archive')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{t('archive_description')}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" onClick={printAllArchives} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '40px' }}>
            <Printer size={18} /> {t('print_all')}
          </button>
          {isAdmin() && (
            <button className="btn-primary" onClick={() => setShowUploadModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '40px' }}>
              <Upload size={18} /> {t('upload_document')}
            </button>
          )}
        </div>
      </div>

      {statistics && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div className="stat-card-mini" style={{ background: 'var(--bg-surface)', padding: '16px 24px', borderRadius: '20px', border: `1px solid ${neonPrimary}20`, flex: 1, minWidth: '120px' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: neonPrimary }}>{statistics.total || 0}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t('total_documents')}</div>
          </div>
          <div className="stat-card-mini" style={{ background: 'var(--bg-surface)', padding: '16px 24px', borderRadius: '20px', border: `1px solid ${neonPrimary}20`, flex: 1, minWidth: '120px' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: neonPrimary }}>{formatFileSize(statistics.total_size || 0)}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t('total_size')}</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            className="neon-input"
            placeholder={t('search_archive')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingRight: '40px' }}
          />
        </div>
        <select className="neon-input" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ width: '180px' }}>
          <option value="all">{t('all_categories')}</option>
          <option value="incident">{t('incident')}</option>
          <option value="intervention">{t('intervention')}</option>
          <option value="report">{t('report')}</option>
          <option value="contract">{t('contract')}</option>
          <option value="technical">{t('technical_docs')}</option>
          <option value="administrative">{t('administrative')}</option>
          <option value="other">{t('other')}</option>
        </select>
        <button className="btn-outline" onClick={fetchArchives} style={{ padding: '12px 20px', borderRadius: '40px' }}>
          <RefreshCw size={18} /> {t('refresh')}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredArchives.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', gridColumn: '1 / -1', color: 'var(--text-secondary)' }}>
            <Archive size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <p>{t('no_documents')}</p>
          </div>
        ) : (
          filteredArchives.map((archive, idx) => (
            <motion.div
              key={archive.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03, duration: 0.2 }}
              whileHover={{ y: -5 }}
              style={{ background: 'var(--bg-surface)', borderRadius: '20px', padding: '20px', border: `1px solid ${neonPrimary}20`, transition: 'all 0.3s' }}
            >
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '50px', height: '50px', background: `${neonPrimary}20`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: neonPrimary }}>
                  {getFileIcon(archive.file_type)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>{archive.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.5' }}>{archive.description?.substring(0, 80) || t('no_description')}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    <span className="category-badge" style={{ background: `${neonPrimary}20`, color: neonPrimary, padding: '4px 12px', borderRadius: '30px', fontSize: '11px' }}>{getCategoryName(archive.category)}</span>
                    <span style={{ background: 'var(--border)', padding: '4px 12px', borderRadius: '30px', fontSize: '11px', color: 'var(--text-secondary)' }}>{formatFileSize(archive.file_size)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: `1px solid var(--border)` }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{formatDate(archive.created_at)}</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="icon-btn-sm" onClick={() => handlePrint(archive)} title={t('print')}>
                        <Printer size={16} />
                      </button>
                      <button className="icon-btn-sm" onClick={() => handleDownload(archive)} title={t('download')}>
                        <Download size={16} />
                      </button>
                      {isAdmin() && (
                        <button className="icon-btn-sm" style={{ color: '#ef4444' }} onClick={() => handleDelete(archive)} title={t('delete')}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {isAdmin() && showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: neonPrimary }}>{t('upload_document')}</h2>
              <button className="icon-btn-sm" onClick={() => setShowUploadModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label>{t('title')} *</label>
                <input type="text" className="neon-input" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>{t('description')}</label>
                <textarea rows="3" className="neon-input" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label>{t('category')}</label>
                <select className="neon-input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <option value="technical">{t('technical_docs')}</option>
                  <option value="administrative">{t('administrative')}</option>
                  <option value="report">{t('report')}</option>
                  <option value="contract">{t('contract')}</option>
                  <option value="incident">{t('incident')}</option>
                  <option value="intervention">{t('intervention')}</option>
                  <option value="other">{t('other')}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t('file')} *</label>
                <input type="file" className="neon-input" onChange={handleFileChange} required />
                <small style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{t('max_file_size')}</small>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '40px' }} disabled={uploading}>
                {uploading ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : <><Upload size={18} /> {t('upload')}</>}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Archives;