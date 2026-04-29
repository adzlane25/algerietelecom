import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGlobalTheme } from '../contexts/GlobalThemeContext';
import { useTranslation } from 'react-i18next';
import { FileText, Building2, Users, CheckCircle, Clock, AlertCircle, ClipboardList, TrendingUp, Zap, Shield } from 'lucide-react';

const Dashboard = () => {
  const { api, isAdmin, isCompany, isTechnician } = useAuth();
  const { neonPrimary } = useGlobalTheme();
  const { t } = useTranslation();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to load stats:', error);
        setStats({});
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [api]);

  const getCards = () => {
    if (isAdmin()) {
      return [
        { key: 'total_incidents', icon: <FileText size={28} />, label: t('total_incidents'), color: neonPrimary },
        { key: 'pending_incidents', icon: <AlertCircle size={28} />, label: t('pending'), color: '#f59e0b' },
        { key: 'in_progress_incidents', icon: <Clock size={28} />, label: t('in_progress'), color: '#3b82f6' },
        { key: 'completed_incidents', icon: <CheckCircle size={28} />, label: t('completed'), color: '#10b981' },
        { key: 'total_companies', icon: <Building2 size={28} />, label: t('companies'), color: '#8b5cf6' },
        { key: 'total_users', icon: <Users size={28} />, label: t('technicians'), color: '#ec489a' },
      ];
    }
    if (isCompany()) {
      return [
        { key: 'total_incidents', icon: <FileText size={28} />, label: t('total_incidents'), color: neonPrimary },
        { key: 'pending_incidents', icon: <AlertCircle size={28} />, label: t('pending'), color: '#f59e0b' },
        { key: 'in_progress_incidents', icon: <Clock size={28} />, label: t('in_progress'), color: '#3b82f6' },
        { key: 'completed_incidents', icon: <CheckCircle size={28} />, label: t('completed'), color: '#10b981' },
      ];
    }
    if (isTechnician()) {
      return [
        { key: 'total_tasks', icon: <ClipboardList size={28} />, label: t('total_tasks'), color: neonPrimary },
        { key: 'pending_tasks', icon: <AlertCircle size={28} />, label: t('pending'), color: '#f59e0b' },
        { key: 'in_progress_tasks', icon: <Clock size={28} />, label: t('in_progress'), color: '#3b82f6' },
        { key: 'completed_tasks', icon: <CheckCircle size={28} />, label: t('completed'), color: '#10b981' },
      ];
    }
    return [];
  };

  const getStatValue = (key) => {
    const value = stats[key];
    if (value === undefined || value === null) return 0;
    return value;
  };

  const cards = getCards();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>{t('loading')}</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
          {t('dashboard')}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          {isAdmin() && 'مرحباً أيها المسؤول التقني'}
          {isCompany() && 'مرحباً في مؤسستك'}
          {isTechnician() && 'مرحباً أيها الفني'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {cards.map((card) => (
          <motion.div
            key={card.key}
            whileHover={{ y: -5 }}
            className="stat-card"
            style={{
              background: 'var(--bg-surface)',
              padding: '24px',
              borderRadius: '24px',
              border: `1px solid ${card.color}20`,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: card.color, fontVariantNumeric: 'lining-nums' }}>
                  {getStatValue(card.key)}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {card.label}
                </div>
              </div>
              <div style={{ color: card.color, opacity: 0.7 }}>{card.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* إحصائيات إضافية للمسؤول */}
      {isAdmin() && stats.total_incidents > 0 && (
        <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{ background: 'var(--bg-surface)', borderRadius: '20px', padding: '20px', border: `1px solid ${neonPrimary}20` }}>
            <h3 style={{ marginBottom: '16px', color: neonPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} /> نسبة الإنجاز
            </h3>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981' }}>
              {stats.total_incidents > 0 ? Math.round((stats.completed_incidents / stats.total_incidents) * 100) : 0}%
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              من {stats.total_incidents} بلاغ
            </div>
          </div>
          <div style={{ background: 'var(--bg-surface)', borderRadius: '20px', padding: '20px', border: `1px solid ${neonPrimary}20` }}>
            <h3 style={{ marginBottom: '16px', color: neonPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={20} /> قيد المعالجة
            </h3>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#f59e0b' }}>
              {stats.in_progress_incidents || 0}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              بلاغ قيد المعالجة حالياً
            </div>
          </div>
          <div style={{ background: 'var(--bg-surface)', borderRadius: '20px', padding: '20px', border: `1px solid ${neonPrimary}20` }}>
            <h3 style={{ marginBottom: '16px', color: neonPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} /> المؤسسات النشطة
            </h3>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#8b5cf6' }}>
              {stats.total_companies || 0}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              مؤسسة مسجلة في النظام
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;