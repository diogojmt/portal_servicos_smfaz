//sistema
import React, { useState } from "react";
import { Box, Typography, Container, Alert, useTheme, IconButton, Tooltip } from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';
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
      <Container
        maxWidth="lg"
        sx={{
          py: 1, // Reduzido para menor altura superior/inferior
          boxShadow: theme.shadows[20],
          background:
            "linear-gradient(135deg, #b6c1d6ff 0%, #dde3ecff 50%, #b2bac4ff 100%)",
          borderRadius: 3,
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: 2, // Reduz margem inferior do bloco principal
            py: 1.5, // Reduz padding vertical interno
            background: "transparent",
            borderRadius: 3,
            border: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 1,
            }}
          >
            <img
              src="/public/images/Logo_consulta_unificada3.png"
              alt="Consulta Unificada"
              style={{
                maxWidth: "300px",
                width: "100%",
                height: "auto",
                display: "block",
                margin: "0", // reduzido para menor impacto vertical
              }}
            />
          </Box>

          {/* Botão de voltar para nova consulta */}
          {(pertences.length > 0 || error) && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Tooltip title="Nova consulta">
                <IconButton
                  color="primary"
                  onClick={() => {
                    setPertences([]);
                    setError(null);
                    setSearchedCpfCnpj("");
                  }}
                  size="large"
                  aria-label="Nova consulta"
                >
                  <ReplayIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Formulário de busca centralizado */}
          {(!pertences.length && !loading) && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                my: 2,
                px: { xs: 2, sm: 0 },
              }}
            >
              <Box sx={{ width: "100%", maxWidth: 600 }}>
                <CPFForm onSearch={handleSearch} loading={loading} />
              </Box>
            </Box>
          )}
        </Box>

        {/* Mensagem de erro */}
        {error && (
          <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
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
