import { createTheme, responsiveFontSizes, alpha } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

// Design tokens aprimorados com tons de prata elegantes para o tema claro
const designTokens = {
  colors: {
    light: {
      primary: '#8b5cf6', // Mantém a cor vibrante
      primaryLight: '#a78bfa',
      primaryDark: '#7c3aed',
      secondary: '#374151', // Mais escuro para melhor contraste
      background: {
        default: '#f8fafc', // Base mais clara e elegante
        paper: '#ffffff',
        elevated: '#f1f5f9', // Tom prata claro
        gradient: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 30%, #e2e8f0 70%, #cbd5e1 100%)', // Degradê prata elegante
      },
      surface: {
        primary: '#ffffff',
        secondary: '#f8fafc', // Prata muito claro
        tertiary: '#f1f5f9', // Prata claro
        warm: '#fefefe', // Branco quente
      },
      text: {
        primary: '#0f172a', // Quase preto para máximo contraste
        secondary: '#334155', // Cinza escuro elegante
        tertiary: '#64748b', // Cinza médio
        disabled: '#94a3b8', // Cinza claro
      },
      border: {
        light: '#e2e8f0', // Prata muito claro
        medium: '#cbd5e1', // Prata médio
        strong: '#94a3b8', // Prata escuro
      },
      status: {
        success: '#047857', // Verde mais escuro e elegante
        successLight: '#6ee7b7', // Verde claro prata
        successDark: '#065f46', // Verde muito escuro
        warning: '#b45309', // Âmbar mais escuro
        warningLight: '#fcd34d', // Âmbar claro
        warningDark: '#92400e', // Âmbar escuro
        error: '#b91c1c', // Vermelho mais escuro
        errorLight: '#fca5a5', // Vermelho claro
        errorDark: '#991b1b', // Vermelho muito escuro
        info: '#1e40af', // Azul mais escuro
        infoLight: '#93c5fd', // Azul claro
        infoDark: '#1e3a8a', // Azul muito escuro
      }
    },
    dark: {
      primary: '#8b5cf6',
      primaryLight: '#a78bfa',
      primaryDark: '#7c3aed',
      secondary: '#94a3b8',
      background: {
        default: '#0f172a',
        paper: '#1e293b',
        elevated: '#334155',
        gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      },
      surface: {
        primary: '#1e293b',
        secondary: '#334155',
        tertiary: '#475569',
        warm: '#1e293b',
      },
      text: {
        primary: '#f8fafc',
        secondary: '#e2e8f0',
        tertiary: '#cbd5e1',
        disabled: '#64748b',
      },
      border: {
        light: '#334155',
        medium: '#475569',
        strong: '#64748b',
      },
      status: {
        success: '#10b981',
        successLight: '#34d399',
        successDark: '#059669',
        warning: '#f59e0b',
        warningLight: '#fbbf24',
        warningDark: '#d97706',
        error: '#ef4444',
        errorLight: '#f87171',
        errorDark: '#dc2626',
        info: '#3b82f6',
        infoLight: '#60a5fa',
        infoDark: '#2563eb',
      }
    }
  },
  layout: {
    maxWidth: {
      xs: '100%',
      sm: 600,
      md: 960,
      lg: 1600,
      xl: 1700,
      xxl: 1800,
    },
    containerPadding: {
      xs: 16,
      sm: 24,
      md: 32,
      lg: 40,
    },
    contentWidth: {
      narrow: 600,   // Para formulários simples
      medium: 800,   // Para conteúdo padrão
      wide: 1000,    // Para tabelas e dashboards
      full: 1200,    // Para páginas completas
      extraWide: 1400, // Para relatórios e análises
    },
    sectionSpacing: {
      xs: 16,
      sm: 24,
      md: 32,
      lg: 48,
      xl: 64,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 20,
    xl: 28,
    xxl: 40,
  },
  borderRadius: {
    sm: 3,
    md: 3,
    lg: 3,
    xl: 3,
  },
  shadows: {
    light: {
      sm: '0 1px 3px 0 rgb(0 0 0 / 0.12), 0 1px 2px 0 rgb(0 0 0 / 0.08)', // Sombras mais definidas
      md: '0 4px 6px -1px rgb(0 0 0 / 0.15), 0 2px 4px -2px rgb(0 0 0 / 0.12)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.15), 0 4px 6px -4px rgb(0 0 0 / 0.12)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.12)',
      gradient: '0 4px 20px -2px rgb(139 92 246 / 0.20)', // Sombra do primary mais intensa
    },
    dark: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)',
      gradient: '0 4px 20px -2px rgb(139 92 246 / 0.2)',
    }
  }
};

export const createAppTheme = (prefersDarkMode: boolean): Theme => {
  const tokens = prefersDarkMode ? designTokens.colors.dark : designTokens.colors.light;
  const shadows = prefersDarkMode ? designTokens.shadows.dark : designTokens.shadows.light;

  const baseTheme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      primary: {
        main: tokens.primary,
        light: tokens.primaryLight,
        dark: tokens.primaryDark,
      },
      secondary: {
        main: tokens.secondary,
      },
      background: {
        default: tokens.background.default,
        paper: tokens.surface.primary,
      },
      text: {
        primary: tokens.text.primary,
        secondary: tokens.text.secondary,
      },
      success: {
        main: tokens.status.success,
        light: tokens.status.successLight,
        dark: tokens.status.successDark,
      },
      warning: {
        main: tokens.status.warning,
        light: tokens.status.warningLight,
        dark: tokens.status.warningDark,
      },
      error: {
        main: tokens.status.error,
        light: tokens.status.errorLight,
        dark: tokens.status.errorDark,
      },
      info: {
        main: tokens.status.info,
        light: tokens.status.infoLight,
        dark: tokens.status.infoDark,
      },
      divider: tokens.border.medium,
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
      primaryAlpha10: alpha(tokens.primary, 0.1),
      primaryAlpha20: alpha(tokens.primary, 0.2),
      primaryAlpha30: alpha(tokens.primary, 0.3),
      primaryAlpha40: alpha(tokens.primary, 0.4),
      primaryAlpha50: alpha(tokens.primary, 0.5),
      primaryAlpha60: alpha(tokens.primary, 0.6),
      primaryAlpha70: alpha(tokens.primary, 0.7),
      primaryAlpha80: alpha(tokens.primary, 0.8),
      primaryAlpha90: alpha(tokens.primary, 0.9),
      
      // Cores de superfície customizadas
      surface: {
        primary: tokens.surface.primary,
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
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.25rem',
        lineHeight: 1.2,
        letterSpacing: '-0.025em',
      },
      h2: {
        fontWeight: 600,
        fontSize: '1.875rem',
        lineHeight: 1.3,
        letterSpacing: '-0.025em',
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.4,
        letterSpacing: '-0.025em',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
        fontWeight: 400,
      },
      body2: {
        fontSize: '0.8125rem',
        lineHeight: 1.5,
        fontWeight: 400,
      },
      caption: {
        fontSize: '0.75rem',
        lineHeight: 1.4,
        fontWeight: 500,
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
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: tokens.background.gradient,
            borderRight: `1px solid ${tokens.border.light}`,
            boxShadow: shadows.md,
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
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: designTokens.borderRadius.md,
            fontSize: '0.875rem',
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
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
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: tokens.surface.primary,
            backgroundImage: 'none', // Remove gradiente padrão do MUI
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
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: tokens.border.light,
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
