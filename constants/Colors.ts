/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

// Institutional colors for Hacienda Liborina
export const InstitutionalColors = {
  primary: '#4CAF50',      // Verde institucional
  secondary: '#C62828',    // Rojo institucional
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  darkGray: '#666666',
  black: '#000000',
  transparent: 'transparent',
  error: '#D32F2F',
  success: '#388E3C',
  warning: '#F57C00',
  info: '#1976D2',
};

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// Spacing constants
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

// Typography constants
export const Typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    huge: 32,
  },
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
};

// Login screen specific style objects
export const LoginStyles = {
  container: {
    flex: 1,
    backgroundColor: InstitutionalColors.secondary,
  },
  header: {
    backgroundColor: InstitutionalColors.primary,
    height: '20%',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  headerTitle: {
    color: InstitutionalColors.white,
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center' as const,
  },
  mainContent: {
    flex: 1,
    backgroundColor: InstitutionalColors.secondary,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    alignItems: 'center' as const,
  },
  descriptionText: {
    color: InstitutionalColors.white,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.regular,
    textAlign: 'center' as const,
    lineHeight: Typography.lineHeight.relaxed,
    marginBottom: Spacing.xxl,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  inputField: {
    backgroundColor: InstitutionalColors.white,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    fontSize: Typography.fontSize.md,
    height: 50,
  },
  inputLabel: {
    color: InstitutionalColors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
    marginBottom: Spacing.xs,
  },
  loginButton: {
    backgroundColor: InstitutionalColors.primary,
    borderRadius: 8,
    paddingVertical: Spacing.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    height: 50,
    marginTop: Spacing.md,
  },
  loginButtonDisabled: {
    backgroundColor: InstitutionalColors.primary,
    opacity: 0.6,
  },
  loginButtonText: {
    color: InstitutionalColors.white,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  checkboxContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginVertical: Spacing.md,
  },
  checkboxLabel: {
    color: InstitutionalColors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
    marginLeft: Spacing.sm,
  },
  footerLinks: {
    marginTop: Spacing.xl,
    alignItems: 'center' as const,
  },
  footerLink: {
    color: InstitutionalColors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
    textDecorationLine: 'underline' as const,
    marginVertical: Spacing.xs,
  },
  errorText: {
    color: InstitutionalColors.error,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  loadingSpinner: {
    color: InstitutionalColors.white,
  },
};
