//sistema
import React, { useState } from "react";
import { Box, Typography, Container, Alert, useTheme } from "@mui/material";
import Layout from "./components/Layout";
import CPFForm from "./components/CPFForm";
import ResultsList from "./components/ResultsList";
import { fetchPertences } from "./services/api";
import { Pertence } from "./types";

const App: React.FC = () => {
  const [pertences, setPertences] = useState<Pertence[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedCpfCnpj, setSearchedCpfCnpj] = useState<string>("");
  const theme = useTheme();

  const handleSearch = async (cpfCnpj: string) => {
    setLoading(true);
    setError(null);
    setSearchedCpfCnpj(cpfCnpj);

    try {
      const results = await fetchPertences(cpfCnpj);
      setPertences(results);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao buscar os pertences. Tente novamente.";
      setError(errorMessage);
      setPertences([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: 6,
            py: 6,
            background: `linear-gradient(135deg, ${
              theme.customColors?.surface?.warm ||
              theme.palette.background.paper
            } 0%, ${
              theme.customColors?.surface?.secondary ||
              theme.palette.background.default
            } 100%)`,
            borderRadius: 3,
            border: `1px solid ${
              theme.customColors?.border?.light || theme.palette.divider
            }`,
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textAlign: "center",
              mb: 2,
            }}
          >
            Consulte seus Pertences
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: "auto",
              fontSize: { xs: "1rem", sm: "1.125rem" },
              lineHeight: 1.6,
            }}
          >
            Digite seu CPF ou CNPJ para consultar seus vínculos
          </Typography>
          {/* Formulário de busca centralizado */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
              mt: 4,
              px: { xs: 2, sm: 0 },
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 500 }}>
              <CPFForm onSearch={handleSearch} loading={loading} />
            </Box>
          </Box>
        </Box>

        {/* Mensagem de erro */}
        {error && (
          <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
            <Alert
              severity="error"
              sx={{
                maxWidth: 500,
                width: "100%",
                backgroundColor:
                  theme.customColors?.errorAlpha10 || "rgba(244, 67, 54, 0.1)",
                border: `1px solid ${
                  theme.customColors?.errorAlpha30 || "rgba(244, 67, 54, 0.3)"
                }`,
                borderRadius: 2,
                "& .MuiAlert-icon": {
                  color: theme.palette.error.main,
                },
              }}
            >
              {error}
            </Alert>
          </Box>
        )}

        {/* Lista de resultados */}
        <ResultsList
          pertences={pertences}
          loading={loading}
          cpfCnpj={searchedCpfCnpj}
        />
      </Container>
    </Layout>
  );
};

export default App;
