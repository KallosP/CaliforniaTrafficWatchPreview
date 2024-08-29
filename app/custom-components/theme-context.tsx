import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import {useColorScheme} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: (darkMode: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: (darkMode: boolean) => {},
});

const storeData = async (value: string) => {
  try {
    await AsyncStorage.setItem('theme', value);
  } catch (e) {
    alert('Something went wrong with setting light/dark preference...')
  }
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Toggles theme to match user's option of light or dark
  const toggleTheme = (darkMode: boolean) => {
    // Check if dark mode is enabled, if not, use light mode
    setIsDarkMode(darkMode);
    storeData(darkMode ? 'true' : 'false');
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('theme');
        // Get saved light/dark mode preference
        if (value !== null) {
          setIsDarkMode(value === 'true');
        }
      } catch (e) {
        alert('Something went wrong with getting preferences...');
      }
    };

    getData();
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
