import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useGlobalTheme } from '../../contexts/GlobalThemeContext';
import { 
  LayoutDashboard, FileText, Users, Building2, Archive, 
  FileBarChart, Settings, ClipboardList, LogOut, 
  Menu, X, Sun, Moon, Palette, Eye, EyeOff,
  Globe, ChevronDown, Brush
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { logout, user, isAdmin, isCompany, isTechnician } = useAuth();
  const { 
    cycleNeonPrimary,
    isDarkMode, 
    toggleDarkMode,
    shapesVisible, 
    toggleShapes,
    cycleBackgroundColor
  } = useGlobalTheme();
  
  const [collapsed, setCollapsed] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.body.dir = lng === 'ar' ? 'rtl' : 'ltr';
    setLangOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // قائمة المسؤول التقني
  const adminMenuItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: t('dashboard') },
    { path: '/incidents', icon: <FileText size={20} />, label: t('incidents') },
    { path: '/users', icon: <Users size={20} />, label: t('users') },
    { path: '/companies', icon: <Building2 size={20} />, label: t('companies') },
    { path: '/my-tasks', icon: <ClipboardList size={20} />, label: t('my_tasks') },
    { path: '/interventions', icon: <FileBarChart size={20} />, label: t('interventions') },
    { path: '/reports', icon: <FileBarChart size={20} />, label: t('reports_page') },
    { path: '/archives', icon: <Archive size={20} />, label: t('archives') },
    { path: '/settings', icon: <Settings size={20} />, label: t('settings') },
  ];

  // قائمة المؤسسة
  const companyMenuItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: t('dashboard') },
    { path: '/incidents', icon: <FileText size={20} />, label: t('incidents') },
    { path: '/archives', icon: <Archive size={20} />, label: t('archives') },
    { path: '/settings', icon: <Settings size={20} />, label: t('settings') },
  ];

  // قائمة الفني
  const technicianMenuItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: t('dashboard') },
    { path: '/my-tasks', icon: <ClipboardList size={20} />, label: t('my_tasks') },
    { path: '/interventions', icon: <FileBarChart size={20} />, label: t('interventions') },
    { path: '/archives', icon: <Archive size={20} />, label: t('archives') },
    { path: '/settings', icon: <Settings size={20} />, label: t('settings') },
  ];

  let menuItems = [];
  if (isAdmin()) menuItems = adminMenuItems;
  else if (isCompany()) menuItems = companyMenuItems;
  else if (isTechnician()) menuItems = technicianMenuItems;

  const getRoleName = () => {
    if (isAdmin()) return '👑 ' + t('role_admin');
    if (isCompany()) return '🏢 ' + t('role_company');
    if (isTechnician()) return '🔧 ' + t('role_technician');
    return '';
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          {!collapsed && <span className="logo-text">{t('app_name')}</span>}
        </div>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      <div className="sidebar-user">
        {!collapsed && (
          <div className="user-info">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-email">{user?.email || ''}</div>
            <div className="user-role">{getRoleName()}</div>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="control-buttons">
          <button className="icon-btn-sm" onClick={cycleNeonPrimary} title={t('neon_primary')}>
            <Palette size={16} />
          </button>
          <button className="icon-btn-sm" onClick={cycleBackgroundColor} title={t('background_color_cycle')}>
            <Brush size={16} />
          </button>
          <button className="icon-btn-sm" onClick={toggleDarkMode} title={isDarkMode ? t('light_mode') : t('dark_mode')}>
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="icon-btn-sm" onClick={toggleShapes} title={t('toggle_shapes')}>
            {shapesVisible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          
          <div className="lang-dropdown">
            <button className="icon-btn-sm" onClick={() => setLangOpen(!langOpen)}>
              <Globe size={16} />
            </button>
            {langOpen && (
              <div className="lang-menu">
                <button onClick={() => changeLanguage('ar')}>العربية</button>
                <button onClick={() => changeLanguage('fr')}>Français</button>
                <button onClick={() => changeLanguage('en')}>English</button>
              </div>
            )}
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          {!collapsed && <span>{t('logout')}</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;