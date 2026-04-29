import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGlobalTheme } from '../contexts/GlobalThemeContext';
import { useTranslation } from 'react-i18next';
import { User, Save, Globe, CheckCircle, Sun, Moon, Palette, Sparkles, Eye, EyeOff, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, api } = useAuth();
  const { t, i18n } = useTranslation();
  const { neonPrimary, cycleNeonPrimary, isDarkMode, toggleDarkMode, glowIntensity, cycleGlow, shapesVisible, toggleShapes } = useGlobalTheme();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.body.dir = lng === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('i18nextLng', lng);
    toast.success(t('language_changed'));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (profileForm.new_password && profileForm.new_password !== profileForm.confirm_password) {
      toast.error(t('passwords_not_match'));
      return;
    }
    
    setLoading(true);
    try {
      const updateData = {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone
      };
      
      if (profileForm.new_password) {
        updateData.password = profileForm.new_password;
      }
      
      await api.put(`/users/${user.id}`, updateData);
      toast.success(t('profile_updated'));
      
      setProfileForm({
        ...profileForm,
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      toast.error(t('update_failed'));
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = () => {
    if (user?.role === 'admin' || user?.role === 'nazim') return 'مسؤول تقني';
    if (user?.role === 'technician') return 'فني';
    if (user?.role === 'company') return 'مؤسسة';
    return '';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
          <User size={32} style={{ color: neonPrimary }} /> {t('settings')}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t('settings_description')}</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', borderBottom: `1px solid var(--border)`, marginBottom: '32px', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('profile')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: activeTab === 'profile' ? `${neonPrimary}20` : 'transparent', border: 'none', borderRadius: '40px 40px 0 0', cursor: 'pointer', color: activeTab === 'profile' ? neonPrimary : 'var(--text-secondary)', fontWeight: activeTab === 'profile' ? '600' : '400' }}>
          <User size={18} /> {t('profile')}
        </button>
        <button onClick={() => setActiveTab('appearance')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: activeTab === 'appearance' ? `${neonPrimary}20` : 'transparent', border: 'none', borderRadius: '40px 40px 0 0', cursor: 'pointer', color: activeTab === 'appearance' ? neonPrimary : 'var(--text-secondary)', fontWeight: activeTab === 'appearance' ? '600' : '400' }}>
          <Palette size={18} /> {t('appearance')}
        </button>
        <button onClick={() => setActiveTab('language')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: activeTab === 'language' ? `${neonPrimary}20` : 'transparent', border: 'none', borderRadius: '40px 40px 0 0', cursor: 'pointer', color: activeTab === 'language' ? neonPrimary : 'var(--text-secondary)', fontWeight: activeTab === 'language' ? '600' : '400' }}>
          <Globe size={18} /> {t('language')}
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'var(--bg-surface)', borderRadius: '24px', padding: '28px', border: `1px solid ${neonPrimary}20` }}>
          <form onSubmit={handleProfileUpdate}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>اسم المستخدم</label>
                <input type="text" className="neon-input" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} required />
                <small style={{ display: 'block', marginTop: '6px', color: neonPrimary, fontSize: '12px', fontWeight: '500' }}>
                  {getRoleLabel()}
                </small>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('email')}</label>
                <input type="email" className="neon-input" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t('phone')}</label>
                <input type="tel" className="neon-input" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
              </div>
            </div>

            {/* ✅ قسم تغيير كلمة المرور - يظهر فقط للمسؤول التقني */}
            {(user?.role === 'admin' || user?.role === 'nazim') && (
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid var(--border)` }}>
                <h3 style={{ marginBottom: '20px', color: neonPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={18} /> {t('change_password')}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <label>{t('current_password')}</label>
                    <input type="password" className="neon-input" value={profileForm.current_password} onChange={(e) => setProfileForm({ ...profileForm, current_password: e.target.value })} />
                  </div>
                  <div>
                    <label>{t('new_password')}</label>
                    <input type="password" className="neon-input" value={profileForm.new_password} onChange={(e) => setProfileForm({ ...profileForm, new_password: e.target.value })} />
                  </div>
                  <div>
                    <label>{t('confirm_password')}</label>
                    <input type="password" className="neon-input" value={profileForm.confirm_password} onChange={(e) => setProfileForm({ ...profileForm, confirm_password: e.target.value })} />
                  </div>
                </div>
              </div>
            )}

            {/* ✅ رسالة للمؤسسة والفني - تظهر فقط لغير المسؤول */}
            {user?.role !== 'admin' && user?.role !== 'nazim' && (
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid var(--border)`, textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  🔒 لا يمكنك تغيير كلمة المرور. يرجى الاتصال بالمسؤول التقني.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
              <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '12px 32px', borderRadius: '40px' }}>
                {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : <><Save size={18} /> {t('save_changes')}</>}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'var(--bg-surface)', borderRadius: '24px', padding: '24px', border: `1px solid ${neonPrimary}20` }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>{isDarkMode ? <Moon size={22} /> : <Sun size={22} />} {t('theme_mode')}</h3>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button onClick={toggleDarkMode} style={{ flex: 1, padding: '12px', borderRadius: '16px', border: `2px solid ${!isDarkMode ? neonPrimary : 'var(--border)'}`, background: !isDarkMode ? `${neonPrimary}20` : 'transparent', cursor: 'pointer' }}><Sun size={24} /> {t('light_mode')}</button>
                <button onClick={toggleDarkMode} style={{ flex: 1, padding: '12px', borderRadius: '16px', border: `2px solid ${isDarkMode ? neonPrimary : 'var(--border)'}`, background: isDarkMode ? `${neonPrimary}20` : 'transparent', cursor: 'pointer' }}><Moon size={24} /> {t('dark_mode')}</button>
              </div>
            </div>
            <div style={{ background: 'var(--bg-surface)', borderRadius: '24px', padding: '24px', border: `1px solid ${neonPrimary}20` }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}><Palette size={22} /> {t('neon_colors')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span>{t('primary')}</span><button onClick={cycleNeonPrimary} style={{ background: neonPrimary, width: '50px', height: '50px', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: `0 0 12px ${neonPrimary}` }}></button></div>
              </div>
            </div>
            <div style={{ background: 'var(--bg-surface)', borderRadius: '24px', padding: '24px', border: `1px solid ${neonPrimary}20` }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}><Sparkles size={22} /> {t('effects')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span>{t('glow_intensity')}</span><button onClick={cycleGlow} style={{ padding: '8px 20px', borderRadius: '30px', background: 'var(--border)', border: 'none', cursor: 'pointer' }}>{glowIntensity === 'low' ? t('low') : glowIntensity === 'medium' ? t('medium') : t('high')}</button></div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span>{t('background_shapes')}</span><button onClick={toggleShapes} style={{ padding: '8px 20px', borderRadius: '30px', background: shapesVisible ? neonPrimary : 'var(--border)', border: 'none', cursor: 'pointer' }}>{shapesVisible ? <Eye size={16} /> : <EyeOff size={16} />}</button></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Language Tab */}
      {activeTab === 'language' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'var(--bg-surface)', borderRadius: '24px', padding: '28px', border: `1px solid ${neonPrimary}20` }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => changeLanguage('ar')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: i18n.language === 'ar' ? `${neonPrimary}20` : 'transparent', borderRadius: '16px', border: i18n.language === 'ar' ? `1px solid ${neonPrimary}` : '1px solid var(--border)', cursor: 'pointer' }}>
              <span style={{ fontSize: '32px' }}>🇸🇦</span><div style={{ flex: 1 }}><div style={{ fontWeight: 'bold' }}>{t('arabic')}</div><div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>العربية</div></div>{i18n.language === 'ar' && <CheckCircle size={22} style={{ color: neonPrimary }} />}
            </button>
            <button onClick={() => changeLanguage('en')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: i18n.language === 'en' ? `${neonPrimary}20` : 'transparent', borderRadius: '16px', border: i18n.language === 'en' ? `1px solid ${neonPrimary}` : '1px solid var(--border)', cursor: 'pointer' }}>
              <span style={{ fontSize: '32px' }}>🇬🇧</span><div style={{ flex: 1 }}><div style={{ fontWeight: 'bold' }}>{t('english')}</div><div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>English</div></div>{i18n.language === 'en' && <CheckCircle size={22} style={{ color: neonPrimary }} />}
            </button>
            <button onClick={() => changeLanguage('fr')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: i18n.language === 'fr' ? `${neonPrimary}20` : 'transparent', borderRadius: '16px', border: i18n.language === 'fr' ? `1px solid ${neonPrimary}` : '1px solid var(--border)', cursor: 'pointer' }}>
              <span style={{ fontSize: '32px' }}>🇫🇷</span><div style={{ flex: 1 }}><div style={{ fontWeight: 'bold' }}>{t('french')}</div><div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Français</div></div>{i18n.language === 'fr' && <CheckCircle size={22} style={{ color: neonPrimary }} />}
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Settings;