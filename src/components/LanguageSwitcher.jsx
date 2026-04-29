import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // تحديث اتجاه الصفحة للعربية
    if (lng === 'ar') {
      document.body.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.body.dir = 'ltr';
      document.documentElement.lang = lng;
    }
  };
  
  return (
    <div className="language-switcher">
      <button 
        onClick={() => changeLanguage('ar')}
        className={i18n.language === 'ar' ? 'active' : ''}
      >
        🇸🇪 العربية
      </button>
      <button 
        onClick={() => changeLanguage('fr')}
        className={i18n.language === 'fr' ? 'active' : ''}
      >
        🇫🇷 Français
      </button>
      <button 
        onClick={() => changeLanguage('en')}
        className={i18n.language === 'en' ? 'active' : ''}
      >
        🇬🇧 English
      </button>
    </div>
  );
};

export default LanguageSwitcher;