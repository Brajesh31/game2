import { useTheme } from './useTheme';
import { landingLightTheme, landingDarkTheme } from '../themes/landing';
import { studentLoginTheme } from '../themes/login/studentTheme';
import { teacherLoginTheme } from '../themes/login/teacherTheme';
import { adminLoginTheme } from '../themes/login/adminTheme';
import { guardianLoginTheme } from '../themes/login/guardianTheme';

export const useThemeStyles = () => {
  const { theme } = useTheme();

  const getLandingTheme = () => {
    return theme === 'light' ? landingLightTheme : landingDarkTheme;
  };

  const getLoginTheme = (role: string) => {
    const themeMode = theme === 'light' ? 'light' : 'dark';
    
    switch (role) {
      case 'student':
        return studentLoginTheme[themeMode];
      case 'teacher':
        return teacherLoginTheme[themeMode];
      case 'admin':
        return adminLoginTheme[themeMode];
      case 'guardian':
        return guardianLoginTheme[themeMode];
      default:
        return studentLoginTheme[themeMode];
    }
  };

  const generateThemeCSS = (themeData: any) => {
    return {
      '--theme-primary': themeData.primary,
      '--theme-secondary': themeData.secondary,
      '--theme-accent': themeData.accent,
      '--theme-background': themeData.background,
      '--theme-text': themeData.text,
      '--theme-card-background': themeData.cardBackground,
      '--theme-input-background': themeData.inputBackground,
      '--theme-input-border': themeData.inputBorder,
      '--theme-input-focus': themeData.inputFocus,
      '--theme-button-gradient': themeData.buttonGradient,
      '--theme-background-gradient': themeData.backgroundGradient
    } as React.CSSProperties;
  };

  return {
    getLandingTheme,
    getLoginTheme,
    generateThemeCSS,
    theme
  };
};