import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGlobalTheme } from '../contexts/GlobalThemeContext';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Send, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const NewIncident = () => {
  const { api } = useAuth();
  const { neonPrimary } = useGlobalTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error(t('fill_required_fields'));
      return;
    }
    
    setSubmitting(true);
    try {
      await api.post('/incidents', formData);
      toast.success(t('incident_created_success'));
      navigate('/incidents');
    } catch (error) {
      console.error('Failed to create incident:', error);
      toast.error(error.response?.data?.message || t('incident_creation_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}
    >
      <button className="btn-outline" onClick={() => navigate('/incidents')} style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ArrowRight size={18} /> {t('back')}
      </button>

      <div style={{ background: 'var(--bg-surface)', borderRadius: '32px', padding: '32px', border: `1px solid ${neonPrimary}20` }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
          {t('new_incident')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          يرجى ملء المعلومات التالية لإرسال بلاغ جديد
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              {t('title')} <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              className="neon-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="مثال: عطل في شبكة الإنترنت"
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              {t('description')} <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              rows="5"
              className="neon-input"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="وصف تفصيلي للمشكلة..."
              required
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('priority')}</label>
            <select
              className="neon-input"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="low">{t('priority_low')}</option>
              <option value="medium">{t('priority_medium')}</option>
              <option value="high">{t('priority_high')}</option>
              <option value="urgent">{t('priority_urgent')}</option>
            </select>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('address')}</label>
            <input
              type="text"
              className="neon-input"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder={t('default_address')}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '32px' }}>
            <button type="button" className="btn-outline" onClick={() => navigate('/incidents')} style={{ padding: '12px 24px', borderRadius: '40px' }}>
              {t('cancel')}
            </button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ padding: '12px 32px', borderRadius: '40px' }}>
              {submitting ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : <><Send size={18} /> {t('send')}</>}
            </button>
          </div>
        </form>
      </div>

      <div style={{ marginTop: '24px', padding: '16px', background: `${neonPrimary}10`, borderRadius: '16px', border: `1px solid ${neonPrimary}20` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertCircle size={20} color={neonPrimary} />
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            سيتم دراسة بلاغك من قبل المسؤول التقني وسيتم إشعارك عند قبوله أو رفضه.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default NewIncident;