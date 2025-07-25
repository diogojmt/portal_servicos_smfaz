import { useEffect } from "react";
import type { Pertence } from "../types";
import { DOCUMENT_TYPES } from "../services/api";
import { consultarDebitos, emitirDocumento } from "../services/api";
import LoadingSkeleton from "./Skeleton";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import { alpha, useTheme } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import BusinessIcon from "@mui/icons-material/Business";
import HomeIcon from "@mui/icons-material/Home";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ListIcon from "@mui/icons-material/List";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import CertificateIcon from "@mui/icons-material/VerifiedUser";
import AssignmentIcon from "@mui/icons-material/Assignment";
// ...existing code...
const getSituacaoColor = (situacao: string) => {
  switch (situacao) {
    case "Ativo":
      return {
        backgroundColor: (theme: any) => theme.customColors.successAlpha10,
        color: (theme: any) => theme.palette.success.main,
        borderColor: (theme: any) => theme.customColors.successAlpha30,
      };
    case "Com Débito":
      return {
        backgroundColor: (theme: any) => theme.customColors.errorAlpha10,
        color: (theme: any) => theme.palette.error.main,
        borderColor: (theme: any) => theme.customColors.errorAlpha30,
      };
    default:
      return {
        backgroundColor: (theme: any) => theme.customColors.infoAlpha10,
        color: (theme: any) => theme.palette.info.main,
        borderColor: (theme: any) => theme.customColors.infoAlpha30,
      };
  }
};

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

const ResultsList: React.FC<ResultsListProps & { pertences: Pertence[] }> = ({
  pertences,
  loading,
  cpfCnpj,
}) => {
  // Organizar pertences por tipo, incluindo Contribuinte Geral para a nova aba
  const pertencesByType: PertencesByType & { geral: Pertence[] } =
    pertences.reduce(
      (acc, pertence) => {
        if (
          pertence.tipoContribuinte === "Empresa" ||
          pertence.tipoContribuinte === "Autônomo"
        ) {
          acc.empresa.push(pertence);
        } else if (pertence.tipoContribuinte === "Imóvel") {
          acc.imoveis.push(pertence);
        } else if (pertence.tipoContribuinte === "Contribuinte Geral") {
          acc.geral.push(pertence);
        } else {
          acc.outros.push(pertence);
        }
        return acc;
      },
      { empresa: [], imoveis: [], outros: [], geral: [] } as PertencesByType & {
        geral: Pertence[];
      }
    );
  const [activeTab, setActiveTab] = useState(0);
  const [filterTodos, setFilterTodos] = useState<
    "all" | "semDebito" | "comDebito"
  >("all");
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

  // Estados para modal de débitos
  const [openDebitoModal, setOpenDebitoModal] = useState(false);
  const [debitoLoading, setDebitoLoading] = useState(false);
  const [debitoError, setDebitoError] = useState<string | null>(null);
  const [debitoData, setDebitoData] = useState<any>(null);
  const [debitoPertence, setDebitoPertence] = useState<Pertence | null>(null);

  const theme = useTheme();

  // ...existing code...

  // ...existing code...

  // Atualiza a exibição das setas das abas em mobile
  useEffect(() => {
    function updateTabScrollButtons() {
      const el = document.getElementById("tabs-scrollable-container");
      const leftBtn = document.getElementById("tabs-scroll-left-btn");
      const rightBtn = document.getElementById("tabs-scroll-right-btn");
      if (!el || !leftBtn || !rightBtn) return;
      const scrollLeft = el.scrollLeft;
      const maxScroll = el.scrollWidth - el.clientWidth;
      leftBtn.style.display = scrollLeft > 5 ? "flex" : "none";
      rightBtn.style.display = scrollLeft < maxScroll - 5 ? "flex" : "none";
    }
    setTimeout(updateTabScrollButtons, 200);
    window.addEventListener("resize", updateTabScrollButtons);
    const el = document.getElementById("tabs-scrollable-container");
    if (el) {
      el.addEventListener("scroll", updateTabScrollButtons);
    }
    return () => {
      window.removeEventListener("resize", updateTabScrollButtons);
      if (el) el.removeEventListener("scroll", updateTabScrollButtons);
    };
  }, [
    activeTab,
    pertencesByType?.empresa?.length,
    pertencesByType?.imoveis?.length,
    pertencesByType?.geral?.length,
    pertences.length,
  ]);

  if (loading) {
    // LoadingSkeleton não aceita prop 'count', apenas 'variant', 'width', 'height', etc.
    // Se quiser múltiplos esqueletos, renderize múltiplos componentes ou ajuste conforme necessário.
    return <LoadingSkeleton />;
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

  // ...existing code...

  // Encontrar o Contribuinte Geral (primeiro, se houver)
  const contribuinteGeral = pertencesByType.geral[0];

  const contribuinte =
    contribuinteGeral?.nomeRazaoSocial ||
    pertences[0]?.nomeRazaoSocial ||
    "N/A";
  const totalComDebito = pertences.filter(
    (p) => p.situacao === "Com Débito"
  ).length;
  const totalAtivo = pertences.filter((p) => p.situacao === "Ativo").length;

  // Tipos de documentos disponíveis
  const allDocumentTypes = [
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
    //{ id: DOCUMENT_TYPES.VISA, name: "VISA", icon: <VerifiedIcon /> },
  ];

  // Filtra tipos de documento baseado no tipo de contribuinte
  const getAvailableDocumentTypes = (pertence: Pertence) => {
    const isImovel = pertence.tipoContribuinte === "Imóvel";
    const isEmpresa = pertence.tipoContribuinte === "Empresa";

    if (isImovel) {
      // Para imóveis, oculta BCM (4), Alvará de Funcionamento (5) e VISA (6)
      return allDocumentTypes.filter(
        (docType) =>
          ![
            DOCUMENT_TYPES.BCM,
            DOCUMENT_TYPES.ALVARA_FUNCIONAMENTO,
            //DOCUMENT_TYPES.VISA,
          ].includes(docType.id as any)
      );
    }

    if (isEmpresa) {
      // Para empresas, oculta CERTIDAO (2), BCI (3) e VISA (6)
      return allDocumentTypes.filter(
        (docType) =>
          ![
            DOCUMENT_TYPES.CERTIDAO,
            DOCUMENT_TYPES.BCI,
            //DOCUMENT_TYPES.VISA,
          ].includes(docType.id as any)
      );
    }

    return allDocumentTypes;
  };

  const handleDocumentMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    pertence: Pertence
  ) => {
    setDocumentMenu({ anchorEl: event.currentTarget, pertence });
  };

  const handleDocumentMenuClose = () => {
    setDocumentMenu({ anchorEl: null, pertence: null });
  };

  const handleEmitirDocumento = async (
    tipoDocumento: import("../types").DocumentType
  ) => {
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

  const handleActionClick = async (action: string, pertence: Pertence) => {
    if (action === "Ver Débitos") {
      setDebitoPertence(pertence);
      setDebitoLoading(true);
      setDebitoError(null);
      setOpenDebitoModal(true);
      try {
        // Parâmetros obrigatórios conforme documentação
        let tipoContribuinte = "3";
        if (pertence.tipoContribuinte === "Imóvel") {
          tipoContribuinte = "2";
        } else if (pertence.tipoContribuinte === "Contribuinte Geral") {
          tipoContribuinte = "1";
        }
        // Formatar inscrição para 15 dígitos (padrão exigido pela API)
        const formatInscricao = (inscricao: string) => {
          const clean = String(inscricao).replace(/\D/g, "");
          return clean.padStart(15, "0");
        };
        const params = {
          SSETipoContribuinte: tipoContribuinte,
          SSEInscricao: formatInscricao(pertence.inscricao),
          SSEExercicioDebito: "", // ou ano atual, se necessário
          SSETipoConsumo: "1", // lista todos os débitos
          SSENossoNumero: "",
          SSECPFCNPJ: pertence.cpfCnpj || "",
          SSEOperacao: "",
          SSEIdentificador: "",
        };
        // Exemplo de payload enviado para a API de débitos
        const payload = {
          SSEChave: "@C0sS0_@P1",
          ...params,
        };
        console.log("[API Débitos] Payload enviado:", payload);
        const data = await consultarDebitos(params);
        setDebitoData(data);
      } catch (err) {
        console.error("Erro ao consultar débitos:", err);
        setDebitoError(
          err instanceof Error ? err.message : "Erro ao consultar débitos."
        );
        setDebitoData(null);
      } finally {
        setDebitoLoading(false);
      }
    }
  };

  // Modal de Débitos fora do componente principal para evitar hooks condicionais
  const DebitoModal: React.FC<{
    open: boolean;
    onClose: () => void;
    loading: boolean;
    error: string | null;
    data: any;
  }> = ({ open, onClose, loading, error, data }) => {
    console.log("DebitoModal render:", {
      open,
      loading,
      error,
      hasData: !!data,
      data: data,
    });
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: (theme: any) => ({
            minHeight: 320,
            maxHeight: "80vh",
            background: theme.designTokens.colors.light.background.gradient,
            bgcolor: "background.paper",
            borderRadius: theme.designTokens.borderRadius.lg,
            boxShadow: theme.designTokens.shadows.light.xl,
            border: `1.5px solid ${theme.customColors.border.medium}`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            transition: "box-shadow 0.2s, border 0.2s",
          }),
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(30, 41, 59, 0.35)",
            backdropFilter: "blur(3px)",
          },
        }}
      >
        {/* Cabeçalho fixo */}
        <Box
          sx={(theme: any) => ({
            position: "sticky",
            top: 0,
            zIndex: 2,
            bgcolor: theme.customColors.surface.primary,
            background: theme.designTokens.colors.light.background.gradient,
            p: 3,
            borderBottom: `1.5px solid ${theme.customColors.border.medium}`,
            boxShadow: theme.designTokens.shadows.light.sm,
            display: "flex",
            alignItems: "center",
            gap: 2,
          })}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={(theme: any) => ({
              color: theme.palette.primary.main,
              fontWeight: 700,
              mb: 0,
              display: "flex",
              alignItems: "center",
              gap: 1,
              textShadow: theme.typography.h2.textShadow,
              letterSpacing: theme.typography.h2.letterSpacing,
            })}
          >
            💰 Débitos do Vínculo
          </Typography>
        </Box>

        {/* Conteúdo scrollável */}
        <Box
          sx={(theme: any) => ({
            flex: 1,
            overflowY: "auto",
            px: { xs: 1, sm: 3 },
            py: 2,
            bgcolor: theme.customColors.surface.primary,
            color: theme.palette.text.primary,
            minHeight: 250,
          })}
        >
          {loading && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                py: 4,
                px: 3,
                bgcolor: (theme: any) => theme.customColors.primaryAlpha10,
                borderRadius: (theme: any) =>
                  theme.designTokens.borderRadius.md,
                border: (theme: any) =>
                  `1px solid ${theme.customColors.border.light}`,
              }}
            >
              <CircularProgress size={24} color="primary" />
              <Typography sx={{ color: "primary.main", fontWeight: 500 }}>
                Consultando débitos...
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && !data && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Nenhum dados de débito encontrado.
            </Alert>
          )}

          {data && data.SDTSaidaAPIDebito && (
            <Box sx={{ mt: 2 }}>
              {/* Cabeçalho com informações do contribuinte */}
              <Card
                sx={{
                  mb: 3,
                  bgcolor: (theme: any) => theme.customColors.surface.warm,
                  border: (theme: any) =>
                    `1px solid ${theme.customColors.border.light}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "text.primary",
                      mb: 2,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    📄 Informações do Contribuinte
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", fontWeight: 600 }}
                      >
                        Contribuinte:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.primary" }}
                      >
                        {data.SSANomeRazao}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", fontWeight: 600 }}
                      >
                        CPF/CNPJ:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.primary" }}
                      >
                        {data.SSACPFCNPJ}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", fontWeight: 600 }}
                      >
                        Inscrição:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.primary" }}
                      >
                        {data.SSAInscricao}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", fontWeight: 600 }}
                      >
                        Total de Débitos:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "error.main", fontWeight: 600 }}
                      >
                        {data.SDTSaidaAPIDebito?.length || 0} pendências
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Resumo financeiro */}
              <Card
                sx={{
                  mb: 3,
                  bgcolor: (theme: any) => theme.customColors.warningAlpha50,
                  border: (theme: any) =>
                    `1px solid ${theme.customColors.warningAlpha30}`,
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "warning.dark",
                      mb: 1,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    💰 Resumo Financeiro
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "warning.dark" }}
                      >
                        Valor Total:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "warning.dark", fontWeight: 600 }}
                      >
                        R${" "}
                        {data.SDTSaidaAPIDebito?.reduce(
                          (sum: number, item: any) =>
                            sum + (item.SSAValorTotal || 0),
                          0
                        ).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "warning.dark" }}
                      >
                        Valor Original:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "warning.dark" }}
                      >
                        R${" "}
                        {data.SDTSaidaAPIDebito?.reduce(
                          (sum: number, item: any) =>
                            sum + (item.SSAValorOriginal || 0),
                          0
                        ).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "warning.dark" }}
                      >
                        Juros + Multa:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "warning.dark" }}
                      >
                        R${" "}
                        {data.SDTSaidaAPIDebito?.reduce(
                          (sum: number, item: any) =>
                            sum +
                            (item.SSAValorJuros || 0) +
                            (item.SSAValorMulta || 0),
                          0
                        ).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Lista de débitos */}
              <Typography
                variant="h6"
                sx={{
                  color: "text.primary",
                  mb: 2,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                📋 Débitos Detalhados
              </Typography>

              <Box
                sx={{
                  maxHeight: 400,
                  overflow: "auto",
                  "&::-webkit-scrollbar": {
                    width: 6,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: (theme: any) =>
                      theme.customColors.border.strong,
                    borderRadius: 3,
                  },
                }}
              >
                {data.SDTSaidaAPIDebito.map((debito: any, index: number) => (
                  <Card
                    key={debito.SSANossoNumero || index}
                    sx={{
                      mb: 2,
                      bgcolor: (theme: any) =>
                        theme.customColors.surface.primary,
                      border: (theme: any) =>
                        `1px solid ${theme.customColors.border.light}`,
                      transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        bgcolor: (theme: any) =>
                          theme.customColors.surface.secondary,
                        borderColor: (theme: any) =>
                          theme.customColors.border.medium,
                        transform: "translateY(-1px)",
                        boxShadow: (theme: any) =>
                          theme.designTokens.shadows.light.md,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: "text.primary",
                              fontWeight: 600,
                              mb: 1,
                            }}
                          >
                            {debito.SSATributo?.split("|")[0]?.trim() ||
                              "Tributo não identificado"}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary", display: "block" }}
                          >
                            Referência: {debito.SSAReferencia} | Exercício:{" "}
                            {debito.SSAExercicio || new Date().getFullYear()}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary", display: "block" }}
                          >
                            Vencimento:{" "}
                            {new Date(debito.SSAVencimento).toLocaleDateString(
                              "pt-BR"
                            )}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "right", minWidth: 120 }}>
                          <Typography
                            variant="h6"
                            sx={{ color: "error.main", fontWeight: 600 }}
                          >
                            R$ {debito.SSAValorTotal?.toFixed(2)}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            Original: R$ {debito.SSAValorOriginal?.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          onClick={() =>
                            window.open(debito.SSALinkDAM, "_blank")
                          }
                          sx={{ fontSize: "0.75rem" }}
                        >
                          📄 Baixar Guia
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            navigator.clipboard.writeText(
                              debito.SSALinhaDigitavel
                            )
                          }
                          sx={{ fontSize: "0.75rem" }}
                        >
                          📋 Copiar Linha Digitável
                        </Button>
                        {/* Botão 'Ver Detalhes' removido conforme solicitado */}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Rodapé fixo */}
        <Box
          sx={(theme: any) => ({
            position: "sticky",
            bottom: 0,
            zIndex: 2,
            bgcolor: theme.customColors.surface.primary,
            background: theme.designTokens.colors.light.background.gradient,
            mt: 0,
            px: 3,
            py: 2,
            borderTop: `1.5px solid ${theme.customColors.border.medium}`,
            boxShadow: theme.designTokens.shadows.light.sm,
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            alignItems: "center",
          })}
        >
          <Button
            onClick={onClose}
            variant="contained"
            size="large"
            color="primary"
          >
            Fechar
          </Button>
        </Box>
      </Dialog>
    );
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
        borderRadius: theme.shape.borderRadius,
        transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: theme.shadows[4],
          borderColor:
            theme.customColors?.border?.medium || theme.palette.action.hover,
        },
      }}
    >
      <CardContent
        sx={(theme) => ({
          p: { xs: 2, sm: 3 },
        })}
      >
        {/* Header do card */}
        <Box
          sx={(theme) => ({
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "flex-start" },
            mb: 2,
            gap: { xs: 2, sm: 0 },
          })}
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
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                color: theme.palette.primary.main,
                fontWeight: 500,
                fontSize: { xs: "0.8rem", sm: "0.95rem" },
                px: { xs: 1, sm: 2 },
                py: { xs: 0.5, sm: 0.5 },
              }}
            />
          </Box>
          <Chip
            label={pertence.situacao}
            sx={{
              ...getSituacaoColor(pertence.situacao),
              fontWeight: 600,
              border: "1px solid",
              fontSize: { xs: "0.8rem", sm: "0.95rem" },
              px: { xs: 1, sm: 2 },
              py: { xs: 0.5, sm: 0.5 },
            }}
          />
        </Box>

        {/* Detalhes adicionais para Contribuinte Geral */}
        {pertence.tipoContribuinte === "Contribuinte Geral" && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              fontWeight={600}
              color="text.primary"
              gutterBottom
            >
              Nome/Razão Social:
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {pertence.nomeRazaoSocial || "-"}
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              color="text.primary"
              gutterBottom
            >
              CPF/CNPJ:
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {pertence.cpfCnpj || "-"}
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              color="text.primary"
              gutterBottom
            >
              Código do Contribuinte:
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {pertence.codigoContribuinte || "-"}
            </Typography>
          </Box>
        )}

        {/* Detalhes adicionais para Empresa/Autônomo (sem duplicidade) */}
        {(pertence.tipoContribuinte === "Empresa" ||
          pertence.tipoContribuinte === "Autônomo") && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              fontWeight={600}
              color="text.primary"
              gutterBottom
            >
              Nome/Razão Social:
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {pertence.nomeRazaoSocial || "-"}
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              color="text.primary"
              gutterBottom
            >
              Endereço:
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {pertence.endereco || "-"}
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              color="text.primary"
              gutterBottom
            >
              Débito Suspenso:
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {pertence.complemento === "S"
                ? "Sim"
                : pertence.complemento === "N"
                ? "Não"
                : pertence.complemento || "-"}
            </Typography>
          </Box>
        )}
        {/* Detalhes padrão (removido endereço para Empresa/Autônomo para evitar duplicidade) */}
        {!(
          pertence.tipoContribuinte === "Empresa" ||
          pertence.tipoContribuinte === "Autônomo"
        ) && (
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
          </Box>
        )}
        {/* Ações */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          {pertence.situacao === "Com Débito" && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<VisibilityIcon />}
              onClick={() => handleActionClick("Ver Débitos", pertence)}
              sx={{
                textTransform: "none",
                borderColor: theme.customColors?.border?.medium,
                fontSize: { xs: "0.8rem", sm: "0.95rem" },
                minWidth: { xs: "100%", sm: 120 },
                "&:hover": {
                  backgroundColor: theme.customColors?.surface?.secondary,
                },
              }}
            >
              Ver Débitos
            </Button>
          )}
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
              fontSize: { xs: "0.8rem", sm: "0.95rem" },
              minWidth: { xs: "100%", sm: 120 },
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

  // Função para filtrar e exibir pertences conforme o card clicado
  const handleResumoCardClick = (type: string) => {
    switch (type) {
      case "total":
        setActiveTab(4);
        setFilterTodos("all");
        break;
      case "empresa":
        setActiveTab(1);
        break;
      case "imovel":
        setActiveTab(2);
        break;
      case "semDebito":
        setActiveTab(4);
        setFilterTodos("semDebito");
        break;
      case "comDebito":
        setActiveTab(4);
        setFilterTodos("comDebito");
        break;
      case "geral":
        setActiveTab(3);
        break;
      default:
        setActiveTab(0);
    }
  };

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
              md: "1 1 calc(16% - 12px)",
            },
            borderRadius: theme.shape.borderRadius,
            cursor: "pointer",
            transition: "box-shadow 0.2s",
            "&:hover": { boxShadow: theme.shadows[4] },
          }}
          onClick={() => handleResumoCardClick("total")}
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
              md: "1 1 calc(16% - 12px)",
            },
            borderRadius: theme.shape.borderRadius,
            cursor: "pointer",
            transition: "box-shadow 0.2s",
            "&:hover": { boxShadow: theme.shadows[4] },
          }}
          onClick={() => handleResumoCardClick("empresa")}
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
              md: "1 1 calc(16% - 12px)",
            },
            borderRadius: theme.shape.borderRadius,
            cursor: "pointer",
            transition: "box-shadow 0.2s",
            "&:hover": { boxShadow: theme.shadows[4] },
          }}
          onClick={() => handleResumoCardClick("imovel")}
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
            border: `1px solid ${theme.customColors?.border?.light}`,
            background: theme.customColors?.surface?.warm,
            minWidth: { xs: "150px", sm: "180px" },
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(16% - 12px)",
            },
            borderRadius: theme.shape.borderRadius,
            cursor: "pointer",
            transition: "box-shadow 0.2s",
            "&:hover": { boxShadow: theme.shadows[4] },
          }}
          onClick={() => handleResumoCardClick("geral")}
        >
          <Typography variant="h4" color="primary.main" fontWeight={700}>
            {pertencesByType.geral.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Contribuinte Geral
          </Typography>
        </Card>
        <Card
          elevation={0}
          sx={{
            textAlign: "center",
            p: 2,
            border: `1px solid ${theme.customColors?.successAlpha30}`,
            background: theme.customColors?.successAlpha50,
            minWidth: { xs: "150px", sm: "180px" },
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(16% - 12px)",
            },
            borderRadius: theme.shape.borderRadius,
            cursor: "pointer",
            transition: "box-shadow 0.2s",
            "&:hover": { boxShadow: theme.shadows[4] },
          }}
          onClick={() => handleResumoCardClick("semDebito")}
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
            background: theme.customColors?.errorAlpha50,
            minWidth: { xs: "150px", sm: "180px" },
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(16% - 12px)",
            },
            borderRadius: theme.shape.borderRadius,
            cursor: "pointer",
            transition: "box-shadow 0.2s",
            "&:hover": { boxShadow: theme.shadows[4] },
          }}
          onClick={() => handleResumoCardClick("comDebito")}
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
            backgroundColor: theme.customColors?.warningAlpha50,
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
          borderRadius: theme.shape.borderRadius,
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
              variant="contained"
              onClick={() => setActiveTab(3)}
              sx={{ textTransform: "none" }}
            >
              Ver Contribuinte Geral ({pertencesByType.geral.length})
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  // Adiciona novas abas para Sem Débito e Com Débito
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
              Contribuinte Geral
            </Typography>
            {pertencesByType.geral.length > 0 ? (
              pertencesByType.geral.map(renderPertenceCard)
            ) : (
              <Alert
                severity="info"
                sx={{ backgroundColor: theme.customColors?.infoAlpha10 }}
              >
                Nenhum Contribuinte Geral encontrado.
              </Alert>
            )}
          </Box>
        );
      case 4: {
        let lista = pertences;
        let titulo = "Todos os Pertences";
        if (filterTodos === "semDebito") {
          lista = pertences.filter((p) => p.situacao === "Ativo");
          titulo = "Pertences Sem Débito";
        } else if (filterTodos === "comDebito") {
          lista = pertences.filter((p) => p.situacao === "Com Débito");
          titulo = "Pertences Com Débito";
        }
        return (
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, mb: 3 }}
            >
              {titulo}
            </Typography>
            {lista.length > 0 ? (
              lista.map(renderPertenceCard)
            ) : (
              <Alert
                severity="info"
                sx={{ backgroundColor: theme.customColors?.infoAlpha10 }}
              >
                Nenhum pertence encontrado.
              </Alert>
            )}
          </Box>
        );
      }
      default:
        return renderResumo();
    }
  };

  return (
    <Box sx={{ mt: { xs: 2, sm: 4 } }}>
      {/* Modal de Débitos sempre renderizado */}
      <DebitoModal
        open={openDebitoModal}
        onClose={() => setOpenDebitoModal(false)}
        loading={debitoLoading}
        error={debitoError}
        data={debitoData}
      />

      {/* Header dos resultados */}
      <Card
        elevation={0}
        sx={{
          mb: 4,
          border: `1px solid ${theme.customColors?.border?.light}`,
          background: theme.customColors?.surface?.warm,
          borderRadius: theme.shape.borderRadius,
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

      {/* Removido o card exclusivo para Contribuinte Geral. Agora exibido em aba própria. */}

      {pertences.length > 0 ? (
        <Box>
          {/* Navegação por abas */}

          <Card
            elevation={0}
            sx={{
              mb: 3,
              border: `1px solid ${theme.customColors?.border?.light}`,
              px: { xs: 0.5, sm: 2 },
              py: { xs: 0.5, sm: 1 },
              borderRadius: theme.shape.borderRadius,
              overflowX: { xs: "auto", sm: "visible" },
              boxShadow: { xs: "none", sm: theme.shadows[1] },
              position: "relative",
            }}
          >
            {/* Indicadores laterais em mobile */}
            <Box
              sx={{
                display: { xs: "flex", sm: "none" },
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 2,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <IconButton
                aria-label="rolar abas para a esquerda"
                size="small"
                sx={{
                  ml: 0.5,
                  bgcolor: "background.paper",
                  boxShadow: 1,
                  opacity: 0.85,
                  pointerEvents: "auto",
                  display: "none", // será controlado via state
                }}
                onClick={() => {
                  const el = document.getElementById(
                    "tabs-scrollable-container"
                  );
                  if (el) el.scrollBy({ left: -120, behavior: "smooth" });
                }}
                id="tabs-scroll-left-btn"
              >
                <ChevronLeftIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                aria-label="rolar abas para a direita"
                size="small"
                sx={{
                  mr: 0.5,
                  bgcolor: "background.paper",
                  boxShadow: 1,
                  opacity: 0.85,
                  pointerEvents: "auto",
                  display: "none", // será controlado via state
                }}
                onClick={() => {
                  const el = document.getElementById(
                    "tabs-scrollable-container"
                  );
                  if (el) el.scrollBy({ left: 120, behavior: "smooth" });
                }}
                id="tabs-scroll-right-btn"
              >
                <ChevronRightIcon fontSize="inherit" />
              </IconButton>
            </Box>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => {
                setActiveTab(newValue);
                if (newValue === 4) setFilterTodos("all");
              }}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: `1px solid ${theme.customColors?.border?.light}`,
                minHeight: { xs: 38, sm: 48 },
                "& .MuiTabs-flexContainer": {
                  gap: { xs: 0.5, sm: 1 },
                },
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: { xs: "1.05rem", sm: "0.95rem" },
                  minHeight: { xs: 44, sm: 48 },
                  minWidth: { xs: 130, sm: 120 },
                  px: { xs: 2, sm: 2.5 },
                  py: { xs: 1, sm: 1 },
                  borderRadius: 2,
                  transition: "background 0.2s",
                  mb: { xs: 0, sm: 0 },
                },
                "& .Mui-selected": {
                  background: theme.customColors?.primaryAlpha10,
                  color: theme.palette.primary.main,
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: 2,
                  background: theme.palette.primary.main,
                },
                overflowX: { xs: "auto", sm: "visible" },
                scrollbarWidth: "thin",
                "&::-webkit-scrollbar": {
                  height: 6,
                },
                "&::-webkit-scrollbar-thumb": {
                  background: theme.customColors?.border?.medium,
                  borderRadius: 3,
                },
              }}
              TabScrollButtonProps={{
                style: { display: "none" },
              }}
              id="tabs-scrollable-container"
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
              <Tab
                icon={<BusinessCenterIcon />}
                label={`Contribuinte Geral (${pertencesByType.geral.length})`}
              />
              <Tab icon={<ListIcon />} label={`Todos (${pertences.length})`} />
            </Tabs>
            {/* Script para mostrar/esconder setas conforme overflow */}
            {/* O script precisa rodar após renderização e ao trocar de aba. Usar useEffect para garantir atualização. */}
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
        {documentMenu.pertence &&
          getAvailableDocumentTypes(documentMenu.pertence).map((docType) => (
            <MenuItem
              key={docType.id}
              // Corrigir cast para DocumentType se necessário
              onClick={() =>
                handleEmitirDocumento(
                  docType.id as import("../types").DocumentType
                )
              }
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
