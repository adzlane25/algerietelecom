import React, { useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useGlobalTheme } from '../../contexts/GlobalThemeContext';
import { Bell, LogOut, Wifi, Signal, Cpu, Database, Server, Cloud, HardDrive, Layers, Boxes, Hexagon, Square, Triangle, Grid, Users, Settings, TrendingUp, Star, Heart, ThumbsUp, Activity, Zap, Shield, Globe, Lock, Key, Eye, EyeOff, Camera, Printer, Download, Upload, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const MainLayout = ({ setShowNotifications }) => {
  const { shapesVisible, neonPrimary, neonSecondary, neonTertiary } = useGlobalTheme();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('تم تسجيل الخروج بنجاح');
  };

  // أشكال هندسية فقط (بدون دوائر)
  const shapes = [Square, Hexagon, Triangle];
  
  // أيقونات تقنية متنوعة
  const floatingIcons = [
    Wifi, Signal, Cpu, Database, Server, Cloud, HardDrive, Layers, Boxes,
    Activity, Zap, Shield, Globe, Lock, Key, Eye, EyeOff, Camera, Printer,
    Download, Upload, RefreshCw, Users, Settings, TrendingUp, Star, Heart, ThumbsUp,
    Hexagon, Square, Triangle, Grid
  ];

  return (
    <div className="app-layout" ref={containerRef}>
      <Sidebar />
      <div className="main-wrapper">
        <div className="main-header">
          <div className="header-welcome">
            <span>{t('welcome_back')}, {user?.name || 'User'}</span>
          </div>
          <div className="header-actions">
            <button className="notification-bell" onClick={() => setShowNotifications(true)} title={t('notifications')}>
              <Bell size={20} />
              {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
            </button>
            <button className="header-logout-btn" onClick={handleLogout} title={t('logout')}>
              <LogOut size={18} />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
        <div className="content-area">
          <Outlet />
        </div>
      </div>
      
      {/* الأشكال والأيقونات العائمة في الخلفية */}
      {shapesVisible && (
        <>
          {/* 30 شكلاً هندسياً (مربعات، سداسيات، مثلثات) */}
          <div className="shapes-container-background">
            {[...Array(30)].map((_, i) => {
              const Shape = shapes[i % 3];
              const size = 20 + (i * 4) % 60;
              const left = (i * 13) % 95;
              const top = (i * 17) % 95;
              return (
                <motion.div
                  key={`shape-${i}`}
                  className="floating-shape-bg"
                  style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
                  animate={{
                    x: mousePosition.current.x * 40 - 20,
                    y: mousePosition.current.y * 40 - 20,
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    x: { type: 'spring', stiffness: 35, damping: 18 },
                    y: { type: 'spring', stiffness: 35, damping: 18 },
                    rotate: { duration: 20 + i, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 3, repeat: Infinity, repeatType: 'reverse' }
                  }}
                >
                  <Shape size={size} strokeWidth={1.2} color={i % 3 === 0 ? neonPrimary : i % 3 === 1 ? neonSecondary : neonTertiary} fill="none" />
                </motion.div>
              );
            })}
          </div>

          {/* 30 أيقونة تقنية عائمة */}
          <div className="icons-container-background">
            {floatingIcons.map((Icon, idx) => (
              <motion.div
                key={`icon-${idx}`}
                className="floating-icon-bg"
                style={{ left: `${(idx * 17) % 95}%`, top: `${(idx * 23) % 95}%` }}
                animate={{
                  x: mousePosition.current.x * 50 - 25,
                  y: mousePosition.current.y * 50 - 25,
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  x: { type: 'spring', stiffness: 30, damping: 20 },
                  y: { type: 'spring', stiffness: 30, damping: 20 },
                  rotate: { duration: 10 + idx, repeat: Infinity, ease: 'easeInOut' }
                }}
              >
                <Icon size={22} strokeWidth={1.2} color={idx % 3 === 0 ? neonPrimary : idx % 3 === 1 ? neonSecondary : neonTertiary} />
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* الخطوط الضوئية المتطورة (بدون حلقة) */}
      <div className="advanced-light-lines">
        <motion.div
          className="light-line laser-top"
          style={{ background: `linear-gradient(90deg, transparent, ${neonPrimary}, ${neonSecondary}, transparent)` }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="light-line laser-bottom"
          style={{ background: `linear-gradient(270deg, transparent, ${neonSecondary}, ${neonTertiary}, transparent)` }}
          animate={{ x: ['100%', '-200%'] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="light-line laser-left"
          style={{ background: `linear-gradient(180deg, transparent, ${neonTertiary}, ${neonPrimary}, transparent)` }}
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="light-line laser-right"
          style={{ background: `linear-gradient(0deg, transparent, ${neonPrimary}, ${neonSecondary}, transparent)` }}
          animate={{ y: ['100%', '-200%'] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="light-line laser-diagonal"
          style={{ background: `linear-gradient(135deg, transparent, ${neonSecondary}, ${neonTertiary}, transparent)` }}
          animate={{ x: ['-100%', '200%'], y: ['-100%', '200%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </div>
  );
};

export default MainLayout;