import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  LogIn, Globe, Eye, EyeOff, AlertCircle, 
  Palette, Sparkles, Zap, Shield, Activity,
  Wifi, Signal, Cpu, Database, Server, Cloud,
  HardDrive, Layers, Boxes, Hexagon, Circle, Square, Triangle, Grid,
  UserCog, Briefcase, HardHat, Mail, Phone, MapPin,
  Star, Heart, ThumbsUp, Users, Settings, TrendingUp,
  Clock, Calendar, Sun, Moon
} from 'lucide-react';
import logo from '../assets/images/Algérie-Télécom-300x178.jpg';
import './Login.css';

const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('loginDarkMode');
    return saved !== null ? saved === 'true' : true;
  });

  const [localTheme, setLocalTheme] = useState({
    bgGradient: 'radial-gradient(circle at 20% 30%, #0a0f1a, #020617)',
    neonPrimary: '#00ff88',
    neonSecondary: '#00aaff',
    neonTertiary: '#aa66ff',
    buttonColor: '#006633',
    glowIntensity: 'medium',
    shapesVisible: true
  });

  const roleColors = {
    admin: { primary: '#00ff88', secondary: '#00aaff', tertiary: '#aa66ff', button: '#006633' },
    technician: { primary: '#ffcc00', secondary: '#ffaa00', tertiary: '#ff8800', button: '#d97706' },
    company: { primary: '#3399ff', secondary: '#3366ff', tertiary: '#3333cc', button: '#2563eb' }
  };

  const colorPalettes = {
    neonPrimary: ['#00ff88', '#00aaff', '#ff3366', '#aa66ff', '#ffcc00', '#ff66cc', '#0ff', '#f0f', '#ffaa44', '#44ffaa'],
    neonSecondary: ['#00aaff', '#ff3366', '#aa66ff', '#00ff88', '#ffcc00', '#ff66cc', '#ff8844', '#44ff88', '#8844ff', '#ff44aa'],
    neonTertiary: ['#aa66ff', '#ffcc00', '#00ff88', '#00aaff', '#ff3366', '#ff66cc', '#66ffcc', '#cc66ff', '#ffaa66', '#66aaff'],
    buttonColor: ['#006633', '#2563eb', '#dc2626', '#d97706', '#7c3aed', '#ec489a', '#0891b2', '#65a30d', '#db2777', '#ea580c']
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    const colors = roleColors[role];
    setLocalTheme(prev => ({
      ...prev,
      neonPrimary: colors.primary,
      neonSecondary: colors.secondary,
      neonTertiary: colors.tertiary,
      buttonColor: colors.button
    }));
  };

  const cycleColors = (colorKey) => {
    setLocalTheme(prev => {
      const current = prev[colorKey];
      const palette = colorPalettes[colorKey];
      const next = palette[(palette.indexOf(current) + 1) % palette.length];
      return { ...prev, [colorKey]: next };
    });
  };

  const changeBgGradient = () => {
    const gradients = [
      'radial-gradient(circle at 20% 30%, #0a0f1a, #020617)',
      'radial-gradient(circle at 80% 70%, #1a0a2a, #0a0a2a)',
      'radial-gradient(circle at 40% 60%, #0a2a1a, #021a0a)',
      'radial-gradient(circle at 60% 40%, #2a1a0a, #1a0a00)',
      'linear-gradient(135deg, #001f3f, #000000)',
    ];
    setLocalTheme(prev => {
      const current = prev.bgGradient;
      const next = gradients[(gradients.indexOf(current) + 1) % gradients.length];
      return { ...prev, bgGradient: next };
    });
  };

  const changeNeonPrimary = () => cycleColors('neonPrimary');
  const changeNeonSecondary = () => cycleColors('neonSecondary');
  const changeNeonTertiary = () => cycleColors('neonTertiary');
  const changeButtonColor = () => cycleColors('buttonColor');

  const toggleGlow = () => {
    const levels = ['low', 'medium', 'high'];
    setLocalTheme(prev => {
      const next = levels[(levels.indexOf(prev.glowIntensity) + 1) % levels.length];
      return { ...prev, glowIntensity: next };
    });
  };
  
  const toggleShapes = () => setLocalTheme(prev => ({ ...prev, shapesVisible: !prev.shapesVisible }));
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('loginDarkMode', newMode);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--login-bg', localTheme.bgGradient);
    root.style.setProperty('--login-neon-primary', localTheme.neonPrimary);
    root.style.setProperty('--login-neon-secondary', localTheme.neonSecondary);
    root.style.setProperty('--login-neon-tertiary', localTheme.neonTertiary);
    root.style.setProperty('--login-button', localTheme.buttonColor);
    let glowSize = '0 0 5px';
    if (localTheme.glowIntensity === 'medium') glowSize = '0 0 12px';
    if (localTheme.glowIntensity === 'high') glowSize = '0 0 25px';
    root.style.setProperty('--login-glow-size', glowSize);
  }, [localTheme]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const mousePosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mousePosition.current = {
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        };
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password) {
      setError(t('fill_all_fields'));
      return;
    }
    setLoading(true);
    try {
      const success = await login(formData.email, formData.password);
      if (success) navigate('/dashboard');
      else setError(t('invalid_credentials'));
    } catch (err) {
      setError(t('network_error'));
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.body.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  const timeString = currentTime.toLocaleTimeString(
    i18n.language === 'ar' ? 'ar-EG' : i18n.language === 'fr' ? 'fr-FR' : 'en-US',
    { hour: '2-digit', minute: '2-digit', second: '2-digit' }
  );
  const dateString = currentTime.toLocaleDateString(
    i18n.language === 'ar' ? 'ar-EG' : i18n.language === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  const year = "2026";

  const getWelcomeMessage = () => {
    switch(selectedRole) {
      case 'admin': return t('welcome_admin');
      case 'technician': return t('welcome_technician');
      case 'company': return t('welcome_company');
      default: return t('welcome_back');
    }
  };

  const floatingIcons = [
    Wifi, Signal, Cpu, Database, Server, Cloud, HardDrive, Layers, Boxes,
    Hexagon, Circle, Square, Triangle, Grid, Users, Settings, TrendingUp, Star, Heart, ThumbsUp
  ];

  return (
    <div className={`login-page ${isDarkMode ? 'dark-mode' : 'light-mode'}`} ref={containerRef} style={{ background: 'var(--login-bg)' }}>
      <div className="login-top-bar">
        <div className="datetime-widget">
          <div className="time"><Clock size={16} /> {timeString}</div>
          <div className="date"><Calendar size={16} /> {dateString}</div>
        </div>
        <div className="top-controls">
          <button className="icon-btn" onClick={changeBgGradient} title={t('background_gradient')}><Palette size={18} /></button>
          <button className="icon-btn" onClick={changeNeonPrimary} title={t('neon_primary')}><Sparkles size={18} /></button>
          <button className="icon-btn" onClick={changeNeonSecondary} title={t('neon_secondary')}><Zap size={18} /></button>
          <button className="icon-btn" onClick={changeNeonTertiary} title={t('neon_tertiary')}><Shield size={18} /></button>
          <button className="icon-btn" onClick={changeButtonColor} title={t('button_color')}><Activity size={18} /></button>
          <button className="icon-btn" onClick={toggleGlow} title={t('glow_intensity')}><Sparkles size={18} /></button>
          <button className="icon-btn" onClick={toggleShapes} title={t('toggle_shapes')}>
            {localTheme.shapesVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <button className="icon-btn" onClick={toggleDarkMode} title={isDarkMode ? t('light_mode') : t('dark_mode')}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="lang-selector-mini">
            <Globe size={16} />
            <select value={i18n.language} onChange={(e) => changeLanguage(e.target.value)}>
              <option value="ar">عربي</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      {localTheme.shapesVisible && (
        <div className="shapes-container">
          {[...Array(40)].map((_, i) => {
            const Shape = [Circle, Square, Hexagon, Triangle][i % 4];
            const size = 15 + (i * 5) % 50;
            const left = (i * 11) % 100;
            const top = (i * 13) % 100;
            return (
              <motion.div
                key={i}
                className="floating-shape"
                style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
                animate={{
                  x: mousePosition.current.x * 40 - 20,
                  y: mousePosition.current.y * 40 - 20,
                  rotate: [0, 360],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  x: { type: 'spring', stiffness: 40, damping: 15 },
                  y: { type: 'spring', stiffness: 40, damping: 15 },
                  rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 4, repeat: Infinity, repeatType: 'reverse' }
                }}
              >
                <Shape size={size} strokeWidth={1.2} color={`var(--login-neon-${['primary','secondary','tertiary'][i%3]})`} />
              </motion.div>
            );
          })}
          {floatingIcons.map((Icon, idx) => (
            <motion.div
              key={`icon-${idx}`}
              className="floating-icon"
              style={{ left: `${(idx * 17) % 90}%`, top: `${(idx * 23) % 90}%` }}
              animate={{
                x: mousePosition.current.x * 50 - 25,
                y: mousePosition.current.y * 50 - 25,
              }}
              transition={{ type: 'spring', stiffness: 30, damping: 20 }}
            >
              <Icon size={22} strokeWidth={1.2} />
            </motion.div>
          ))}
        </div>
      )}

      <div className="login-container">
        <div className="login-grid">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="login-brand"
          >
            <div className="brand-content">
              <div className="logo-moving-border-wrapper">
                <div className="moving-border logo-top"></div>
                <div className="moving-border logo-bottom"></div>
                <div className="moving-border logo-left"></div>
                <div className="moving-border logo-right"></div>
                <div className="neon-logo-wrapper">
                  <div className="logo-backdrop-glow"></div>
                  <img src={logo} alt="Algérie Télécom" className="brand-logo" style={{ width: '240px' }} />
                  <div className="neon-ring"></div>
                  <div className="neon-ring secondary"></div>
                </div>
              </div>
              <h1 className="brand-title">{t('app_name')}</h1>
              <p className="brand-subtitle">{t('system_full_title')}</p>
              <div className="tech-icons-multi">
                <Wifi /><Signal /><Cpu /><Database /><Server /><Cloud />
              </div>
              <div className="contact-info">
                <div className="contact-item"><Mail size={18} /> contact.constantine@algerietelecom.dz</div>
                <div className="contact-item"><Phone size={18} /> 031 12 34 56</div>
                <div className="contact-item"><MapPin size={18} /> {t('constantine_address')}</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="login-form-section"
          >
            <div className="form-card-wrapper">
              <div className="form-card glass-effect">
                <div className="moving-border top"></div>
                <div className="moving-border bottom"></div>
                <div className="moving-border left"></div>
                <div className="moving-border right"></div>
                <h2>{t('login_to_platform')}</h2>
                
                <div className="role-selector">
                  <button 
                    className={`role-btn ${selectedRole === 'admin' ? 'active' : ''}`}
                    onClick={() => handleRoleChange('admin')}
                  >
                    <UserCog size={20} /> {t('role_admin')}
                  </button>
                  <button 
                    className={`role-btn ${selectedRole === 'technician' ? 'active' : ''}`}
                    onClick={() => handleRoleChange('technician')}
                  >
                    <HardHat size={20} /> {t('role_technician')}
                  </button>
                  <button 
                    className={`role-btn ${selectedRole === 'company' ? 'active' : ''}`}
                    onClick={() => handleRoleChange('company')}
                  >
                    <Briefcase size={20} /> {t('role_company')}
                  </button>
                </div>

                <div className="welcome-message">
                  <motion.p
                    key={selectedRole}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {getWelcomeMessage()}
                  </motion.p>
                </div>

                {error && (
                  <div className="error-message">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>{t('username_or_email')}</label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                      disabled={loading}
                      className="neon-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('password')}</label>
                    <div className="password-wrapper">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={formData.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        disabled={loading}
                        className="neon-input"
                      />
                      <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="login-btn neon-button" disabled={loading}>
                    {loading ? <span className="spinner"></span> : <><LogIn size={18} /> {t('sign_in')}</>}
                  </button>
                </form>
                <div className="form-footer">
                  <p>© {year} Algérie Télécom. {t('all_rights_reserved')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;