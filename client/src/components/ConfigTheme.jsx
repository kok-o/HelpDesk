import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ConfigTheme = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <button 
      onClick={toggleTheme} 
      className="glass-panel"
      style={{ 
        position: 'fixed', bottom: '20px', right: '20px', 
        padding: '12px', borderRadius: '50%', cursor: 'pointer', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
    >
      {theme === 'light' ? <Moon size={24} color="var(--text-primary)" /> : <Sun size={24} color="var(--text-primary)" />}
    </button>
  );
};

export default ConfigTheme;
