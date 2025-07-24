import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Tab,
  Tabs,
  Alert,
  IconButton,
  Divider,
  useTheme,
  alpha,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
} from "@mui/material";
import { Pertence, DocumentType } from "../types";
import { LoadingSkeleton } from "./Skeleton";
import { emitirDocumento, DOCUMENT_TYPES } from "../services/api";

// Ícones simples como componentes
const DashboardIcon = () => (
  <span style={{ marginRight: 8, fontSize: "1.2em" }}>📊</span>
);

const BusinessIcon = () => (
  <span style={{ marginRight: 8, fontSize: "1.2em" }}>🏢</span>
);

const HomeIcon = () => (
  <span style={{ marginRight: 8, fontSize: "1.2em" }}>🏠</span>
);

const ListIcon = () => (
  <span style={{ marginRight: 8, fontSize: "1.2em" }}>📋</span>
);

const GetAppIcon = () => (
  <span style={{ marginRight: 8, fontSize: "1.2em" }}>📄</span>
);

const VisibilityIcon = () => (
  <span style={{ marginRight: 8, fontSize: "1.2em" }}>👁️</span>
);

const DownloadIcon = () => (
  <span style={{ marginRight: 8, fontSize: "1.2em" }}>📥</span>
);

const ArticleIcon = () => (
  <span style={{ marginRight: 8, fontSize: "1.2em" }}>📄</span>
);

const CertificateIcon = () => (
  <span style={{ marginRight: 8, fontSize: "1.2em" }}>🏆</span>
);

const AssignmentIcon = () => (
  <span style={{ marginRight: 8, fontSize: "1.2em" }}>📋</span>
);

const BusinessCenterIcon = () => (
  <span style={{ marginRight: 8, fontSize: "1.2em" }}>💼</span>
);

const VerifiedIcon = () => (
  <span style={{ marginRight: 8, fontSize: "1.2em" }}>✅</span>
);

interface ResultsListProps {
  pertences: Pertence[];
  loading: boolean;
  cpfCnpj?: string;
}

interface PertencesByType {
  empresa: Pertence[];
  imoveis: Pertence[];
  outros: Pertence[];
}

const ResultsList: React.FC<ResultsListProps> = ({
  pertences,
  loading,
  cpfCnpj,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [documentMenu, setDocumentMenu] = useState<{
    anchorEl: HTMLElement | null;
    pertence: Pertence | null;
  }>({ anchorEl: null, pertence: null });
  const [loadingDocument, setLoadingDocument] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ open: false, message: "", severity: "info" });
  const theme = useTheme();

  if (loading) {
    return <LoadingSkeleton count={3} />;
  }

  if (!cpfCnpj) {
    return null;
  }

  const formatCpfCnpjForDisplay = (doc: string) => {
    const clean = doc.replace(/\D/g, "");
    if (clean.length === 11) {
      return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (clean.length === 14) {
      return clean.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
    }
    return doc;
  };

  // Organizar pertences por tipo
  const pertencesByType: PertencesByType = pertences.reduce(
    (acc, pertence) => {
      if (
        pertence.tipoContribuinte === "Empresa" ||
        pertence.tipoContribuinte === "Autônomo"
      ) {
        acc.empresa.push(pertence);
      } else if (pertence.tipoContribuinte === "Imóvel") {
        acc.imoveis.push(pertence);
      } else {
        acc.outros.push(pertence);
      }
      return acc;
    },
    { empresa: [], imoveis: [], outros: [] } as PertencesByType
  );

  const contribuinte = pertences[0]?.nomeRazaoSocial || "N/A";
  const totalComDebito = pertences.filter(
    (p) => p.situacao === "Com Débito"
  ).length;
  const totalAtivo = pertences.filter((p) => p.situacao === "Ativo").length;

  // Tipos de documentos disponíveis
  const documentTypes = [
    {
      id: DOCUMENT_TYPES.DEMONSTRATIVO,
      name: "Demonstrativo",
      icon: <ArticleIcon />,
    },
    {
      id: DOCUMENT_TYPES.CERTIDAO,
      name: "Certidão",
      icon: <CertificateIcon />,
    },
    { id: DOCUMENT_TYPES.BCI, name: "BCI", icon: <AssignmentIcon /> },
    { id: DOCUMENT_TYPES.BCM, name: "BCM", icon: <AssignmentIcon /> },
    {
      id: DOCUMENT_TYPES.ALVARA_FUNCIONAMENTO,
      name: "Alvará de Funcionamento",
      icon: <BusinessCenterIcon />,
    },
    { id: DOCUMENT_TYPES.VISA, name: "VISA", icon: <VerifiedIcon /> },
  ];

  const handleDocumentMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    pertence: Pertence
  ) => {
    setDocumentMenu({ anchorEl: event.currentTarget, pertence });
  };

  const handleDocumentMenuClose = () => {
    setDocumentMenu({ anchorEl: null, pertence: null });
  };

  const handleEmitirDocumento = async (tipoDocumento: DocumentType) => {
    if (!documentMenu.pertence) return;

    const pertence = documentMenu.pertence;
    setLoadingDocument(`${pertence.inscricao}-${tipoDocumento}`);
    handleDocumentMenuClose();

    try {
      // Determinar o tipo de contribuinte baseado no pertence
      let tipoContribuinte = "1"; // Default PF/PJ
      if (pertence.tipoContribuinte === "Imóvel") {
        tipoContribuinte = "2"; // IMOVEL
      } else if (pertence.tipoContribuinte === "Empresa") {
        tipoContribuinte = "3"; // EMPRESA
      }

      const resultado = await emitirDocumento(
        pertence.inscricao,
        tipoContribuinte,
        tipoDocumento,
        cpfCnpj || ""
      );

      if (resultado.SSALinkDocumento) {
        // Abrir o documento em uma nova aba
        window.open(resultado.SSALinkDocumento, "_blank");
        setSnackbar({
          open: true,
          message: "Documento gerado com sucesso!",
          severity: "success",
        });
      } else {
        throw new Error("Link do documento não disponível");
      }
    } catch (error) {
      console.error("Erro ao emitir documento:", error);
      setSnackbar({
        open: true,
        message:
          error instanceof Error ? error.message : "Erro ao emitir documento",
        severity: "error",
      });
    } finally {
      setLoadingDocument(null);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleActionClick = (action: string, pertence: Pertence) => {
    console.log(`Ação "${action}" para pertence:`, pertence);
    alert(`Funcionalidade "${action}" será implementada em breve!`);
  };

  const getSituacaoColor = (situacao: string) => {
    switch (situacao?.toLowerCase()) {
      case "ativo":
        return {
          backgroundColor:
            theme.customColors?.successAlpha20 ||
            alpha(theme.palette.success.main, 0.2),
          color: theme.palette.success.main,
          borderColor:
            theme.customColors?.successAlpha30 ||
            alpha(theme.palette.success.main, 0.3),
        };
      case "com débito":
        return {
          backgroundColor:
            theme.customColors?.errorAlpha20 ||
            alpha(theme.palette.error.main, 0.2),
          color: theme.palette.error.main,
          borderColor:
            theme.customColors?.errorAlpha30 ||
            alpha(theme.palette.error.main, 0.3),
        };
      default:
        return {
          backgroundColor:
            theme.customColors?.warningAlpha20 ||
            alpha(theme.palette.warning.main, 0.2),
          color: theme.palette.warning.main,
          borderColor:
            theme.customColors?.warningAlpha30 ||
            alpha(theme.palette.warning.main, 0.3),
        };
    }
  };

  const renderPertenceCard = (pertence: Pertence, index: number) => (
    <Card
      key={`${pertence.inscricao}-${index}`}
      elevation={0}
      sx={{
        mb: 2,
        border: `1px solid ${
          theme.customColors?.border?.light || theme.palette.divider
        }`,
        borderRadius: 2,
        transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: theme.shadows[4],
          borderColor:
            theme.customColors?.border?.medium || theme.palette.action.hover,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header do card */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              component="h4"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Inscrição: {pertence.inscricao}
            </Typography>
            <Chip
              label={pertence.tipoContribuinte}
              size="small"
              sx={{
                backgroundColor:
                  theme.customColors?.primaryAlpha20 ||
                  alpha(theme.palette.primary.main, 0.2),
                color: theme.palette.primary.main,
                fontWeight: 500,
              }}
            />
          </Box>
          <Chip
            label={pertence.situacao}
            sx={{
              ...getSituacaoColor(pertence.situacao),
              fontWeight: 600,
              border: "1px solid",
            }}
          />
        </Box>

        {/* Detalhes */}
        <Box sx={{ mb: 3 }}>
          {pertence.endereco && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.primary"
                gutterBottom
              >
                Endereço:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pertence.endereco}
              </Typography>
            </Box>
          )}
          {pertence.complemento && (
            <Box>
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.primary"
                gutterBottom
              >
                Detalhes:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pertence.complemento}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Ações */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => handleActionClick("Ver Débitos", pertence)}
            sx={{
              textTransform: "none",
              borderColor: theme.customColors?.border?.medium,
              "&:hover": {
                backgroundColor: theme.customColors?.surface?.secondary,
              },
            }}
          >
            Ver Débitos
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={
              loadingDocument?.startsWith(pertence.inscricao) ? (
                <CircularProgress size={16} />
              ) : (
                <DownloadIcon />
              )
            }
            onClick={(e) => handleDocumentMenuOpen(e, pertence)}
            disabled={loadingDocument?.startsWith(pertence.inscricao)}
            sx={{
              textTransform: "none",
              borderColor: theme.customColors?.border?.medium,
              "&:hover": {
                backgroundColor: theme.customColors?.surface?.secondary,
              },
            }}
          >
            {loadingDocument?.startsWith(pertence.inscricao)
              ? "Emitindo..."
              : "Emitir Documento"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  const renderResumo = () => (
    <Box>
      {/* Cards de estatísticas */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          mb: 4,
          justifyContent: { xs: "center", md: "space-between" },
        }}
      >
        <Card
          elevation={0}
          sx={{
            textAlign: "center",
            p: 2,
            border: `1px solid ${theme.customColors?.border?.light}`,
            background: theme.customColors?.surface?.warm,
            minWidth: { xs: "150px", sm: "180px" },
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(20% - 12px)",
            },
          }}
        >
          <Typography variant="h4" color="primary.main" fontWeight={700}>
            {pertences.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total de Pertences
          </Typography>
        </Card>
        <Card
          elevation={0}
          sx={{
            textAlign: "center",
            p: 2,
            border: `1px solid ${theme.customColors?.border?.light}`,
            background: theme.customColors?.surface?.warm,
            minWidth: { xs: "150px", sm: "180px" },
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(20% - 12px)",
            },
          }}
        >
          <Typography variant="h4" color="primary.main" fontWeight={700}>
            {pertencesByType.empresa.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Empresas
          </Typography>
        </Card>
        <Card
          elevation={0}
          sx={{
            textAlign: "center",
            p: 2,
            border: `1px solid ${theme.customColors?.border?.light}`,
            background: theme.customColors?.surface?.warm,
            minWidth: { xs: "150px", sm: "180px" },
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(20% - 12px)",
            },
          }}
        >
          <Typography variant="h4" color="primary.main" fontWeight={700}>
            {pertencesByType.imoveis.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Imóveis
          </Typography>
        </Card>
        <Card
          elevation={0}
          sx={{
            textAlign: "center",
            p: 2,
            border: `1px solid ${theme.customColors?.successAlpha30}`,
            background: theme.customColors?.successAlpha10,
            minWidth: { xs: "150px", sm: "180px" },
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(20% - 12px)",
            },
          }}
        >
          <Typography variant="h4" color="success.main" fontWeight={700}>
            {totalAtivo}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sem Débito
          </Typography>
        </Card>
        <Card
          elevation={0}
          sx={{
            textAlign: "center",
            p: 2,
            border: `1px solid ${theme.customColors?.errorAlpha30}`,
            background: theme.customColors?.errorAlpha10,
            minWidth: { xs: "150px", sm: "180px" },
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(20% - 12px)",
            },
          }}
        >
          <Typography variant="h4" color="error.main" fontWeight={700}>
            {totalComDebito}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Com Débito
          </Typography>
        </Card>
      </Box>

      {/* Alerta de débitos */}
      {totalComDebito > 0 && (
        <Alert
          severity="warning"
          sx={{
            mb: 4,
            backgroundColor: theme.customColors?.warningAlpha10,
            border: `1px solid ${theme.customColors?.warningAlpha30}`,
          }}
        >
          <Typography variant="body2">
            <strong>Atenção:</strong> Foram encontrados {totalComDebito}{" "}
            pertence(s) com débito pendente.
          </Typography>
        </Alert>
      )}

      {/* Ações rápidas */}
      <Card
        elevation={0}
        sx={{
          border: `1px solid ${theme.customColors?.border?.light}`,
          background: theme.customColors?.surface?.warm,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Ações Rápidas
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              onClick={() => setActiveTab(1)}
              sx={{ textTransform: "none" }}
            >
              Ver Empresas ({pertencesByType.empresa.length})
            </Button>
            <Button
              variant="contained"
              onClick={() => setActiveTab(2)}
              sx={{ textTransform: "none" }}
            >
              Ver Imóveis ({pertencesByType.imoveis.length})
            </Button>
            <Button
              variant="outlined"
              onClick={() =>
                handleActionClick("Exportar Relatório", pertences[0])
              }
              sx={{ textTransform: "none" }}
            >
              Exportar Relatório Completo
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return renderResumo();
      case 1:
        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, mb: 3 }}
            >
              Dados da Empresa
            </Typography>
            {pertencesByType.empresa.length > 0 ? (
              pertencesByType.empresa.map(renderPertenceCard)
            ) : (
              <Alert
                severity="info"
                sx={{ backgroundColor: theme.customColors?.infoAlpha10 }}
              >
                Nenhum dado de empresa encontrado.
              </Alert>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, mb: 3 }}
            >
              Imóveis
            </Typography>
            {pertencesByType.imoveis.length > 0 ? (
              pertencesByType.imoveis.map(renderPertenceCard)
            ) : (
              <Alert
                severity="info"
                sx={{ backgroundColor: theme.customColors?.infoAlpha10 }}
              >
                Nenhum imóvel encontrado.
              </Alert>
            )}
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, mb: 3 }}
            >
              Todos os Pertences
            </Typography>
            {pertences.map(renderPertenceCard)}
          </Box>
        );
      default:
        return renderResumo();
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* Header dos resultados */}
      <Card
        elevation={0}
        sx={{
          mb: 4,
          border: `1px solid ${theme.customColors?.border?.light}`,
          background: theme.customColors?.surface?.warm,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Consulta de Pertences
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              <strong>CPF/CNPJ:</strong> {formatCpfCnpjForDisplay(cpfCnpj)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <strong>Nome/Razão Social:</strong> {contribuinte}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {pertences.length > 0 ? (
        <Box>
          {/* Navegação por abas */}
          <Card
            elevation={0}
            sx={{
              mb: 3,
              border: `1px solid ${theme.customColors?.border?.light}`,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: `1px solid ${theme.customColors?.border?.light}`,
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                },
              }}
            >
              <Tab icon={<DashboardIcon />} label="Resumo" />
              <Tab
                icon={<BusinessIcon />}
                label={`Empresa (${pertencesByType.empresa.length})`}
              />
              <Tab
                icon={<HomeIcon />}
                label={`Imóveis (${pertencesByType.imoveis.length})`}
              />
              <Tab icon={<ListIcon />} label={`Todos (${pertences.length})`} />
            </Tabs>
          </Card>

          {/* Conteúdo das abas */}
          <Box sx={{ mt: 3 }}>{renderTabContent()}</Box>
        </Box>
      ) : (
        <Alert
          severity="info"
          sx={{
            backgroundColor: theme.customColors?.infoAlpha10,
            border: `1px solid ${theme.customColors?.infoAlpha30}`,
          }}
        >
          <Typography variant="body1" gutterBottom>
            Nenhum pertence encontrado para o CPF/CNPJ informado.
          </Typography>
          <Typography variant="body2">
            Verifique se o documento está correto e tente novamente.
          </Typography>
        </Alert>
      )}

      {/* Menu de documentos */}
      <Menu
        anchorEl={documentMenu.anchorEl}
        open={Boolean(documentMenu.anchorEl)}
        onClose={handleDocumentMenuClose}
        PaperProps={{
          sx: {
            minWidth: 200,
            mt: 1,
          },
        }}
      >
        {documentTypes.map((docType) => (
          <MenuItem
            key={docType.id}
            onClick={() => handleEmitirDocumento(docType.id as DocumentType)}
            disabled={
              loadingDocument ===
              `${documentMenu.pertence?.inscricao}-${docType.id}`
            }
          >
            <ListItemIcon>
              {loadingDocument ===
              `${documentMenu.pertence?.inscricao}-${docType.id}` ? (
                <CircularProgress size={20} />
              ) : (
                docType.icon
              )}
            </ListItemIcon>
            <ListItemText primary={docType.name} />
          </MenuItem>
        ))}
      </Menu>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResultsList;
