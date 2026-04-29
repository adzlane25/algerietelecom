import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, Globe } from 'lucide-react';

const ThemeSwitcher = () => {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="theme-switcher">
      <button onClick={toggleTheme} className="theme-btn" title={isDark ? t('light_mode') : t('dark_mode')}>
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      
      <div className="language-buttons">
        <button 
          onClick={() => changeLanguage('ar')}
          className={i18n.language === 'ar' ? 'active' : ''}
        >
          عربي
        </button>
        <button 
          onClick={() => changeLanguage('fr')}
          className={i18n.language === 'fr' ? 'active' : ''}
        >
          Français
        </button>
        <button 
          onClick={() => changeLanguage('en')}
          className={i18n.language === 'en' ? 'active' : ''}
        >
          English
        </button>
      </div>
    </div>
  );
};

export default ThemeSwitcher;