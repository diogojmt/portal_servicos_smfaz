import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
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
          borderRadius: 2,
          border: `1px solid ${
            theme.customColors?.border?.light || theme.palette.divider
          }`,
          "&:hover": {
            boxShadow: theme.shadows[4],
            borderColor:
              theme.customColors?.border?.medium || theme.palette.divider,
          },
          transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <Box>
              <Typography
                variant="h6"
                component="label"
                htmlFor="cpfCnpj"
                sx={{
                  display: "block",
                  mb: 1,
                  fontWeight: 600,
                  color: "text.primary",
                }}
              >
                CPF/CNPJ
              </Typography>
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
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor:
                      theme.customColors?.surface?.warm ||
                      theme.palette.background.paper,
                    "& fieldset": {
                      borderColor: error
                        ? theme.palette.error.main
                        : theme.customColors?.border?.light ||
                          theme.palette.divider,
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
            </Box>

            {error && (
              <Alert
                severity="error"
                id="cpf-error"
                sx={{
                  backgroundColor:
                    theme.customColors?.errorAlpha10 ||
                    "rgba(244, 67, 54, 0.1)",
                  border: `1px solid ${
                    theme.customColors?.errorAlpha30 || "rgba(244, 67, 54, 0.3)"
                  }`,
                  "& .MuiAlert-icon": {
                    color: theme.palette.error.main,
                  },
                }}
              >
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || !cpfCnpj.trim()}
              fullWidth
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
              sx={{
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                background: loading
                  ? theme.palette.action.disabledBackground
                  : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: loading ? "none" : theme.shadows[2],
                "&:hover": {
                  background: loading
                    ? theme.palette.action.disabledBackground
                    : `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  boxShadow: loading ? "none" : theme.shadows[4],
                  transform: loading ? "none" : "translateY(-1px)",
                },
                "&:disabled": {
                  color: theme.palette.text.disabled,
                  background: theme.palette.action.disabledBackground,
                },
                transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              aria-label={loading ? "Consultando..." : "Consultar Pertences"}
            >
              {loading ? "Consultando..." : "Consultar Pertences"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CPFForm;
