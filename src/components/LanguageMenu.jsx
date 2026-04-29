import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../contexts/ThemeContext';
import { Check, Globe } from 'lucide-react';
import './LanguageMenu.css';

const LanguageMenu = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const { userColors } = useThemeContext();
  const menuRef = useRef(null);

  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
    { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  ];

  const changeLanguage = (code, dir) => {
    i18n.changeLanguage(code);
    document.body.dir = dir;
    document.documentElement.lang = code;
    localStorage.setItem('i18nextLng', code);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="language-menu" ref={menuRef} style={{ backgroundColor: userColors.surface, borderColor: userColors.border }}>
      <div className="language-menu-header">
        <Globe size={18} />
        <span>{t('language')}</span>
      </div>
      {languages.map(lang => (
        <button
          key={lang.code}
          className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
          onClick={() => changeLanguage(lang.code, lang.dir)}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = userColors.buttonHover}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span className="lang-flag">{lang.flag}</span>
          <span className="lang-name">{lang.name}</span>
          {i18n.language === lang.code && <Check size={16} className="lang-check" />}
        </button>
      ))}
    </div>
  );
};

export default LanguageMenu;