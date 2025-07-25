import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  useTheme,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { formatCpfCnpj, validateDocument } from "../utils/validation";

interface CPFFormProps {
  onSearch: (cpfCnpj: string) => void;
  loading: boolean;
}

const CPFForm: React.FC<CPFFormProps> = ({ onSearch, loading }) => {
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [error, setError] = useState("");
  const theme = useTheme();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanValue = cpfCnpj.replace(/\D/g, "");

    if (validateDocument(cleanValue)) {
      setError("");
      onSearch(cleanValue);
    } else {
      setError("CPF/CNPJ inválido. Verifique os dados e tente novamente.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatCpfCnpj(value);
    setCpfCnpj(formattedValue);
    setError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permite apenas números, pontos, traços e barras
    const allowedChars = /[0-9.\-/]/;
    if (
      !allowedChars.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab"
    ) {
      e.preventDefault();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: { xs: 320, sm: 380 },
        mb: 4,
        px: { xs: 2, sm: 0 },
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 500,
          background:
            theme.customColors?.surface?.warm || theme.palette.background.paper,
          borderRadius: theme.designTokens?.borderRadius.xl || 6,
          border: `1.5px solid ${
            theme.customColors?.border?.light || theme.palette.divider
          }`,
          boxShadow: theme.shadows[2],
          transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: theme.shadows[6] || theme.shadows[4],
            borderColor:
              theme.customColors?.border?.medium || theme.palette.divider,
          },
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ mb: 2, textAlign: "center" }}>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                mb: 0.5,
                fontSize: { xs: "1.08rem", sm: "1.18rem" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
              component="div"
            >
              <span role="img" aria-label="lupa"></span>{" "}
              <b>Tudo em um só lugar!</b>
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
                letterSpacing: "0.01em",
                lineHeight: 1.7,
                fontSize: { xs: "0.98rem", sm: "1.05rem" },
                mb: 1.2,
              }}
              component="div"
            >
              Com o novo sistema, você não precisa mais procurar opção por
              opção.
              <br />
              <br />
              Digite seu <b>CPF ou CNPJ</b> e visualize, de forma centralizada:
              <Box
                component="ul"
                sx={{
                  listStyle: "none",
                  p: 0,
                  m: 0,
                  textAlign: "left",
                  display: "inline-block",
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  fontSize: "inherit",
                  lineHeight: 1.7,
                  mb: 1,
                }}
              >
                <li>✔ Todos os seus imóveis, empresas e vínculos</li>
                <li>✔ Pendências e débitos em aberto</li>
                <li>✔ Certidões e declarações disponíveis para emissão</li>
              </Box>
              <br />
              <b>
                Sem senha. Sem cadastro.
                <br />É só digitar e clicar na lupa!
              </b>
            </Typography>
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                id="cpfCnpj"
                value={cpfCnpj}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Digite seu CPF ou CNPJ"
                fullWidth
                variant="outlined"
                disabled={loading}
                error={!!error}
                inputProps={{
                  maxLength: 18,
                  autoComplete: "off",
                  "aria-describedby": error ? "cpf-error" : undefined,
                  style: {
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    fontSize: "1.08rem",
                    background: "transparent",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor:
                      theme.customColors?.surface?.warm ||
                      theme.palette.background.paper,
                    borderRadius: theme.designTokens?.borderRadius.lg || 3,
                    boxShadow: error
                      ? `0 0 0 2px ${
                          theme.customColors?.errorAlpha20 ||
                          "rgba(244,67,54,0.18)"
                        }`
                      : `0 1.5px 6px 0 ${
                          theme.customColors?.primaryAlpha10 ||
                          "rgba(58,123,213,0.08)"
                        }`,
                    transition: "box-shadow 0.18s cubic-bezier(0.4,0,0.2,1)",
                    "& fieldset": {
                      borderColor: error
                        ? theme.palette.error.main
                        : theme.customColors?.border?.light ||
                          theme.palette.divider,
                      borderWidth: error ? 2 : 1.5,
                    },
                    "&:hover fieldset": {
                      borderColor: error
                        ? theme.palette.error.main
                        : theme.customColors?.border?.medium ||
                          theme.palette.action.hover,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: error
                        ? theme.palette.error.main
                        : theme.palette.primary.main,
                      borderWidth: "2px",
                    },
                    "&.Mui-disabled": {
                      backgroundColor:
                        theme.customColors?.surface?.secondary ||
                        theme.palette.action.disabledBackground,
                    },
                  },
                }}
              />
              <IconButton
                type="submit"
                color="primary"
                disabled={loading || !cpfCnpj.trim()}
                aria-label={loading ? "Consultando..." : "Consultar Pertences"}
                sx={{
                  ml: { xs: 0, sm: 1 },
                  height: 48,
                  width: 48,
                  minWidth: 40,
                  minHeight: 40,
                  borderRadius: "50%",
                  background: loading
                    ? theme.customColors?.primaryAlpha20
                    : theme.customColors?.primaryAlpha10,
                  boxShadow: loading
                    ? `0 0 0 2px ${
                        theme.customColors?.primaryAlpha30 ||
                        "rgba(58,123,213,0.18)"
                      }`
                    : theme.shadows[2],
                  color: theme.palette.primary.main,
                  border: `1.5px solid ${
                    theme.customColors?.primaryAlpha30 ||
                    theme.palette.primary.light
                  }`,
                  transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
                  "&:hover": {
                    background: theme.customColors?.primaryAlpha30,
                    color: "#fff",
                    boxShadow: theme.shadows[4],
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-disabled": {
                    background: theme.customColors?.surface?.secondary,
                    color: theme.palette.action.disabled,
                    borderColor: theme.palette.action.disabled,
                  },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                {loading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  <SearchIcon fontSize="inherit" />
                )}
              </IconButton>
            </Box>
            {error && (
              <Alert
                severity="error"
                id="cpf-error"
                sx={{
                  backgroundColor:
                    theme.customColors?.errorAlpha10 ||
                    "rgba(244, 67, 54, 0.1)",
                  border: `1.5px solid ${
                    theme.customColors?.errorAlpha30 || "rgba(244, 67, 54, 0.3)"
                  }`,
                  color: theme.palette.error.main,
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                  mt: 0.5,
                  "& .MuiAlert-icon": {
                    color: theme.palette.error.main,
                  },
                }}
              >
                {error}
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CPFForm;
