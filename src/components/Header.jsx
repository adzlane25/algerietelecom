import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import LanguageSwitcher from '../common/LanguageSwitcher';
import SettingsDrawer from '../common/SettingsDrawer';
import { Settings, LogOut } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const { buttonColor } = useTheme();
  const { t } = useTranslation();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <motion.header 
      className="header"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="welcome">
        {t('welcome_back')}, {user?.name}
      </div>
      <div className="actions">
        <LanguageSwitcher />
        <button 
          className="icon-btn settings-btn"
          onClick={() => setShowSettings(true)}
          style={{ backgroundColor: buttonColor.primary }}
        >
          <Settings size={18} />
        </button>
        <button onClick={logout} className="logout-btn">
          <LogOut size={16} /> {t('logout')}
        </button>
      </div>
      <SettingsDrawer isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </motion.header>
  );
};

export default Header;