//sistema
import React, { useState, Suspense, lazy } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ReplayIcon from "@mui/icons-material/Replay";
import Layout from "./components/Layout";
import CPFForm from "./components/CPFForm";
const ResultsList = lazy(() => import("./components/ResultsList"));
import { fetchPertences } from "./services/api";
import { Pertence } from "./types";

const App: React.FC = () => {
  const [pertences, setPertences] = useState<Pertence[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedCpfCnpj, setSearchedCpfCnpj] = useState<string>("");
  const theme = useTheme();

  React.useEffect(() => {
    const handleUnload = () => {
      try {
        localStorage.clear();
        sessionStorage.clear();
        if ("caches" in window) {
          caches.keys().then((keys) => {
            keys.forEach((key) => caches.delete(key));
          });
        }
      } catch (e) {
        // Silenciar erros de limpeza
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

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
        disableGutters
        sx={{
          pt: { xs: 1, sm: 2 },
          pb: { xs: 0.1, sm: 2 },
          px: { xs: 0.5, sm: 2 },
          boxShadow: { xs: theme.shadows[2], md: theme.shadows[20] },
          background: {
            xs: "linear-gradient(to bottom, #d7dee6ff 0%, #d0d7dfff 60%, #ced5ddff 100%)",
            sm: "linear-gradient(90deg, #d7dee6ff 0%, #d0d7dfff 60%, #ced5ddff 100%)",
          },
          borderRadius: { xs: 0, sm: 3 },
          minHeight: { xs: "80dvh", sm: "auto" },
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 1, sm: 2 },
            py: { xs: 1, sm: 1.5 },
            background: "transparent",
            borderRadius: { xs: 0, sm: 3 },
            border: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: { xs: 0.5, sm: 1 },
            }}
          >
            <img
              src="/images/Logo_consulta_unificada3_1.webp"
              alt="Consulta Unificada"
              width={495}
              height={135}
              style={{
                maxWidth: "495px",
                width: "100%",
                height: "auto",
                display: "block",
                margin: 0,
              }}
            />
          </Box>

          {/* Botão de voltar para nova consulta */}
          {(pertences.length > 0 || error) && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: { xs: 1.5, sm: 2 },
              }}
            >
              <Tooltip title="Nova consulta">
                <IconButton
                  color="primary"
                  onClick={() => {
                    setPertences([]);
                    setError(null);
                    setSearchedCpfCnpj("");
                  }}
                  size={window.innerWidth <= 600 ? "medium" : "large"}
                  aria-label="Nova consulta"
                  sx={{
                    boxShadow: theme.shadows[1],
                    borderRadius: theme.shape.borderRadius,
                  }}
                >
                  <ReplayIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Formulário de busca centralizado */}
          {!pertences.length && !loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                my: { xs: 1, sm: 2 },
                px: { xs: 0.5, sm: 0 },
              }}
            >
              <Box sx={{ width: "100%", maxWidth: { xs: 340, sm: 600 } }}>
                <CPFForm onSearch={handleSearch} loading={loading} />
              </Box>
            </Box>
          )}
        </Box>

        {/* Mensagem de erro */}
        {error && (
          <Box
            sx={{
              mb: { xs: 2, sm: 3 },
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Alert
              severity="error"
              sx={{
                maxWidth: { xs: 320, sm: 500 },
                width: "100%",
                backgroundColor:
                  theme.customColors?.errorAlpha10 || "rgba(244, 67, 54, 0.1)",
                border: `1px solid ${
                  theme.customColors?.errorAlpha30 || "rgba(244, 67, 54, 0.3)"
                }`,
                borderRadius: 2,
                fontSize: { xs: "0.92rem", sm: "1rem" },
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
        <Suspense fallback={<div>Carregando resultados...</div>}>
          <ResultsList
            pertences={pertences}
            loading={loading}
            cpfCnpj={searchedCpfCnpj}
          />
        </Suspense>
      </Container>
    </Layout>
  );
};

export default App;
