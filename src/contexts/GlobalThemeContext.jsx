import React, { createContext, useState, useContext, useEffect } from 'react';

const GlobalThemeContext = createContext();

export const useGlobalTheme = () => {
  const context = useContext(GlobalThemeContext);
  if (!context) {
    throw new Error('useGlobalTheme must be used within GlobalThemeProvider');
  }
  return context;
};

export const GlobalThemeProvider = ({ children }) => {
  // ألوان النيون
  const [neonPrimary, setNeonPrimary] = useState('#00ff88');
  const [neonSecondary, setNeonSecondary] = useState('#00aaff');
  const [neonTertiary, setNeonTertiary] = useState('#aa66ff');
  
  // الوضع (ليلي/نهاري) - للتبديل الأساسي
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : true;
  });
  
  // لون الخلفية المخصص (يتجاوز الوضع الليلي/النهاري)
  const [customBgColor, setCustomBgColor] = useState(() => {
    return localStorage.getItem('customBgColor') || null;
  });
  
  // شدة التوهج
  const [glowIntensity, setGlowIntensity] = useState('medium');
  
  // إظهار/إخفاء الأشكال
  const [shapesVisible, setShapesVisible] = useState(true);
  
  // قائمة الألوان الفاتحة
  const lightColors = [
    { name: 'أبيض', value: '#ffffff', text: '#1e293b' },
    { name: 'أصفر', value: '#fef9c3', text: '#1e293b' },
    { name: 'أزرق فاتح', value: '#dbeafe', text: '#1e293b' },
    { name: 'أحمر فاتح', value: '#fee2e2', text: '#1e293b' },
    { name: 'أخضر فاتح', value: '#dcfce7', text: '#1e293b' },
    { name: 'برتقالي فاتح', value: '#ffedd5', text: '#1e293b' },
    { name: 'بنفسجي فاتح', value: '#f3e8ff', text: '#1e293b' },
  ];
  
  // قائمة الألوان الداكنة
  const darkColors = [
    { name: 'أسود', value: '#0a0f1a', text: '#ffffff' },
    { name: 'أزرق داكن', value: '#0f172a', text: '#ffffff' },
    { name: 'أحمر داكن', value: '#2a0f0f', text: '#ffffff' },
    { name: 'أخضر داكن', value: '#0f2a0f', text: '#ffffff' },
    { name: 'بنفسجي داكن', value: '#1a0f2a', text: '#ffffff' },
    { name: 'رمادي داكن', value: '#1a1a1a', text: '#ffffff' },
  ];
  
  const allColors = [...lightColors, ...darkColors];
  const [colorIndex, setColorIndex] = useState(() => {
    const saved = localStorage.getItem('colorIndex');
    return saved ? parseInt(saved) : 0;
  });
  
  const currentColor = allColors[colorIndex];
  
  const cycleBackgroundColor = () => {
    const nextIndex = (colorIndex + 1) % allColors.length;
    setColorIndex(nextIndex);
    localStorage.setItem('colorIndex', nextIndex);
    setCustomBgColor(allColors[nextIndex].value);
    localStorage.setItem('customBgColor', allColors[nextIndex].value);
    
    // تحديث وضع الليل/النهاري بناءً على اللون المختار
    const isDark = nextIndex >= lightColors.length;
    setIsDarkMode(isDark);
    localStorage.setItem('darkMode', isDark);
  };
  
  const colorOptions = {
    primary: ['#00ff88', '#00aaff', '#ff3366', '#aa66ff', '#ffcc00', '#ff66cc', '#0ff', '#f0f'],
    secondary: ['#00aaff', '#ff3366', '#aa66ff', '#00ff88', '#ffcc00', '#ff66cc', '#ff8844', '#44ff88'],
    tertiary: ['#aa66ff', '#ffcc00', '#00ff88', '#00aaff', '#ff3366', '#ff66cc', '#66ffcc', '#cc66ff']
  };
  
  const cycleNeonPrimary = () => {
    const currentIndex = colorOptions.primary.indexOf(neonPrimary);
    const next = colorOptions.primary[(currentIndex + 1) % colorOptions.primary.length];
    setNeonPrimary(next);
  };
  
  const cycleNeonSecondary = () => {
    const currentIndex = colorOptions.secondary.indexOf(neonSecondary);
    const next = colorOptions.secondary[(currentIndex + 1) % colorOptions.secondary.length];
    setNeonSecondary(next);
  };
  
  const cycleNeonTertiary = () => {
    const currentIndex = colorOptions.tertiary.indexOf(neonTertiary);
    const next = colorOptions.tertiary[(currentIndex + 1) % colorOptions.tertiary.length];
    setNeonTertiary(next);
  };
  
  const toggleDarkMode = () => {
    // إعادة تعيين اللون المخصص والرجوع إلى الوضع الأساسي
    setCustomBgColor(null);
    localStorage.removeItem('customBgColor');
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    // إعادة تعيين مؤشر الألوان
    const newIndex = newMode ? lightColors.length : 0;
    setColorIndex(newIndex);
    localStorage.setItem('colorIndex', newIndex);
  };
  
  const cycleGlow = () => {
    const levels = ['low', 'medium', 'high'];
    const next = levels[(levels.indexOf(glowIntensity) + 1) % levels.length];
    setGlowIntensity(next);
  };
  
  const toggleShapes = () => setShapesVisible(!shapesVisible);
  
  // تطبيق المتغيرات على جذر الصفحة
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--neon-primary', neonPrimary);
    root.style.setProperty('--neon-secondary', neonSecondary);
    root.style.setProperty('--neon-tertiary', neonTertiary);
    
    let glowSize = '0 0 5px';
    if (glowIntensity === 'medium') glowSize = '0 0 12px';
    if (glowIntensity === 'high') glowSize = '0 0 25px';
    root.style.setProperty('--glow-size', glowSize);
    
    // تطبيق لون الخلفية
    if (customBgColor) {
      root.style.setProperty('--bg-body', customBgColor);
      root.style.setProperty('--bg-surface', customBgColor === '#ffffff' ? '#f8fafc' : (isDarkMode ? '#1e293b' : '#ffffff'));
      root.style.setProperty('--text-primary', currentColor.text);
      root.style.setProperty('--text-secondary', isDarkMode ? '#94a3b8' : '#64748b');
      root.style.setProperty('--border', isDarkMode ? '#334155' : '#e2e8f0');
    } else {
      if (isDarkMode) {
        root.style.setProperty('--bg-body', '#0a0f1a');
        root.style.setProperty('--bg-surface', '#111827');
        root.style.setProperty('--text-primary', '#ffffff');
        root.style.setProperty('--text-secondary', '#94a3b8');
        root.style.setProperty('--border', '#1f2937');
      } else {
        root.style.setProperty('--bg-body', '#f0f2f5');
        root.style.setProperty('--bg-surface', '#ffffff');
        root.style.setProperty('--text-primary', '#1e293b');
        root.style.setProperty('--text-secondary', '#64748b');
        root.style.setProperty('--border', '#e2e8f0');
      }
    }
  }, [neonPrimary, neonSecondary, neonTertiary, glowIntensity, isDarkMode, customBgColor, currentColor]);
  
  const value = {
    neonPrimary, neonSecondary, neonTertiary,
    cycleNeonPrimary, cycleNeonSecondary, cycleNeonTertiary,
    isDarkMode, toggleDarkMode,
    glowIntensity, cycleGlow,
    shapesVisible, toggleShapes,
    currentColor, cycleBackgroundColor, allColors, colorIndex
  };
  
  return (
    <GlobalThemeContext.Provider value={value}>
      {children}
    </GlobalThemeContext.Provider>
  );
};