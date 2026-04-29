import React, { useState } from 'react';
import './ColorPicker.css';

const ColorPicker = ({ label, colorKey, value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  // ألوان مقترحة
  const presetColors = [
    '#006633', '#22c55e', '#10b981', '#14b8a6',
    '#3b82f6', '#8b5cf6', '#d946ef', '#ec4899',
    '#f43f5e', '#ef4444', '#f97316', '#f59e0b',
    '#eab308', '#84cc16', '#a3e635', '#34d399',
  ];

  return (
    <div className="color-picker-item">
      <label>{label}</label>
      <div className="color-preview-wrapper">
        <div 
          className="color-preview"
          style={{ backgroundColor: value }}
          onClick={() => setShowPicker(!showPicker)}
        />
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="color-input"
        />
      </div>
      
      {showPicker && (
        <div className="color-picker-popup">
          <div className="preset-colors">
            {presetColors.map(color => (
              <button
                key={color}
                className="preset-color"
                style={{ backgroundColor: color }}
                onClick={() => {
                  onChange(color);
                  setShowPicker(false);
                }}
              />
            ))}
          </div>
          <input 
            type="color" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="color-input-native"
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;