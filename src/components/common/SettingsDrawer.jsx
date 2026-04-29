import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { X, Palette, Brush, Zap } from 'lucide-react';

const SettingsDrawer = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { 
    nextSidebarColor, nextBackgroundColor, nextButtonColor,
    sidebarColor, background, buttonColor,
    sidebarIndex, backgroundIndex, buttonIndex
  } = useTheme();

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="settings-drawer" style={{ backgroundColor: 'var(--bg-surface)', borderLeftColor: 'var(--border)' }}>
        <div className="drawer-header">
          <h3><Palette size={20} /> {t('settings')}</h3>
          <button onClick={onClose} className="drawer-close"><X size={20} /></button>
        </div>
        <div className="drawer-body">
          {/* زر 1: ألوان القوائم (نيون) */}
          <div className="setting-item">
            <div className="setting-info">
              <Brush size={24} />
              <div>
                <h4>{t('sidebar_color')}</h4>
                <p>{sidebarColor.name}</p>
              </div>
            </div>
            <button 
              className="color-cycle-btn"
              onClick={nextSidebarColor}
              style={{ backgroundColor: sidebarColor.primary, boxShadow: `0 0 6px ${sidebarColor.primary}` }}
            >
              {sidebarIndex + 1} / 6
            </button>
          </div>

          {/* زر 2: ألوان الخلفية */}
          <div className="setting-item">
            <div className="setting-info">
              <Palette size={24} />
              <div>
                <h4>{t('background_color')}</h4>
                <p>{background.name}</p>
              </div>
            </div>
            <button 
              className="color-cycle-btn"
              onClick={nextBackgroundColor}
              style={{ backgroundColor: '#64748b' }}
            >
              {backgroundIndex + 1} / 6
            </button>
          </div>

          {/* زر 3: ألوان الأزرار العلوية */}
          <div className="setting-item">
            <div className="setting-info">
              <Zap size={24} />
              <div>
                <h4>{t('button_color')}</h4>
                <p>{buttonColor.name}</p>
              </div>
            </div>
            <button 
              className="color-cycle-btn"
              onClick={nextButtonColor}
              style={{ backgroundColor: buttonColor.primary }}
            >
              {buttonIndex + 1} / 4
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsDrawer;