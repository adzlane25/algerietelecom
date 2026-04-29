import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import LanguageMenu from './LanguageMenu';
import SettingsDrawer from './SettingsDrawer';
import { 
  LayoutDashboard, 
  AlertCircle, 
  Users, 
  Building2, 
  FileBarChart, 
  Archive, 
  Settings, 
  ClipboardList,
  LogOut,
  Sun,
  Moon,
  Globe,
  ChevronDown
} from 'lucide-react';
import './TopNavbar.css';

const TopNavbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { userColors, isDark, setIsDark } = useThemeContext();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [activeButton, setActiveButton] = useState('dashboard');

  // قائمة الأزرار حسب الدور
  const getMenuItems = () => {
    const items = [
      { id: 'dashboard', icon: LayoutDashboard, label: t('dashboard'), path: '/dashboard', roles: ['admin', 'company', 'technician'] },
      { id: 'incidents', icon: AlertCircle, label: t('incidents'), path: '/incidents', roles: ['admin', 'company'] },
      { id: 'my-tasks', icon: ClipboardList, label: t('my_tasks'), path: '/my-tasks', roles: ['technician'] },
      { id: 'users', icon: Users, label: t('users'), path: '/users', roles: ['admin'] },
      { id: 'companies', icon: Building2, label: t('companies'), path: '/companies', roles: ['admin'] },
      { id: 'reports', icon: FileBarChart, label: t('reports'), path: '/reports', roles: ['admin'] },
      { id: 'archives', icon: Archive, label: t('archives'), path: '/archives', roles: ['admin', 'company', 'technician'] },
    ];
    return items.filter(item => item.roles.includes(user?.role));
  };

  const handleNavigation = (id, path) => {
    setActiveButton(id);
    window.location.href = path;
  };

  return (
    <>
      <nav className="top-navbar" style={{ backgroundColor: userColors.surface, borderBottomColor: userColors.border }}>
        <div className="nav-logo">
          <span className="logo-icon">📡</span>
          <span className="logo-text">{t('app_name')}</span>
        </div>

        <div className="nav-buttons">
          {getMenuItems().map(item => (
            <button
              key={item.id}
              className={`nav-btn ${activeButton === item.id ? 'active' : ''}`}
              onClick={() => handleNavigation(item.id, item.path)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = userColors.buttonHover}
              onMouseLeave={(e) => {
                if (activeButton !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
              style={{
                color: activeButton === item.id ? userColors.primary : userColors.text,
                borderBottom: activeButton === item.id ? `2px solid ${userColors.primary}` : 'none',
              }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="nav-actions">
          {/* زر الترجمة مع قائمة منسدلة */}
          <div className="language-wrapper">
            <button 
              className="action-btn"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = userColors.buttonHover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Globe size={20} />
              <span>{i18n.language === 'ar' ? 'عربي' : i18n.language === 'fr' ? 'Français' : 'English'}</span>
              <ChevronDown size={14} />
            </button>
            {showLanguageMenu && (
              <LanguageMenu onClose={() => setShowLanguageMenu(false)} />
            )}
          </div>

          {/* زر الوضع الليلي/النهاري */}
          <button 
            className="action-btn"
            onClick={() => setIsDark(!isDark)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = userColors.buttonHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span>{isDark ? t('light_mode') : t('dark_mode')}</span>
          </button>

          {/* زر الإعدادات مع درج جانبي */}
          <button 
            className="action-btn"
            onClick={() => setShowSettingsDrawer(true)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = userColors.buttonHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Settings size={20} />
            <span>{t('settings')}</span>
          </button>

          {/* معلومات المستخدم */}
          <div className="user-info">
            <div className="user-avatar" style={{ backgroundColor: userColors.primary }}>
              {user?.name?.charAt(0)}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">
                {user?.role === 'admin' && '👑 ' + t('admin')}
                {user?.role === 'technician' && '🔧 ' + t('technician')}
                {user?.role === 'company' && '🏢 ' + t('company')}
              </span>
            </div>
          </div>

          {/* زر تسجيل الخروج */}
          <button 
            className="logout-btn"
            onClick={logout}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={20} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </nav>

      {/* درج الإعدادات */}
      <SettingsDrawer 
        isOpen={showSettingsDrawer} 
        onClose={() => setShowSettingsDrawer(false)} 
      />
    </>
  );
};

export default TopNavbar;