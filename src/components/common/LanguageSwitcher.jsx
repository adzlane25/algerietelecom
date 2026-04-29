import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.body.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };
  
  return (
    <div className="language-switcher">
      <Globe size={16} />
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
  );
};

export default LanguageSwitcher;