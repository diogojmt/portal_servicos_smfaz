import { createTheme, responsiveFontSizes, alpha } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

// Design tokens aprimorados para um tema claro elegante e premium
const designTokens = {
  colors: {
    light: {
      primary: '#3a7bd5', // Azul royal elegante
      primaryLight: '#6eb6ff',
      primaryDark: '#004e92',
      secondary: '#bfa76a', // Dourado suave
      background: {
        default: '#f7fafd',
        paper: '#f2f6fa',
        gradient: 'linear-gradient(135deg, #f7fafd 0%, #e3e9f2 50%, #d1dbe9 100%)'
      },
      surface: {
        primary: '#ffffffcc', // branco translúcido
        secondary: '#f4f6fa',
        tertiary: '#e3e9f2',
        warm: '#f9fafb'
      },
      text: {
        primary: '#1a2233',
        secondary: '#4b5563',
        tertiary: '#7b8794',
        disabled: '#b0b8c1'
      },
      border: {
        light: '#e3e9f2',
        medium: '#cfd8e3',
        strong: '#b0b8c1'
      },
      status: {
        success: '#3ecf8e',
        successLight: '#a8f0c6',
        successDark: '#1e7f5c',
        warning: '#ffd166',
        warningLight: '#ffe9b3',
        warningDark: '#bfa76a',
        error: '#ff5e5e',
        errorLight: '#ffb3b3',
        errorDark: '#b22c2c',
        info: '#3a7bd5',
        infoLight: '#6eb6ff',
        infoDark: '#004e92'
      },
      action: {
        hover: 'rgba(58,123,213,0.08)',
        selected: 'rgba(191,167,106,0.12)',
        disabled: '#cfd8e3',
        disabledBackground: '#f4f6fa',
        focus: 'rgba(58,123,213,0.18)',
        active: '#3a7bd5'
      }
    },
  },
  layout: {
    maxWidth: {
      xs: '100%',
      sm: 600,
      md: 960,
      lg: 1600,
      xl: 1700,
      xxl: 1800
    },
    containerPadding: {
      xs: 20,
      sm: 32,
      md: 48,
      lg: 64
    },
    contentWidth: {
      narrow: 600,
      medium: 800,
      wide: 1100,
      full: 1300,
      extraWide: 1500
    },
    sectionSpacing: {
      xs: 20,
      sm: 32,
      md: 48,
      lg: 64,
      xl: 80
    }
  },
  spacing: {
    xs: 6,
    sm: 12,
    md: 18,
    lg: 28,
    xl: 40,
    xxl: 56
  },
  borderRadius: {
    sm: 2,
    md: 4,
    lg: 3, // Cards internos e dialogs quase retos
    xl: 6
  },
  shadows: {
    light: {
      sm: '0 2px 8px 0 rgb(58 123 213 / 0.06), 0 1.5px 3px 0 rgb(191 167 106 / 0.04)',
      md: '0 6px 16px -2px rgb(58 123 213 / 0.10), 0 3px 8px -4px rgb(191 167 106 / 0.08)',
      lg: '0 16px 32px -4px rgb(58 123 213 / 0.12), 0 8px 16px -8px rgb(191 167 106 / 0.10)',
      xl: '0 32px 48px -8px rgb(58 123 213 / 0.14), 0 16px 24px -12px rgb(191 167 106 / 0.12)',
      gradient: '0 8px 32px -4px rgb(58 123 213 / 0.18)'
    },
    dark: {
      sm: '0 2px 8px 0 rgb(0 0 0 / 0.18)',
      md: '0 6px 16px -2px rgb(0 0 0 / 0.22)',
      lg: '0 16px 32px -4px rgb(0 0 0 / 0.26)',
      xl: '0 32px 48px -8px rgb(0 0 0 / 0.30)',
      gradient: '0 8px 32px -4px rgb(0 0 0 / 0.22)'
    }
  }
};
// ...existing code...

export const createAppTheme = (): Theme => {
  const tokens = designTokens.colors.light;
  const shadows = designTokens.shadows.light;

  const baseTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#174274', // azul mais escuro para contraste
        light: tokens.primaryLight,
        dark: tokens.primaryDark,
      },
      secondary: {
        main: tokens.secondary,
      },
      info: {
        main: tokens.status.info,
        light: tokens.status.infoLight,
        dark: tokens.status.infoDark,
      },
      warning: {
        main: tokens.status.warning,
        light: tokens.status.warningLight,
        dark: tokens.status.warningDark,
      },
      background: {
        default: '#f4f6fa', // fundo claro com contraste
        paper: '#fff', // papel branco para contraste
      },
      text: {
        primary: '#1b1b1b', // preto ou quase preto para contraste
        secondary: '#424242', // cinza escuro para rodapés/textos secundários
        disabled: '#b0b8c1',
      },
      divider: tokens.border.light,
      success: {
        main: tokens.status.success,
        light: tokens.status.successLight,
        dark: tokens.status.successDark,
      },
      error: {
        main: tokens.status.error,
        light: tokens.status.errorLight,
        dark: tokens.status.errorDark,
      },
      action: {
        hover: tokens.action?.hover || '#e3f2fd',
        selected: tokens.action?.selected || '#bbdefb',
        disabled: tokens.action?.disabled || '#bdbdbd',
        disabledBackground: tokens.action?.disabledBackground || '#f5f5f5',
        focus: tokens.action?.focus || '#00b5e2',
        active: '#174274', // azul escuro para ação ativa
      },
    },
    designTokens: designTokens,
    customColors: {
      // Transparências de sucesso
      successAlpha10: alpha(tokens.status.successLight, 0.1),
      successAlpha20: alpha(tokens.status.successLight, 0.2),
      successAlpha30: alpha(tokens.status.successLight, 0.3),
      successAlpha40: alpha(tokens.status.successLight, 0.4),
      successAlpha50: alpha(tokens.status.successLight, 0.5),
      successAlpha60: alpha(tokens.status.successLight, 0.6),
      successAlpha70: alpha(tokens.status.successLight, 0.7),
      successAlpha80: alpha(tokens.status.successLight, 0.8),
      successAlpha90: alpha(tokens.status.successLight, 0.9),
      
      // Transparências de warning
      warningAlpha10: alpha(tokens.status.warningLight, 0.1),
      warningAlpha20: alpha(tokens.status.warningLight, 0.2),
      warningAlpha30: alpha(tokens.status.warningLight, 0.3),
      warningAlpha40: alpha(tokens.status.warningLight, 0.4),
      warningAlpha50: alpha(tokens.status.warningLight, 0.5),
      warningAlpha60: alpha(tokens.status.warningLight, 0.6),
      warningAlpha70: alpha(tokens.status.warningLight, 0.7),
      warningAlpha80: alpha(tokens.status.warningLight, 0.8),
      warningAlpha90: alpha(tokens.status.warningLight, 0.9),
      
      // Transparências de error
      errorAlpha10: alpha(tokens.status.errorLight, 0.1),
      errorAlpha20: alpha(tokens.status.errorLight, 0.2),
      errorAlpha30: alpha(tokens.status.errorLight, 0.3),
      errorAlpha40: alpha(tokens.status.errorLight, 0.4),
      errorAlpha50: alpha(tokens.status.errorLight, 0.5),
      errorAlpha60: alpha(tokens.status.errorLight, 0.6),
      errorAlpha70: alpha(tokens.status.errorLight, 0.7),
      errorAlpha80: alpha(tokens.status.errorLight, 0.8),
      errorAlpha90: alpha(tokens.status.errorLight, 0.9),
      
      // Transparências de info
      infoAlpha10: alpha(tokens.status.infoLight, 0.1),
      infoAlpha20: alpha(tokens.status.infoLight, 0.2),
      infoAlpha30: alpha(tokens.status.infoLight, 0.3),
      infoAlpha40: alpha(tokens.status.infoLight, 0.4),
      infoAlpha50: alpha(tokens.status.infoLight, 0.5),
      infoAlpha60: alpha(tokens.status.infoLight, 0.6),
      infoAlpha70: alpha(tokens.status.infoLight, 0.7),
      infoAlpha80: alpha(tokens.status.infoLight, 0.8),
      infoAlpha90: alpha(tokens.status.infoLight, 0.9),
      
      // Transparências de primary
      primaryAlpha10: alpha('#174274', 0.1),
      primaryAlpha20: alpha('#174274', 0.2),
      primaryAlpha30: alpha('#174274', 0.3),
      primaryAlpha40: alpha('#174274', 0.4),
      primaryAlpha50: alpha('#174274', 0.5),
      primaryAlpha60: alpha('#174274', 0.6),
      primaryAlpha70: alpha('#174274', 0.7),
      primaryAlpha80: alpha('#174274', 0.8),
      primaryAlpha90: alpha('#174274', 0.9),
      
      // Cores de superfície customizadas
      surface: {
        primary: '#fff',
        secondary: tokens.surface.secondary,
        tertiary: tokens.surface.tertiary,
        warm: tokens.surface.warm,
      },
      
      // Cores de borda customizadas
      border: {
        light: tokens.border.light,
        medium: tokens.border.medium,
        strong: tokens.border.strong,
      },
    },
    typography: {
      fontFamily: '"Inter", "Segoe UI", "Calibri", -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
      h1: {
        fontWeight: 800,
        fontSize: '2.8rem',
        lineHeight: 1.13,
        letterSpacing: '-0.04em',
        textShadow: '0 2px 8px rgba(58,123,213,0.08)',
        '@media (max-width:600px)': {
          fontSize: '2rem',
        },
      },
      h2: {
        fontWeight: 700,
        fontSize: '2.1rem',
        lineHeight: 1.18,
        letterSpacing: '-0.03em',
        textShadow: '0 1.5px 6px rgba(58,123,213,0.06)',
        '@media (max-width:600px)': {
          fontSize: '1.5rem',
        },
      },
      h3: {
        fontWeight: 700,
        fontSize: '1.6rem',
        lineHeight: 1.22,
        letterSpacing: '-0.02em',
        '@media (max-width:600px)': {
          fontSize: '1.2rem',
        },
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.3,
        '@media (max-width:600px)': {
          fontSize: '1rem',
        },
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.1rem',
        lineHeight: 1.3,
        '@media (max-width:600px)': {
          fontSize: '0.95rem',
        },
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1.4,
        '@media (max-width:600px)': {
          fontSize: '0.9rem',
        },
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.7,
        fontWeight: 400,
        '@media (max-width:600px)': {
          fontSize: '0.95rem',
        },
      },
      body2: {
        fontSize: '0.92rem',
        lineHeight: 1.6,
        fontWeight: 400,
        '@media (max-width:600px)': {
          fontSize: '0.85rem',
        },
      },
      caption: {
        fontSize: '0.8rem',
        lineHeight: 1.5,
        fontWeight: 500,
        '@media (max-width:600px)': {
          fontSize: '0.75rem',
        },
      },
      button: {
        fontWeight: 600,
        fontSize: '0.95rem',
        letterSpacing: '0.03em',
        '@media (max-width:600px)': {
          fontSize: '0.85rem',
        },
      },
    },
    shape: {
      borderRadius: designTokens.borderRadius.md,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: tokens.background.default,
            fontFeatureSettings: '"cv11", "ss01"',
            fontVariationSettings: '"opsz" 32',
            // Scrollbar minimalista com tons de prata
            '&::-webkit-scrollbar': {
              width: '6px',
            },
                        '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: tokens.border.strong,
              borderRadius: '3px',
              '&:hover': {
                backgroundColor: tokens.secondary,
              },
            },
            scrollbarWidth: 'thin',
            scrollbarColor: `${tokens.border.strong} transparent`,
          },
          '*': {
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: tokens.border.strong,
              borderRadius: '3px',
              '&:hover': {
                backgroundColor: tokens.secondary,
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: tokens.background.gradient,
            color: tokens.text.primary,
            boxShadow: shadows.gradient,
            borderBottom: `1px solid ${tokens.border.light}`,
            backdropFilter: 'blur(12px)',
            '@media (max-width:600px)': {
              minHeight: 48,
              paddingLeft: 8,
              paddingRight: 8,
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: tokens.background.gradient,
            borderRight: `1px solid ${tokens.border.light}`,
            boxShadow: shadows.md,
            '@media (max-width:600px)': {
              minWidth: '70vw',
              maxWidth: '100vw',
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: designTokens.borderRadius.md,
            margin: `${designTokens.spacing.xs}px 0`,
            color: tokens.text.secondary,
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            minHeight: 48,
            padding: '8px 16px',
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: tokens.surface.secondary,
              color: tokens.text.primary,
              boxShadow: shadows.sm, // Adiciona sombra sutil no hover
            },
            '&.Mui-selected': {
              background: `linear-gradient(135deg, ${tokens.primary} 0%, ${tokens.primaryDark} 100%)`,
              color: '#ffffff',
              boxShadow: shadows.md, // Sombra mais pronunciada no item selecionado
              '&:hover': {
                background: `linear-gradient(135deg, ${tokens.primaryDark} 0%, ${tokens.primary} 100%)`,
                boxShadow: shadows.lg,
              },
              '& .MuiListItemIcon-root': {
                color: '#ffffff',
              },
            },
            '@media (max-width:600px)': {
              minHeight: 36,
              padding: '6px 8px',
              fontSize: '0.95rem',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: tokens.surface.warm,
            boxShadow: shadows.sm,
            border: `1px solid ${tokens.border.light}`,
            borderRadius: designTokens.borderRadius.lg,
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: shadows.md, // Efeito hover mais elegante
              borderColor: tokens.border.medium,
            },
            '@media (max-width:600px)': {
              padding: 8,
              margin: '8px 0',
              maxWidth: '100%',
              borderRadius: designTokens.borderRadius.md,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            borderRadius: designTokens.borderRadius.md,
            fontSize: '0.875rem',
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            padding: '8px 20px',
            minHeight: 40,
            '@media (max-width:600px)': {
              fontSize: '0.8rem',
              padding: '6px 12px',
              minHeight: 32,
            },
          },
          contained: {
            boxShadow: shadows.sm,
            '&:hover': {
              boxShadow: shadows.md,
              transform: 'translateY(-1px)', // Efeito de elevação sutil
            },
          },
          outlined: {
            borderColor: tokens.border.medium,
            color: tokens.text.primary,
            '&:hover': {
              borderColor: tokens.border.strong,
              backgroundColor: tokens.surface.secondary,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: designTokens.borderRadius.sm,
            fontWeight: 500,
            fontSize: '0.75rem',
            height: 24,
            backgroundColor: tokens.surface.tertiary,
            color: tokens.text.primary,
            border: `1px solid ${tokens.border.light}`,
            '@media (max-width:600px)': {
              fontSize: '0.7rem',
              height: 20,
              padding: '0 6px',
            },
          },
          outlined: {
            backgroundColor: 'transparent',
            borderColor: tokens.border.medium,
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            boxShadow: shadows.sm, // Sombra sutil nos avatares
            width: 40,
            height: 40,
            fontSize: '1rem',
            '@media (max-width:600px)': {
              width: 32,
              height: 32,
              fontSize: '0.85rem',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: tokens.surface.primary,
            backgroundImage: 'none', // Remove gradiente padrão do MUI
            '@media (max-width:600px)': {
              borderRadius: designTokens.borderRadius.md,
              padding: 8,
            },
          },
          elevation1: {
            boxShadow: shadows.sm,
          },
          elevation2: {
            boxShadow: shadows.md,
          },
          elevation3: {
            boxShadow: shadows.lg,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: tokens.surface.warm,
              '& fieldset': {
                borderColor: tokens.border.light,
              },
              '&:hover fieldset': {
                borderColor: tokens.border.medium,
              },
              '&.Mui-focused fieldset': {
                borderColor: tokens.primary,
                borderWidth: '2px',
              },
              '@media (max-width:600px)': {
                padding: '6px 8px',
                fontSize: '0.95rem',
                minHeight: 36,
              },
            },
            '@media (max-width:600px)': {
              margin: '8px 0',
              width: '100%',
            },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: tokens.surface.primary,
            border: `1px solid ${tokens.border.light}`,
            boxShadow: shadows.lg,
            backdropFilter: 'blur(12px)',
            minWidth: 220,
            '@media (max-width:600px)': {
              minWidth: 140,
              padding: '4px 0',
            },
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: tokens.text.primary,
            '&:hover': {
              backgroundColor: tokens.surface.secondary,
            },
            '&.Mui-selected': {
              backgroundColor: alpha(tokens.primary, 0.1),
              color: tokens.primary,
              '&:hover': {
                backgroundColor: alpha(tokens.primary, 0.15),
              },
            },
            '@media (max-width:600px)': {
              fontSize: '0.95rem',
              minHeight: 36,
              padding: '6px 12px',
            },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: tokens.border.light,
            '@media (max-width:600px)': {
              margin: '8px 0',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: tokens.text.secondary,
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: tokens.surface.secondary,
              color: tokens.text.primary,
              transform: 'scale(1.05)', // Efeito de escala sutil
            },
            '@media (max-width:600px)': {
              padding: 6,
              fontSize: '1.1rem',
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: tokens.surface.tertiary,
            color: tokens.text.primary,
            border: `1px solid ${tokens.border.light}`,
            boxShadow: shadows.md,
            fontSize: '0.75rem',
            '@media (max-width:600px)': {
              fontSize: '0.7rem',
              padding: 6,
              borderRadius: designTokens.borderRadius.sm,
            },
          },
        },
      },
    },
  });

  return responsiveFontSizes(baseTheme);
};

// Declaração de módulo para TypeScript reconhecer as cores customizadas e design tokens
declare module '@mui/material/styles' {
  interface Theme {
    designTokens: typeof designTokens;
    customColors: {
      // Transparências de sucesso
      successAlpha10: string;
      successAlpha20: string;
      successAlpha30: string;
      successAlpha40: string;
      successAlpha50: string;
      successAlpha60: string;
      successAlpha70: string;
      successAlpha80: string;
      successAlpha90: string;
      
      // Transparências de warning
      warningAlpha10: string;
      warningAlpha20: string;
      warningAlpha30: string;
      warningAlpha40: string;
      warningAlpha50: string;
      warningAlpha60: string;
      warningAlpha70: string;
      warningAlpha80: string;
      warningAlpha90: string;
      
      // Transparências de error
      errorAlpha10: string;
      errorAlpha20: string;
      errorAlpha30: string;
      errorAlpha40: string;
      errorAlpha50: string;
      errorAlpha60: string;
      errorAlpha70: string;
      errorAlpha80: string;
      errorAlpha90: string;
      
      // Transparências de info
      infoAlpha10: string;
      infoAlpha20: string;
      infoAlpha30: string;
      infoAlpha40: string;
      infoAlpha50: string;
      infoAlpha60: string;
      infoAlpha70: string;
      infoAlpha80: string;
      infoAlpha90: string;
      
      // Transparências de primary
      primaryAlpha10: string;
      primaryAlpha20: string;
      primaryAlpha30: string;
      primaryAlpha40: string;
      primaryAlpha50: string;
      primaryAlpha60: string;
      primaryAlpha70: string;
      primaryAlpha80: string;
      primaryAlpha90: string;
      
      // Cores de superfície customizadas
      surface: {
        primary: string;
        secondary: string;
        tertiary: string;
        warm: string;
      };
      
      // Cores de borda customizadas
      border: {
        light: string;
        medium: string;
        strong: string;
      };
    };
  }
  
  interface ThemeOptions {
    designTokens?: typeof designTokens;
    customColors?: {
      // Transparências de sucesso
      successAlpha10?: string;
      successAlpha20?: string;
      successAlpha30?: string;
      successAlpha40?: string;
      successAlpha50?: string;
      successAlpha60?: string;
      successAlpha70?: string;
      successAlpha80?: string;
      successAlpha90?: string;
      
      // Transparências de warning
      warningAlpha10?: string;
      warningAlpha20?: string;
      warningAlpha30?: string;
      warningAlpha40?: string;
      warningAlpha50?: string;
      warningAlpha60?: string;
      warningAlpha70?: string;
      warningAlpha80?: string;
      warningAlpha90?: string;
      
      // Transparências de error
      errorAlpha10?: string;
      errorAlpha20?: string;
      errorAlpha30?: string;
      errorAlpha40?: string;
      errorAlpha50?: string;
      errorAlpha60?: string;
      errorAlpha70?: string;
      errorAlpha80?: string;
      errorAlpha90?: string;
      
      // Transparências de info
      infoAlpha10?: string;
      infoAlpha20?: string;
      infoAlpha30?: string;
      infoAlpha40?: string;
      infoAlpha50?: string;
      infoAlpha60?: string;
      infoAlpha70?: string;
      infoAlpha80?: string;
      infoAlpha90?: string;
      
      // Transparências de primary
      primaryAlpha10?: string;
      primaryAlpha20?: string;
      primaryAlpha30?: string;
      primaryAlpha40?: string;
      primaryAlpha50?: string;
      primaryAlpha60?: string;
      primaryAlpha70?: string;
      primaryAlpha80?: string;
      primaryAlpha90?: string;
      
      // Cores de superfície customizadas
      surface?: {
        primary?: string;
        secondary?: string;
        tertiary?: string;
        warm?: string;
      };
      
      // Cores de borda customizadas
      border?: {
        light?: string;
        medium?: string;
        strong?: string;
      };
    };
  }
}
