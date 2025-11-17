import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'system';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        
        let activeTheme = theme;

        if (theme === 'system') {
            activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
                ? 'dark' 
                : 'light';
        }
        
        root.classList.remove('light', 'dark');
        root.classList.add(activeTheme);

        localStorage.setItem('theme', theme);

    }, [theme]);

    const value = { theme, setTheme };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};