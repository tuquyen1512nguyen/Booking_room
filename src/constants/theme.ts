export const COLORS = {
  // Brand & Academic Navy
  primary: '#1E293B', // Slate 800
  primaryDark: '#0F172A', // Slate 900
  primaryLight: '#334155', // Slate 700
  accentIndigo: '#4F46E5', // Indigo 600
  accentBlue: '#2563EB', // Blue 600
  
  // Secondary / Highlights
  blueLight: '#EFF6FF',
  blueBorder: '#BFDBFE',
  blueSubtle: '#DBEAFE',

  // Status Colors
  success: '#10B981', // Emerald 500
  successLight: '#ECFDF5',
  successBorder: '#A7F3D0',
  successDark: '#047857',

  warning: '#F59E0B', // Amber 500
  warningLight: '#FEF3C7',
  warningBorder: '#FDE68A',
  warningDark: '#B45309',

  danger: '#EF4444', // Red 500
  dangerLight: '#FEE2E2',
  dangerBorder: '#FECACA',
  dangerDark: '#B91C1C',

  // Neutrals & Surface
  background: '#F8FAFC', // Slate 50
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9', // Slate 100
  border: '#E2E8F0', // Slate 200
  borderDark: '#CBD5E1', // Slate 300

  // Text
  textPrimary: '#0F172A', // Deep Navy
  textSecondary: '#475569', // Muted Slate
  textMuted: '#94A3B8', // Placeholder Slate
  textWhite: '#FFFFFF',
  textBrand: '#2563EB',

  // Overlay
  overlay: 'rgba(15, 23, 42, 0.5)',
  glassBackground: 'rgba(255, 255, 255, 0.85)',
};

export const SPACING = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  screenPadding: 16,
  cardPadding: 16,
};

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 9999,
};

export const FONTS = {
  regular: {
    fontWeight: '400' as const,
  },
  medium: {
    fontWeight: '500' as const,
  },
  semiBold: {
    fontWeight: '600' as const,
  },
  bold: {
    fontWeight: '700' as const,
  },
  extraBold: {
    fontWeight: '800' as const,
  },
};

export const SHADOWS = {
  subtle: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  hover: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  floating: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 10,
  },
};
