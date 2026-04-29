import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { X, ChevronDown, ChevronUp, Palette, Brush, Zap, RotateCcw, Eye } from 'lucide-react';

const SettingsDrawer = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { userColors, setColor, resetColors, isDark, toggleTheme } = useTheme();
  const [openSections, setOpenSections] = useState({
    sidebar: true,
    background: false,
    buttons: false,
    texts: false,
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // ألوان القائمة (10 ألوان)
  const sidebarColors = [
    { key: 'sidebarBg', label: 'خلفية القائمة', default: '#0f172a' },
    { key: 'sidebarText', label: 'نص القائمة', default: '#e2e8f0' },
    { key: 'sidebarHover', label: 'خلفية التمرير', default: '#1e293b' },
    { key: 'sidebarActive', label: 'لون العنصر النشط', default: '#006633' },
    { key: 'navbarBg', label: 'خلفية الشريط العلوي', default: '#ffffff' },
    { key: 'navbarText', label: 'نص الشريط العلوي', default: '#1e293b' },
    { key: 'menuBg', label: 'خلفية القائمة المنسدلة', default: '#f8fafc' },
    { key: 'menuText', label: 'نص القائمة المنسدلة', default: '#475569' },
    { key: 'menuHover', label: 'خلفية التمرير للقائمة', default: '#f1f5f9' },
    { key: 'menuActive', label: 'لون العنصر النشط بالقائمة', default: '#006633' },
  ];

  // ألوان الخلفية (12 لون)
  const backgroundColors = [
    { key: 'bodyBg', label: 'خلفية الصفحة الرئيسية', default: '#f8fafc' },
    { key: 'surfaceBg', label: 'خلفية السطح', default: '#ffffff' },
    { key: 'cardBg', label: 'خلفية البطاقات', default: '#ffffff' },
    { key: 'tableBg', label: 'خلفية الجدول', default: '#ffffff' },
    { key: 'tableHeaderBg', label: 'خلفية رأس الجدول', default: '#f8fafc' },
    { key: 'tableRowHover', label: 'خلفية تمرير الجدول', default: '#f1f5f9' },
    { key: 'modalBg', label: 'خلفية النافذة المنبثقة', default: '#ffffff' },
    { key: 'inputBg', label: 'خلفية الحقول', default: '#ffffff' },
    { key: 'inputBorder', label: 'حدود الحقول', default: '#e2e8f0' },
    { key: 'borderColor', label: 'لون الحدود العامة', default: '#e2e8f0' },
    { key: 'shadowColor', label: 'لون الظل', default: 'rgba(0,0,0,0.1)' },
    { key: 'overlayBg', label: 'خلفية الطبقة الشفافة', default: 'rgba(0,0,0,0.5)' },
  ];

  // ألوان الأزرار (8 ألوان)
  const buttonColors = [
    { key: 'primaryBtn', label: 'الزر الرئيسي', default: '#006633' },
    { key: 'primaryBtnHover', label: 'الزر الرئيسي (تمرير)', default: '#004d26' },
    { key: 'primaryBtnText', label: 'نص الزر الرئيسي', default: '#ffffff' },
    { key: 'dangerBtn', label: 'زر الحذف', default: '#ef4444' },
    { key: 'dangerBtnHover', label: 'زر الحذف (تمرير)', default: '#dc2626' },
    { key: 'dangerBtnText', label: 'نص زر الحذف', default: '#ffffff' },
    { key: 'secondaryBtn', label: 'الزر الثانوي', default: '#64748b' },
    { key: 'secondaryBtnHover', label: 'الزر الثانوي (تمرير)', default: '#475569' },
    { key: 'secondaryBtnText', label: 'نص الزر الثانوي', default: '#ffffff' },
    { key: 'successBtn', label: 'زر النجاح', default: '#10b981' },
    { key: 'successBtnHover', label: 'زر النجاح (تمرير)', default: '#059669' },
    { key: 'successBtnText', label: 'نص زر النجاح', default: '#ffffff' },
    { key: 'warningBtn', label: 'زر التحذير', default: '#f59e0b' },
    { key: 'warningBtnHover', label: 'زر التحذير (تمرير)', default: '#d97706' },
    { key: 'warningBtnText', label: 'نص زر التحذير', default: '#ffffff' },
    { key: 'outlineBtn', label: 'زر شفاف', default: 'transparent' },
    { key: 'outlineBtnHover', label: 'زر شفاف (تمرير)', default: '#f1f5f9' },
    { key: 'outlineBtnText', label: 'نص الزر الشفاف', default: '#1e293b' },
  ];

  // ألوان النصوص
  const textColors = [
    { key: 'textPrimary', label: 'النص الرئيسي', default: '#1e293b' },
    { key: 'textSecondary', label: 'النص الثانوي', default: '#475569' },
    { key: 'textMuted', label: 'النص الباهت', default: '#64748b' },
    { key: 'success', label: 'لون النجاح', default: '#10b981' },
    { key: 'danger', label: 'لون الخطأ', default: '#ef4444' },
    { key: 'warning', label: 'لون التحذير', default: '#f59e0b' },
    { key: 'info', label: 'لون المعلومات', default: '#3b82f6' },
  ];

  const ColorPicker = ({ colorKey, label, value }) => {
    const [showPicker, setShowPicker] = useState(false);
    
    return (
      <div style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>{label}</label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div 
            onClick={() => setShowPicker(!showPicker)}
            style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: value, border: '2px solid var(--border)', cursor: 'pointer' }}
          />
          <input 
            type="text" 
            value={value} 
            onChange={(e) => setColor(colorKey, e.target.value)}
            style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--inputBg)', color: 'var(--textPrimary)' }}
          />
          {showPicker && (
            <input 
              type="color" 
              value={value} 
              onChange={(e) => { setColor(colorKey, e.target.value); setShowPicker(false); }}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
              autoFocus
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {isOpen && <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--overlayBg)', zIndex: 2000, animation: 'fadeIn 0.2s ease' }} />}
      <div style={{
        position: 'fixed', top: 0, right: isOpen ? '0' : '-450px', width: '450px', height: '100vh',
        background: 'var(--surfaceBg)', zIndex: 2001, transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 30px var(--shadowColor)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--borderColor)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}><Palette size={20} /> {t('settings')}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}><X size={20} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {/* الوضع الليلي */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--borderColor)', marginBottom: '16px' }}>
            <div><span style={{ fontSize: '20px' }}>🌙</span> <span style={{ fontWeight: '500' }}>{t('dark_mode')}</span></div>
            <button onClick={toggleTheme} style={{ width: '50px', height: '26px', borderRadius: '30px', background: isDark ? 'var(--primaryBtn)' : '#cbd5e1', border: 'none', cursor: 'pointer', position: 'relative' }}>
              <span style={{ position: 'absolute', width: '22px', height: '22px', background: 'white', borderRadius: '50%', top: '2px', left: isDark ? '26px' : '2px', transition: 'left 0.3s' }} />
            </button>
          </div>

          {/* ألوان القائمة (10) */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--borderColor)' }}>
            <button onClick={() => toggleSection('sidebar')} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Brush size={18} /> <span style={{ fontWeight: '500' }}>🎨 ألوان القوائم (10 ألوان)</span></div>
              {openSections.sidebar ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openSections.sidebar && <div style={{ padding: '10px 0 20px' }}>{sidebarColors.map(color => <ColorPicker key={color.key} colorKey={color.key} label={color.label} value={userColors[color.key] || color.default} />)}</div>}
          </div>

          {/* ألوان الخلفية (12) */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--borderColor)' }}>
            <button onClick={() => toggleSection('background')} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Brush size={18} /> <span style={{ fontWeight: '500' }}>🖌️ ألوان الخلفية (12 لون)</span></div>
              {openSections.background ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openSections.background && <div style={{ padding: '10px 0 20px' }}>{backgroundColors.map(color => <ColorPicker key={color.key} colorKey={color.key} label={color.label} value={userColors[color.key] || color.default} />)}</div>}
          </div>

          {/* ألوان الأزرار (8) */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--borderColor)' }}>
            <button onClick={() => toggleSection('buttons')} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Zap size={18} /> <span style={{ fontWeight: '500' }}>🔘 ألوان الأزرار (8 ألوان)</span></div>
              {openSections.buttons ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openSections.buttons && <div style={{ padding: '10px 0 20px' }}>{buttonColors.map(color => <ColorPicker key={color.key} colorKey={color.key} label={color.label} value={userColors[color.key] || color.default} />)}</div>}
          </div>

          {/* ألوان النصوص */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--borderColor)' }}>
            <button onClick={() => toggleSection('texts')} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Eye size={18} /> <span style={{ fontWeight: '500' }}>📝 ألوان النصوص</span></div>
              {openSections.texts ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openSections.texts && <div style={{ padding: '10px 0 20px' }}>{textColors.map(color => <ColorPicker key={color.key} colorKey={color.key} label={color.label} value={userColors[color.key] || color.default} />)}</div>}
          </div>

          {/* زر إعادة الضبط */}
          <button onClick={resetColors} style={{ width: '100%', padding: '12px', border: '1px solid var(--danger)', background: 'transparent', borderRadius: '30px', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px' }}><RotateCcw size={16} /> إعادة ضبط جميع الألوان</button>
        </div>
      </div>
    </>
  );
};

export default SettingsDrawer; 