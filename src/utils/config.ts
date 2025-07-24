/**
 * Configurações da aplicação obtidas das variáveis de ambiente
 */
interface AppConfig {
  apiUrl: string;
  apiTimeout: number;
  enableLogs: boolean;
  appTitle: string;
  appVersion: string;
  municipality: string;
  cacheTtl: number;
  enableCache: boolean;
}

// Função para obter valor de variável de ambiente com fallback
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  // No Vite, as variáveis de ambiente são acessadas via import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || defaultValue;
  }
  
  if (typeof window !== 'undefined' && (window as any).env) {
    return (window as any).env[key] || defaultValue;
  }
  
  // Fallback para desenvolvimento (caso as variáveis de ambiente não estejam disponíveis)
  const envVars: Record<string, string> = {
    VITE_SOAP_URL: '/api/apwsretornopertences', // URL do proxy para desenvolvimento
    VITE_API_TIMEOUT: '30000',
    VITE_ENABLE_LOGS: 'true',
    VITE_APP_TITLE: 'Portal de Serviços - Secretaria Municipal da Fazenda - SMFAZ',
    VITE_APP_VERSION: '1.0.0',
    VITE_MUNICIPALITY: 'Arapiraca',
    VITE_CACHE_TTL: '300000',
    VITE_ENABLE_CACHE: 'true'
  };
  return envVars[key] || defaultValue;
};

export const config: AppConfig = {
  // Força o uso do proxy Vite para SOAP em todos os ambientes
  apiUrl: '/api/apwsretornopertences',
  apiTimeout: parseInt(getEnvVar('VITE_API_TIMEOUT', '30000')),
  enableLogs: getEnvVar('VITE_ENABLE_LOGS', 'false') === 'true',
  appTitle: getEnvVar('VITE_APP_TITLE', 'Portal de Serviços'),
  appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  municipality: getEnvVar('VITE_MUNICIPALITY', 'Arapiraca'),
  cacheTtl: parseInt(getEnvVar('VITE_CACHE_TTL', '300000')),
  enableCache: getEnvVar('VITE_ENABLE_CACHE', 'false') === 'true',
};

/**
 * Logger utilitário que pode ser habilitado/desabilitado via configuração
 */
export const logger = {
  debug: (...args: any[]) => {
    if (config.enableLogs) {
      console.debug('[DEBUG]', ...args);
    }
  },
  info: (...args: any[]) => {
    if (config.enableLogs) {
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
};
