export const landingDarkTheme = {
  background: '#0F172A',
  primaryBrand: '#3B82F6',
  accentGradient: 'linear-gradient(90deg, #818CF8, #FB923C, #34D399, #FBBF24)',
  textPrimary: '#F3F4F6',
  textSecondary: '#9CA3AF',
  cardBackground: '#1E293B',
  
  // Role-specific hover colors
  roleColors: {
    student: {
      primary: '#6366F1',
      secondary: '#FB923C',
      accent: '#34D399',
      hover: 'rgba(99, 102, 241, 0.2)',
      glow: '0 0 20px rgba(99, 102, 241, 0.3)'
    },
    teacher: {
      primary: '#3B82F6',
      secondary: '#A855F7',
      accent: '#FBBF24',
      hover: 'rgba(59, 130, 246, 0.2)',
      glow: '0 0 20px rgba(59, 130, 246, 0.3)'
    },
    admin: {
      primary: '#EF4444',
      secondary: '#22C55E',
      accent: '#3B82F6',
      hover: 'rgba(239, 68, 68, 0.2)',
      glow: '0 0 20px rgba(239, 68, 68, 0.3)'
    },
    guardian: {
      primary: '#F59E0B',
      secondary: '#10B981',
      accent: '#A78BFA',
      hover: 'rgba(245, 158, 11, 0.2)',
      glow: '0 0 20px rgba(245, 158, 11, 0.3)'
    }
  }
};