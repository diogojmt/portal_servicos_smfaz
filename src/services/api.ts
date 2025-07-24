// Consulta débitos na API oficial
export const consultarDebitos = async (
  params: {
    SSETipoContribuinte: string;
    SSEInscricao: string;
    SSEExercicioDebito: string;
    SSETipoConsumo: string;
    SSENossoNumero?: string;
    SSECPFCNPJ?: string;
    SSEOperacao?: string;
    SSEIdentificador?: string;
  }
): Promise<any> => {
  const SSEChave = '@C0sS0_@P1';
  const apiUrl = '/api/apapidebito';
  const payload = {
    SSEChave,
    SSETipoContribuinte: params.SSETipoContribuinte,
    SSEInscricao: params.SSEInscricao,
    SSEExercicioDebito: params.SSEExercicioDebito,
    SSETipoConsumo: params.SSETipoConsumo,
    SSENossoNumero: params.SSENossoNumero || '',
    SSECPFCNPJ: params.SSECPFCNPJ || '',
    SSEOperacao: params.SSEOperacao || '',
    SSEIdentificador: params.SSEIdentificador || ''
  };
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'DadosAPI': JSON.stringify(payload)
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`Erro na API de débitos: ${error.response.status} - ${error.response.statusText}`);
    }
    throw error;
  }
};
import axios, { AxiosResponse } from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { Pertence, SoapResponse, DocumentRequestParams, DocumentResponse, DocumentType } from '../types';
import { cache } from '../utils/cache';
import { config, logger } from '../utils/config';

// Configuração do axios
const axiosInstance = axios.create({
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'text/xml;charset=UTF-8',
    'SOAPAction': '""',
  },
});

// Interceptador para logs de request
axiosInstance.interceptors.request.use(
  (config) => {
    logger.debug('API Request:', config);
    return config;
  },
  (error) => {
    logger.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptador para logs de response
axiosInstance.interceptors.response.use(
  (response) => {
    logger.debug('API Response:', response);
    return response;
  },
  (error) => {
    logger.error('API Response Error:', error);
    return Promise.reject(error);
  }
);

export const fetchPertences = async (cpfCnpj: string): Promise<Pertence[]> => {
  const timestamp = new Date().toISOString();
  const logPrefix = `[SOAP-${timestamp}]`;
  const cacheKey = `pertences-${cpfCnpj}`;
  const soapRequest = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:eag="eAgata_Arapiraca_Maceio_Ev3">
      <soapenv:Header/>
      <soapenv:Body>
        <eag:PWSRetornoPertences.Execute>
          <eag:Flagtipopesquisa>C</eag:Flagtipopesquisa>
          <eag:Ctgcpf>${cpfCnpj}</eag:Ctgcpf>
          <eag:Ctiinscricao></eag:Ctiinscricao>
        </eag:PWSRetornoPertences.Execute>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

  try {
    logger.info(`${logPrefix} =================== INÍCIO CONSULTA SOAP ===================`);
    logger.info(`${logPrefix} CPF/CNPJ Original: ${cpfCnpj}`);
    logger.info(`${logPrefix} URL da API: ${config.apiUrl}`);
    logger.info(`${logPrefix} Timestamp: ${timestamp}`);
    
    logger.debug(`${logPrefix} ----- SOAP REQUEST -----`);
    logger.debug(`${logPrefix} ${soapRequest}`);
    logger.debug(`${logPrefix} ----- FIM SOAP REQUEST -----`);
    
    const response: AxiosResponse = await axiosInstance.post(config.apiUrl, soapRequest);
    
    logger.info(`${logPrefix} =================== RESPOSTA RECEBIDA ===================`);
    logger.info(`${logPrefix} Status HTTP: ${response.status}`);
    logger.info(`${logPrefix} Status Text: ${response.statusText}`);
    
    logger.debug(`${logPrefix} ----- HEADERS DA RESPOSTA -----`);
    logger.debug(`${logPrefix}`, response.headers);
    logger.debug(`${logPrefix} ----- FIM HEADERS -----`);
    
    logger.info(`${logPrefix} Tipo dos dados: ${typeof response.data}`);
    logger.info(`${logPrefix} Tamanho da resposta: ${typeof response.data === 'string' ? response.data.length : 'N/A'} caracteres`);
    
    logger.info(`${logPrefix} =================== XML COMPLETO DA RESPOSTA ===================`);
    if (typeof response.data === 'string') {
      // Salvar resposta completa
      logger.info(`${logPrefix} ----- INÍCIO XML BRUTO -----`);
      logger.info(`${logPrefix} ${response.data}`);
      logger.info(`${logPrefix} ----- FIM XML BRUTO -----`);
      
      // Criar versão formatada para facilitar análise
      try {
        const formattedXml = response.data
          .replace(/></g, '>\n<')
          .replace(/^\s*\n/gm, '');
        logger.info(`${logPrefix} ----- XML FORMATADO -----`);
        logger.info(`${logPrefix} ${formattedXml}`);
        logger.info(`${logPrefix} ----- FIM XML FORMATADO -----`);
      } catch (formatError) {
        logger.warn(`${logPrefix} Erro ao formatar XML:`, formatError);
      }
    } else {
      logger.info(`${logPrefix} Dados não são string:`, response.data);
    }
    logger.info(`${logPrefix} =================== FIM XML COMPLETO ===================`);

    // Parse XML response
    logger.info(`${logPrefix} =================== INÍCIO PARSING XML ===================`);
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseTagValue: true,
      parseAttributeValue: true,
      trimValues: true,
    });
    
    const parsedResponse: SoapResponse = parser.parse(response.data);
    logger.info(`${logPrefix} XML parseado com sucesso`);
    logger.debug(`${logPrefix} ----- OBJETO PARSEADO COMPLETO -----`);
    logger.debug(`${logPrefix}`, JSON.stringify(parsedResponse, null, 2));
    logger.debug(`${logPrefix} ----- FIM OBJETO PARSEADO -----`);
    
    logger.info(`${logPrefix} Chaves do nível raiz:`, Object.keys(parsedResponse));
    
    // Extract the result data - tentar diferentes variações de envelope
    const envelope = parsedResponse['SOAP-ENV:Envelope'] || 
                    parsedResponse['soapenv:Envelope'] || 
                    parsedResponse['soap:Envelope'] ||
                    parsedResponse['s:Envelope'] ||
                    parsedResponse['env:Envelope'] ||
                    parsedResponse.Envelope;
    logger.info(`${logPrefix} Envelope encontrado:`, !!envelope);
    if (envelope) {
      logger.debug(`${logPrefix} ----- ENVELOPE COMPLETO -----`);
      logger.debug(`${logPrefix}`, JSON.stringify(envelope, null, 2));
      logger.debug(`${logPrefix} ----- FIM ENVELOPE -----`);
      logger.info(`${logPrefix} Chaves do envelope:`, Object.keys(envelope));
    }
    
    if (!envelope) {
      logger.error(`${logPrefix} =================== ERRO: ENVELOPE NÃO ENCONTRADO ===================`);
      logger.error(`${logPrefix} Resposta completa:`, JSON.stringify(parsedResponse, null, 2));
      logger.error(`${logPrefix} Possíveis chaves do envelope:`, Object.keys(parsedResponse));
      
      // Verificar se é uma resposta de erro HTML
      if (typeof response.data === 'string' && response.data.includes('<html')) {
        logger.error(`${logPrefix} Servidor retornou HTML em vez de XML SOAP`);
        throw new Error('Servidor retornou HTML em vez de XML SOAP. Verifique a URL da API.');
      }
      
      throw new Error('Formato de resposta SOAP inválido');
    }

    const body = envelope['SOAP-ENV:Body'] ||
                envelope['soapenv:Body'] || 
                envelope['soap:Body'] ||
                envelope['s:Body'] ||
                envelope['env:Body'] ||
                envelope.Body;
    logger.info(`${logPrefix} Body encontrado:`, !!body);
    if (body) {
      logger.debug(`${logPrefix} ----- BODY COMPLETO -----`);
      logger.debug(`${logPrefix}`, JSON.stringify(body, null, 2));
      logger.debug(`${logPrefix} ----- FIM BODY -----`);
      logger.info(`${logPrefix} Chaves do body:`, Object.keys(body));
    }
    
    if (!body) {
      logger.error(`${logPrefix} =================== ERRO: BODY NÃO ENCONTRADO ===================`);
      logger.error(`${logPrefix} Envelope:`, JSON.stringify(envelope, null, 2));
      logger.error(`${logPrefix} Chaves disponíveis no envelope:`, Object.keys(envelope));
      throw new Error('Body SOAP não encontrado');
    }

    const executeResponse = body['PWSRetornoPertences.ExecuteResponse'] || 
                           (body as any)['ns1:PWSRetornoPertences.ExecuteResponse'] ||
                           (body as any)['tns:PWSRetornoPertences.ExecuteResponse'] ||
                           Object.values(body).find(item => 
                             typeof item === 'object' && 
                             item !== null && 
                             ('Sdtretornopertences' in item || 'PWSRetornoPertences.ExecuteResult' in item)
                           );
    logger.info(`${logPrefix} ExecuteResponse encontrado:`, !!executeResponse);
    if (executeResponse) {
      logger.debug(`${logPrefix} ----- EXECUTE RESPONSE COMPLETO -----`);
      logger.debug(`${logPrefix}`, JSON.stringify(executeResponse, null, 2));
      logger.debug(`${logPrefix} ----- FIM EXECUTE RESPONSE -----`);
      logger.info(`${logPrefix} Chaves do executeResponse:`, Object.keys(executeResponse));
    }
    
    if (!executeResponse) {
      logger.error(`${logPrefix} =================== ERRO: EXECUTE RESPONSE NÃO ENCONTRADO ===================`);
      logger.error(`${logPrefix} Body completo:`, JSON.stringify(body, null, 2));
      logger.error(`${logPrefix} Chaves disponíveis no body:`, Object.keys(body));
      throw new Error('Resposta de execução não encontrada');
    }

    // Na estrutura real, os dados estão em Sdtretornopertences
    const resultData = executeResponse['Sdtretornopertences'] ||
                      executeResponse['PWSRetornoPertences.ExecuteResult'] ||
                      (executeResponse as any)['ns1:PWSRetornoPertences.ExecuteResult'] ||
                      (executeResponse as any)['tns:PWSRetornoPertences.ExecuteResult'];
    logger.info(`${logPrefix} ResultData encontrado:`, !!resultData);
    if (resultData) {
      logger.debug(`${logPrefix} ----- RESULT DATA COMPLETO -----`);
      logger.debug(`${logPrefix}`, JSON.stringify(resultData, null, 2));
      logger.debug(`${logPrefix} ----- FIM RESULT DATA -----`);
      logger.info(`${logPrefix} Chaves do resultData:`, Object.keys(resultData));
    }
    logger.info(`${logPrefix} =================== FIM PARSING XML ===================`);
    
    // Parse the result data
    logger.info(`${logPrefix} =================== INÍCIO PROCESSAMENTO DOS DADOS ===================`);
    const pertences: Pertence[] = parseResultData(resultData, logPrefix);
    logger.info(`${logPrefix} =================== FIM PROCESSAMENTO DOS DADOS ===================`);
    
    // Salva no cache se habilitado
    if (cache.isEnabled() && pertences.length > 0) {
      cache.set(cacheKey, pertences);
      logger.info(`${logPrefix} Dados salvos no cache:`, cacheKey);
    }
    
    logger.info(`${logPrefix} =================== CONSULTA CONCLUÍDA COM SUCESSO ===================`);
    logger.info(`${logPrefix} Total de pertences encontrados: ${pertences.length}`);
    logger.info(`${logPrefix} Timestamp de conclusão: ${new Date().toISOString()}`);
    logger.info(`${logPrefix} =================== FIM DA CONSULTA ===================`);
    
    return pertences;
    
  } catch (error) {
    logger.error(`${logPrefix} =================== ERRO NA CONSULTA ===================`);
    logger.error(`${logPrefix} Erro:`, error);
    logger.error(`${logPrefix} Timestamp do erro: ${new Date().toISOString()}`);
    
    if (axios.isAxiosError(error)) {
      logger.error(`${logPrefix} ----- DETALHES DO ERRO AXIOS -----`);
      logger.error(`${logPrefix} Mensagem:`, error.message);
      logger.error(`${logPrefix} Código:`, error.code);
      logger.error(`${logPrefix} Status:`, error.response?.status);
      logger.error(`${logPrefix} Status Text:`, error.response?.statusText);
      logger.error(`${logPrefix} Response Data:`, error.response?.data);
      logger.error(`${logPrefix} Request Config:`, {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      });
      logger.error(`${logPrefix} ----- FIM DETALHES AXIOS -----`);
      
      if (error.response) {
        throw new Error(`Erro do servidor: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
      }
    }
    
    // Se for um erro customizado (do nosso parsing), mantém a mensagem original
    if (error instanceof Error) {
      logger.error(`${logPrefix} Erro customizado:`, error.message);
      throw error;
    }
    
    logger.error(`${logPrefix} =================== FIM ERRO DA CONSULTA ===================`);
    throw new Error('Erro ao buscar pertences. Verifique o CPF/CNPJ e tente novamente.');
  }
};

// Helper function to parse the result data
const parseResultData = (data: any, logPrefix: string = '[PARSE]'): Pertence[] => {
  try {
    logger.info(`${logPrefix} =================== ANÁLISE DETALHADA DOS DADOS ===================`);
    logger.debug(`${logPrefix} Dados recebidos para parse:`, JSON.stringify(data, null, 2));

    if (!data) {
      logger.warn(`${logPrefix} Dados de resultado vazios`);
      return [];
    }

    // A estrutura real é: data -> Sdtretornopertences -> SDTRetornoPertences.SDTRetornoPertencesItem
    let pertencesData = data;

    // Se data tem a propriedade Sdtretornopertences
    if (data.Sdtretornopertences) {
      logger.info(`${logPrefix} Encontrado Sdtretornopertences`);
      pertencesData = data.Sdtretornopertences;
      logger.debug(`${logPrefix} PertencesData extraído:`, JSON.stringify(pertencesData, null, 2));
    } else {
      logger.info(`${logPrefix} Sdtretornopertences não encontrado, usando data diretamente`);
    }

    // Busca pelo item principal
    const pertencesItem = pertencesData['SDTRetornoPertences.SDTRetornoPertencesItem'];

    if (!pertencesItem) {
      logger.warn(`${logPrefix} =================== ITEM DE PERTENCES NÃO ENCONTRADO ===================`);
      logger.warn(`${logPrefix} Estrutura disponível:`, JSON.stringify(pertencesData, null, 2));
      logger.warn(`${logPrefix} Chaves disponíveis:`, Object.keys(pertencesData));
      return [];
    }

    logger.info(`${logPrefix} =================== ITEM DE PERTENCES ENCONTRADO ===================`);
    logger.debug(`${logPrefix} Item completo:`, JSON.stringify(pertencesItem, null, 2));

    // Verificar se há erro (CPF/CNPJ inválido)
    if (pertencesItem.SRPCPFCNPJInvalido === 'S') {
      logger.error(`${logPrefix} CPF/CNPJ marcado como inválido pelo servidor`);
      throw new Error('CPF/CNPJ inválido');
    }

    logger.info(`${logPrefix} =================== DADOS DO CONTRIBUINTE ===================`);
    logger.info(`${logPrefix} Nome: ${pertencesItem.SRPNomeContribuinte || 'N/A'}`);
    logger.info(`${logPrefix} CPF/CNPJ: ${pertencesItem.SRPCPFCNPJContribuinte || 'N/A'}`);
    logger.info(`${logPrefix} Código: ${pertencesItem.SRPCodigoContribuinte || 'N/A'}`);
    logger.info(`${logPrefix} CPF/CNPJ Inválido: ${pertencesItem.SRPCPFCNPJInvalido || 'N/A'}`);

    const pertences: Pertence[] = [];

    // Sempre adiciona o Contribuinte Geral, agora com cpfCnpj e codigoContribuinte
    pertences.push({
      inscricao: pertencesItem.SRPCodigoContribuinte || '',
      nomeRazaoSocial: pertencesItem.SRPNomeContribuinte || '',
      tipoContribuinte: 'Contribuinte Geral',
      situacao: 'Ativo',
      endereco: '',
      bairro: '',
      numero: '',
      complemento: `CPF/CNPJ: ${pertencesItem.SRPCPFCNPJContribuinte || ''}`,
      cpfCnpj: pertencesItem.SRPCPFCNPJContribuinte || '',
      codigoContribuinte: pertencesItem.SRPCodigoContribuinte || '',
    });

    // Processar dados da empresa se existirem
    const empresa = pertencesItem.SDTRetornoPertencesEmpresa;
    if (empresa && empresa.SDTRetornoPertencesEmpresaItem) {
      logger.info(`${logPrefix} =================== PROCESSANDO DADOS DA EMPRESA ===================`);

      const empresaItem = Array.isArray(empresa.SDTRetornoPertencesEmpresaItem)
        ? empresa.SDTRetornoPertencesEmpresaItem[0]
        : empresa.SDTRetornoPertencesEmpresaItem;

      logger.info(`${logPrefix} Inscrição Empresa: ${empresaItem.SRPInscricaoEmpresa || 'N/A'}`);
      logger.info(`${logPrefix} Endereço Empresa: ${empresaItem.SRPEnderecoEmpresa || 'N/A'}`);
      logger.info(`${logPrefix} Possui Débito Empresa: ${empresaItem.SRPPossuiDebitoEmpresa || 'N/A'}`);
      logger.info(`${logPrefix} Autônomo: ${empresaItem.SRPAutonomo || 'N/A'}`);

      pertences.push({
        inscricao: empresaItem.SRPInscricaoEmpresa || '',
        nomeRazaoSocial: pertencesItem.SRPNomeContribuinte || '',
        tipoContribuinte: empresaItem.SRPAutonomo === 'E' ? 'Empresa' : 'Autônomo',
        situacao: empresaItem.SRPPossuiDebitoEmpresa === 'S' ? 'Com Débito' : 'Ativo',
        endereco: empresaItem.SRPEnderecoEmpresa || '',
        bairro: '', // Extrair do endereço se necessário
        numero: '', // Extrair do endereço se necessário
        complemento: `Tipo: Empresa, Débito Suspenso: ${empresaItem.SRPDebitoSuspensoEmpresa || 'N/A'}`,
      });
    }

    // Processar imóveis se existirem
    const imoveis = pertencesItem.SDTRetornoPertencesImovel;
    if (imoveis && imoveis.SDTRetornoPertencesImovelItem) {
      logger.info(`${logPrefix} =================== PROCESSANDO IMÓVEIS ===================`);

      const imoveisArray = Array.isArray(imoveis.SDTRetornoPertencesImovelItem)
        ? imoveis.SDTRetornoPertencesImovelItem
        : [imoveis.SDTRetornoPertencesImovelItem];

      logger.info(`${logPrefix} Total de imóveis encontrados: ${imoveisArray.length}`);

      imoveisArray.forEach((imovel: any, index: number) => {
        logger.info(`${logPrefix} ----- IMÓVEL ${index + 1} -----`);
        logger.info(`${logPrefix} Inscrição: ${imovel.SRPInscricaoImovel || 'N/A'}`);
        logger.info(`${logPrefix} Tipo: ${imovel.SRPTipoImovel || 'N/A'}`);
        logger.info(`${logPrefix} Endereço: ${imovel.SRPEnderecoImovel || 'N/A'}`);
        logger.info(`${logPrefix} Tipo Proprietário: ${imovel.SRPTipoProprietario || 'N/A'}`);
        logger.info(`${logPrefix} Possui Débito: ${imovel.SRPPossuiDebitoImovel || 'N/A'}`);
        logger.info(`${logPrefix} Débito Suspenso: ${imovel.SRPDebitoSuspensoImovel || 'N/A'}`);
        logger.debug(`${logPrefix} Dados completos do imóvel:`, JSON.stringify(imovel, null, 2));

        pertences.push({
          inscricao: imovel.SRPInscricaoImovel || '',
          nomeRazaoSocial: pertencesItem.SRPNomeContribuinte || '',
          tipoContribuinte: 'Imóvel',
          situacao: imovel.SRPPossuiDebitoImovel === 'S' ? 'Com Débito' : 'Ativo',
          endereco: imovel.SRPEnderecoImovel || '',
          bairro: '', // Não disponível na estrutura atual
          numero: '', // Não disponível na estrutura atual
          complemento: `Tipo: ${imovel.SRPTipoImovel || ''}, Proprietário: ${imovel.SRPTipoProprietario || ''}`,
        });
      });
    } else {
      logger.info(`${logPrefix} =================== NENHUM IMÓVEL ENCONTRADO ===================`);
      logger.info(`${logPrefix} Estrutura de imóveis:`, JSON.stringify(imoveis, null, 2));
    }

    logger.info(`${logPrefix} =================== RESULTADO FINAL ===================`);
    logger.info(`${logPrefix} Total de pertences processados: ${pertences.length}`);
    logger.debug(`${logPrefix} Pertences finais:`, JSON.stringify(pertences, null, 2));

    return pertences;

  } catch (error) {
    logger.error(`${logPrefix} =================== ERRO NO PARSE DOS DADOS ===================`);
    logger.error(`${logPrefix} Erro:`, error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro ao processar dados do servidor');
  }
};

// Função utilitária para formatação da inscrição municipal
// Por padrão, retorna apenas números sem zeros à esquerda. Se padTo15 for true, retorna 15 dígitos (exigido por algumas prefeituras).
// Recomenda-se deixar padTo15 ajustável por variável de ambiente para facilitar mudanças futuras.
export function formatInscricao(inscricao: string, padTo15: boolean = false): string {
  // Garante que inscricao seja string antes de usar replace
  const strInscricao = typeof inscricao === 'string' ? inscricao : String(inscricao);
  const clean = strInscricao.replace(/\D/g, '');
  return padTo15 ? clean.padStart(15, '0') : clean;
}

// Função para validar campos obrigatórios antes do envio
function validateDocumentParams(params: DocumentRequestParams): void {
  if (!params.SSEChave) throw new Error('SSEChave é obrigatório');
  if (!params.SSETipoContribuinte) throw new Error('SSETipoContribuinte é obrigatório');
  if (!params.SSEInscricao) throw new Error('SSEInscricao é obrigatório');
  if (!params.SSECPFCNPJ) throw new Error('SSECPFCNPJ é obrigatório');
  if (!params.SSEOperacao) throw new Error('SSEOperacao é obrigatório');
}

// Função para mapear o retorno da API de documentos para o tipo Pertence
function mapDocumentoResponseToPertence(data: DocumentResponse): Pertence {
// Mapeamento dos campos conforme DocumentResponse definido em types/index.ts
return {
  inscricao: data.SSAInscricao || '',
  nomeRazaoSocial: data.SSANomeRazao || '',
  tipoContribuinte: data.SSATipoContribuinte || '',
  situacao: '', // Não existe SSASituacao, pode ser derivado de SSACodigo ou SSAMensagem se necessário
  endereco: data.SSALogradouro || '',
  bairro: data.SSABairro || '',
  numero: data.SSANumero || '',
  complemento: data.SSAComplemento || '',
};
}

// API de Documentos
// Em desenvolvimento, usamos o proxy /api-documento (configurado no Vite) para evitar CORS e facilitar testes locais.
// Em produção, a URL real da API é: https://homologacao.abaco.com.br/arapiraca_proj_hml_eagata/servlet/apapidocumento
// Mantenha o proxy para ambiente local, mas destaque a URL real para produção em comentários e documentação.
export const emitirDocumento = async (
  inscricao: string,
  tipoContribuinte: string,
  tipoOperacao: DocumentType,
  cpfCnpj: string,
  padTo15: boolean = true // Permite ajuste do formato da inscrição municipal via parâmetro/configuração
): Promise<DocumentResponse> => {
  const timestamp = new Date().toISOString();
  const logPrefix = `[DOC-API-${timestamp}]`;

  try {
    logger.info(`${logPrefix} =================== INICIANDO EMISSÃO DE DOCUMENTO ===================`);
    logger.info(`${logPrefix} Inscrição: ${inscricao}`);
    logger.info(`${logPrefix} Tipo Contribuinte: ${tipoContribuinte}`);
    logger.info(`${logPrefix} Tipo Operação: ${tipoOperacao}`);
    logger.info(`${logPrefix} CPF/CNPJ: ${cpfCnpj}`);

    // Formata inscrição municipal conforme exigido pela API
    const formattedInscricao = formatInscricao(inscricao, padTo15);

    // Configuração da requisição para API de documentos
    const documentParams: DocumentRequestParams = {
      SSEChave: '@C0sS0_@P1', // Chave de acesso conforme documentação
      SSETipoContribuinte: tipoContribuinte,
      SSEInscricao: formattedInscricao,
      SSEExercicioDebito: '',
      SSETipoConsumo: '',
      SSENossoNumero: '',
      SSECPFCNPJ: cpfCnpj,
      SSEOperacao: tipoOperacao,
      SSEIdentificador: ''
    };

    // Validação dos campos obrigatórios
    validateDocumentParams(documentParams);

    logger.info(`${logPrefix} =================== PARÂMETROS DA REQUISIÇÃO ===================`);
    logger.info(`${logPrefix} Parâmetros completos:`, JSON.stringify(documentParams, null, 2));

    // Apenas os headers necessários: Content-Type e DadosAPIDocumento
    // Não inclua headers extras para garantir conformidade com a API
    const documentApiInstance = axios.create({
      timeout: config.apiTimeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Proxy para ambiente local, URL real para produção
    // const apiUrl = 'https://homologacao.abaco.com.br/arapiraca_proj_hml_eagata/servlet/apapidocumento'; // Produção
    const apiUrl = '/api-documento'; // Desenvolvimento/local

    logger.info(`${logPrefix} =================== CONFIGURAÇÃO DA REQUISIÇÃO ===================`);
    logger.info(`${logPrefix} Timeout: ${config.apiTimeout}`);
    logger.info(`${logPrefix} Headers:`, documentApiInstance.defaults.headers);

    logger.info(`${logPrefix} =================== FAZENDO REQUISIÇÃO ===================`);
    logger.info(`${logPrefix} URL: ${apiUrl}`);
    logger.info(`${logPrefix} Método: GET`);
    logger.info(`${logPrefix} Header DadosAPIDocumento:`, JSON.stringify(documentParams));
    logger.info(`${logPrefix} Instância axios criada com sucesso`);

    // Envia os dados no header DadosAPIDocumento conforme documentação
    const response: AxiosResponse<DocumentResponse> = await documentApiInstance.get(apiUrl, {
      headers: {
        'DadosAPIDocumento': JSON.stringify(documentParams)
      }
    });

    logger.info(`${logPrefix} =================== RESPOSTA RECEBIDA ===================`);
    logger.info(`${logPrefix} Status HTTP: ${response.status}`);
    logger.info(`${logPrefix} Status Text: ${response.statusText}`);
    logger.info(`${logPrefix} Headers da resposta:`, response.headers);
    logger.info(`${logPrefix} Dados da resposta:`, JSON.stringify(response.data, null, 2));

    // Mapeia o retorno para o tipo Pertence
    const mappedPertence = mapDocumentoResponseToPertence(response.data);
    logger.info(`${logPrefix} Dados mapeados para Pertence:`, JSON.stringify(mappedPertence, null, 2));

    if (response.data.SSACodigo === 0) {
      logger.info(`${logPrefix} Documento emitido com sucesso!`);
      logger.info(`${logPrefix} Link do documento: ${response.data.SSALinkDocumento}`);
      return response.data;
    } else {
      logger.error(`${logPrefix} Erro na emissão do documento:`, response.data.SSAMensagem);
      throw new Error(response.data.SSAMensagem || 'Erro ao emitir documento');
    }

  } catch (error) {
    logger.error(`${logPrefix} =================== ERRO NA EMISSÃO DO DOCUMENTO ===================`);
    logger.error(`${logPrefix} Tipo do erro:`, typeof error);
    logger.error(`${logPrefix} Erro completo:`, error);

    if (axios.isAxiosError(error)) {
      logger.error(`${logPrefix} É um erro do Axios`);
      if (error.response) {
        logger.error(`${logPrefix} Status HTTP: ${error.response.status}`);
        logger.error(`${logPrefix} Status Text: ${error.response.statusText}`);
        logger.error(`${logPrefix} Headers da resposta:`, error.response.headers);
        logger.error(`${logPrefix} Dados da resposta:`, error.response.data);
        throw new Error(`Erro na API: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        logger.error(`${logPrefix} Erro de rede - sem resposta do servidor`);
        logger.error(`${logPrefix} Request:`, error.request);
        throw new Error('Erro de conexão com o servidor');
      } else {
        logger.error(`${logPrefix} Erro na configuração da requisição:`, error.message);
        throw new Error(`Erro na configuração: ${error.message}`);
      }
    }

    if (error instanceof Error) {
      logger.error(`${logPrefix} Erro instanceof Error:`, error.message);
      logger.error(`${logPrefix} Stack trace:`, error.stack);
      throw error;
    }

    logger.error(`${logPrefix} Erro desconhecido:`, error);
    throw new Error('Erro desconhecido ao emitir documento');
  }
};

// Mapeia dados da API para o tipo Pertence
const mapToPertence = (item: any): Pertence => {
  return {
    inscricao: item.inscricao || item.Inscricao || item.INSCRICAO || '',
    nomeRazaoSocial: item.nomeRazaoSocial || item.nome || item.razaoSocial || item.Nome || item.NOME || '',
    tipoContribuinte: item.tipoContribuinte || item.tipo || item.Tipo || item.TIPO || '',
    situacao: item.situacao || item.status || item.Status || item.SITUACAO || 'Ativo',
    endereco: item.endereco || item.Endereco || item.ENDERECO || '',
    bairro: item.bairro || item.Bairro || item.BAIRRO || '',
    numero: item.numero || item.Numero || item.NUMERO || '',
    complemento: item.complemento || item.Complemento || item.COMPLEMENTO || '',
  };
};

// Re-exporta funções de validação para manter compatibilidade
export { formatCpfCnpj, validateCpfCnpj, validateDocument } from '../utils/validation';

// Constantes para tipos de documento
export const DOCUMENT_TYPES = {
  DEMONSTRATIVO: '1',
  CERTIDAO: '2',
  BCI: '3',
  BCM: '4',
  ALVARA_FUNCIONAMENTO: '5',
  //VISA: '6'
} as const;