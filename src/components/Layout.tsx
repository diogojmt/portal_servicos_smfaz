import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Paper,
  IconButton,
  useTheme,
} from "@mui/material";
import { config } from "../utils/config";
import { useThemeContext } from "../contexts/ThemeContext";

// Import dos ícones
const Brightness4Icon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.515 4.929L4.929 3.515L7.05 5.636L5.636 7.05L3.515 4.929ZM16.95 18.364L18.364 16.95L20.485 19.071L19.071 20.485L16.95 18.364ZM19.071 3.515L20.485 4.929L18.364 7.05L16.95 5.636L19.071 3.515ZM5.636 16.95L7.05 18.364L4.929 20.485L3.515 19.071L5.636 16.95ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z"
      fill="currentColor"
    />
  </svg>
);

const Brightness7Icon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18Z"
      fill="currentColor"
    />
  </svg>
);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();
  const { actualMode, toggleTheme } = useThemeContext();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background:
          theme.customColors?.surface?.primary ||
          theme.palette.background.default,
        [theme.breakpoints.down("sm")]: {
          background: theme.palette.background.default,
        },
      }}
    >
      {/* Skip Link para acessibilidade */}
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: "fixed",
          top: -100,
          left: 16,
          zIndex: 10000,
          padding: { xs: 0.5, sm: 1 },
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          textDecoration: "none",
          borderRadius: 1,
          fontSize: { xs: "0.85rem", sm: "1rem" },
          "&:focus": {
            top: 16,
          },
        }}
      >
        Pular para o conteúdo principal
      </Box>

      {/* Header fixo */}
      <AppBar
        position="sticky"
        elevation={2}
        sx={{
          top: 0,
          zIndex: 1200,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${
            theme.customColors?.border?.light || theme.palette.divider
          }`,
          boxShadow:
            theme.designTokens?.shadows?.light?.sm ||
            "0 2px 8px rgba(0, 0, 0, 0.1)",
          background: {
            xs: "linear-gradient(to bottom, #fff 0%, #fff 60%, #e0e0e0 100%)",
            sm: "linear-gradient(135deg, #fff 0%, #fff 60%, #e0e0e0 100%)",
          },
          minHeight: 32,
          [theme.breakpoints.down("sm")]: {
            minHeight: 28,
            px: 1,
          },
        }}
      >
        <Toolbar
          sx={{
            justifyContent: { xs: "center", sm: "space-between" },
            py: { xs: 0, sm: 0 },
            minHeight: { xs: 28, sm: 32 },
            px: { xs: 0, sm: 2 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "center" },
              justifyContent: { xs: "center", sm: "flex-start" },
              gap: { xs: 0.5, sm: 2 },
            }}
          >
            <img
              src="/images/logo-arapiraca.webp"
              alt="Prefeitura de Arapiraca"
              width={100}
              height={50}
              style={{
                height: 100,
                width: "auto",
                marginBottom: 2,
                marginRight: 0,
                // Reduz o espaço entre logo e texto no mobile
                ...(theme.breakpoints.down("sm") && { marginBottom: 0 }),
              }}
            />
            <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.2,
                  fontSize: { xs: "1.08rem", sm: "1.25rem" },
                  letterSpacing: { xs: "-0.01em", sm: 0 },
                  color: theme.palette.text.primary,
                  [theme.breakpoints.down("sm")]: {
                    fontSize: "1.08rem",
                  },
                }}
              >
                Portal do Contribuinte
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  opacity: 1,
                  display: "block",
                  lineHeight: 1,
                  fontSize: { xs: "0.75rem", sm: "0.8rem" },
                }}
              >
                Prefeitura de {config.municipality}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Conteúdo principal */}
      <Box
        component="main"
        id="main-content"
        role="main"
        sx={{
          flex: 1,
          py: { xs: 2, sm: 4 },
          minHeight: { xs: "calc(100vh - 100px)", sm: "calc(100vh - 120px)" },
          background: {
            xs: theme.palette.background.default,
            sm: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
          {children}
        </Container>
      </Box>

      {/* Footer sempre visível */}
      <Paper
        component="footer"
        role="contentinfo"
        square
        elevation={2}
        sx={{
          backgroundColor:
            theme.customColors?.surface?.tertiary ||
            theme.palette.background.paper,
          borderTop: `1px solid ${
            theme.customColors?.border?.light || theme.palette.divider
          }`,
          py: { xs: 1, sm: 2 },
          position: "sticky",
          bottom: 0,
          zIndex: 1100,
          backdropFilter: "blur(8px)",
          boxShadow:
            theme.designTokens?.shadows?.light?.sm ||
            "0 -2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: { xs: 1, sm: 2 },
              flexDirection: { xs: "column", sm: "row" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                flex: { sm: 1 },
                fontSize: { xs: "0.85rem", sm: "1rem" },
                color: theme.palette.text.secondary,
                opacity: 1,
              }}
            >
              &copy; {currentYear} Prefeitura Municipal de {config.municipality}
              . Todos os direitos reservados.
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                opacity: 0.85,
                whiteSpace: "nowrap",
                fontSize: { xs: "0.7rem", sm: "0.85rem" },
              }}
            >
              Versão {config.appVersion}
            </Typography>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default Layout;
