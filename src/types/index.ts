export interface ApiResponse {
    success: boolean;
    message: string;
    data: Pertence[];
}

export interface Pertence {
    inscricao: string;
    nomeRazaoSocial: string;
    tipoContribuinte: string;
    situacao: string;
    endereco?: string;
    bairro?: string;
    numero?: string;
    complemento?: string;
}

export interface FormData {
    cpfCnpj: string;
}

export interface SoapEnvelope {
    'SOAP-ENV:Body'?: SoapBody;
    'soapenv:Body'?: SoapBody;
    'soap:Body'?: SoapBody;
}

export interface SoapBody {
    'PWSRetornoPertences.ExecuteResponse': {
        'Sdtretornopertences': {
            'SDTRetornoPertences.SDTRetornoPertencesItem': SDTRetornoPertencesItem;
        };
    };
}

export interface SoapResponse {
    'SOAP-ENV:Envelope'?: SoapEnvelope;
    'soap:Envelope'?: SoapEnvelope;
    'soapenv:Envelope'?: SoapEnvelope;
    [key: string]: any; // Para permitir outras variações de namespace
}

export interface SDTRetornoPertencesItem {
    SRPCodigoContribuinte: string;
    SRPCPFCNPJInvalido: string;
    SRPNomeContribuinte: string;
    SRPCPFCNPJContribuinte: string;
    SDTRetornoPertencesImovel?: {
        SDTRetornoPertencesImovelItem: SDTRetornoPertencesImovelItem | SDTRetornoPertencesImovelItem[];
    };
}

export interface SDTRetornoPertencesImovelItem {
    SRPInscricaoImovel: string;
    SRPDebitoSuspensoImovel: string;
    SRPTipoImovel: string;
    SRPEnderecoImovel: string;
    SRPTipoProprietario: string;
    SRPPossuiDebitoImovel: string;
    SRPProprietario: string;
}

export interface CacheItem<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

export interface ErrorResponse {
    message: string;
    code?: string;
    details?: any;
}

export interface LoadingState {
    isLoading: boolean;
    error: string | null;
}

export interface SearchResult {
    pertences: Pertence[];
    searchedCpfCnpj: string;
    timestamp: number;
}

// Tipos para API de Documentos
export interface DocumentRequestParams {
    SSEChave: string;
    SSETipoContribuinte: string;
    SSEInscricao: string;
    SSEExercicioDebito: string;
    SSETipoConsumo: string;
    SSENossoNumero: string;
    SSECPFCNPJ: string;
    SSEOperacao: string;
    SSEIdentificador: string;
}

export interface DocumentResponse {
    SSAInscricao: string;
    SSATipoContribuinte: string;
    SSANomeRazao: string;
    SSACPFCNPJ: string;
    SSATipoPessoa: string;
    SSALogradouro: string;
    SSAComplemento: string;
    SSANumero: string;
    SSABairro: string;
    SSACEP: string;
    SSACidade: string;
    SSAUF: string;
    SSAQuadra: string;
    SSALote: string;
    SSALoteamento: string;
    SSALoteLote: string;
    SSAQuadraLote: string;
    SSALinkDocumento: string;
    SSACodigo: number;
    SSAMensagem: string;
}

export type DocumentType = 
    | '1' // DEMONSTRATIVO
    | '2' // CERTIDÃO
    | '3' // BCI
    | '4' // BCM
    | '5' // ALVARÁ DE FUNCIONAMENTO
    | '6'; // VISA

export interface DocumentTypeInfo {
    id: DocumentType;
    name: string;
    description: string;
    icon: string;
}