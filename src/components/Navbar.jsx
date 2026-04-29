import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { nextColor, toggleTheme, isDark, colorName } = useTheme();
  const { t, i18n } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const menuItems = [
    { path: '/dashboard', label: t('dashboard'), icon: '📊', roles: ['admin', 'company', 'technician'] },
    { path: '/incidents', label: t('incidents'), icon: '📋', roles: ['admin', 'company'] },
    { path: '/my-tasks', label: t('my_tasks'), icon: '🔧', roles: ['technician'] },
    { path: '/users', label: t('users'), icon: '👥', roles: ['admin'] },
    { path: '/companies', label: t('companies'), icon: '🏢', roles: ['admin'] },
    { path: '/archives', label: t('archives'), icon: '📦', roles: ['admin', 'company', 'technician'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    setShowLangMenu(false);
  };

  // شعار حسب الدور
  const getRoleIcon = () => {
    if (user?.role === 'admin') return '👑';
    if (user?.role === 'technician') return '🔧';
    if (user?.role === 'company') return '🏢';
    return '👤';
  };

  const getRoleName = () => {
    if (user?.role === 'admin') return 'مسؤول تقني';
    if (user?.role === 'technician') return 'فني';
    if (user?.role === 'company') return 'مؤسسة';
    return '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span>📡</span>
        <span>{t('app_name')}</span>
      </div>

      <div className="navbar-menu">
        {filteredItems.map(item => (
          <button key={item.path} onClick={() => navigate(item.path)}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="navbar-actions">
        {/* زر تغيير اللون - كل ضغطة تغير اللون */}
        <button className="color-btn" onClick={nextColor} title={`اللون الحالي: ${colorName}`}>
          🎨 {colorName}
        </button>

        {/* زر الوضع الليلي */}
        <button onClick={toggleTheme}>
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* زر الترجمة */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowLangMenu(!showLangMenu)}>
            🌐 {i18n.language === 'ar' ? 'عربي' : i18n.language === 'fr' ? 'Français' : 'English'}
          </button>
          {showLangMenu && (
            <div style={{
              position: 'absolute', top: '45px', left: 0,
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '8px', minWidth: '130px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100,
            }}>
              <button onClick={() => changeLanguage('ar')} style={{ display: 'block', width: '100%', padding: '8px', textAlign: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>🇸🇦 العربية</button>
              <button onClick={() => changeLanguage('fr')} style={{ display: 'block', width: '100%', padding: '8px', textAlign: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>🇫🇷 Français</button>
              <button onClick={() => changeLanguage('en')} style={{ display: 'block', width: '100%', padding: '8px', textAlign: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>🇬🇧 English</button>
            </div>
          )}
        </div>

        {/* معلومات المستخدم */}
        <div className="user-info">
          <div className="user-avatar">
            {getRoleIcon()}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '500' }}>{user?.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{getRoleName()}</div>
          </div>
        </div>

        {/* تسجيل الخروج */}
        <button className="logout-btn" onClick={logout}>
          🚪 {t('logout')}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;