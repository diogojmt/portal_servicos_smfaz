# Portal do Contribuinte - Secretaria Municipal da Fazenda - SMFAZ

Portal do Contribuinte para contribuintes de Arapiraca realizarem consultas e solicitações online utilizando CPF/CNPJ.

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca para construção da interface
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool e servidor de desenvolvimento
- **Axios** - Cliente HTTP para requisições
- **Fast XML Parser** - Parser para respostas SOAP/XML
- **Vitest** - Framework de testes unitários
- **ESLint** - Linter para qualidade de código

## 📋 Funcionalidades

### ✅ Implementadas

- [x] Interface elegante e responsiva
- [x] Formulário de consulta por CPF/CNPJ com validação completa
- [x] Validação e formatação automática de documentos (algoritmos oficiais)
- [x] Integração com API SOAP de pertences
- [x] Listagem de vínculos encontrados
- [x] Design moderno com gradientes e efeitos
- [x] Cache inteligente de consultas
- [x] Loading states com skeleton screens
- [x] Tratamento robusto de erros
- [x] Acessibilidade (WCAG 2.1)
- [x] Logs configuráveis para debug
- [x] Configuração via variáveis de ambiente

### 🔄 Em Desenvolvimento

- [ ] Consulta de débitos
- [ ] Solicitação de certidões
- [ ] Ficha financeira
- [ ] Histórico de consultas
- [ ] Download de documentos
- [ ] Autenticação de usuários
- [ ] PWA (Progressive Web App)

## 🔌 APIs Integradas

### API de Pertences (Implementada)

- **Endpoint**: `https://homologacao.abaco.com.br/arapiraca_proj_hml_eagata/servlet/apwsretornopertences`
- **Método**: SOAP
- **Parâmetros**:
  - `Flagtipopesquisa`: "C" (CPF/CNPJ)
  - `Ctgcpf`: CPF/CNPJ do contribuinte
  - `Ctiinscricao`: Não utilizado

### Exemplo de Requisição SOAP

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:eag="eAgata_Arapiraca_Maceio_Ev3">
   <soapenv:Header/>
   <soapenv:Body>
      <eag:PWSRetornoPertences.Execute>
         <eag:Flagtipopesquisa>C</eag:Flagtipopesquisa>
         <eag:Ctgcpf>00321975000111</eag:Ctgcpf>
         <eag:Ctiinscricao></eag:Ctiinscricao>
      </eag:PWSRetornoPertences.Execute>
   </soapenv:Body>
</soapenv:Envelope>
```

## 🏗️ Estrutura do Projeto

```
portal-servicos-arapiraca/
├── src/
│   ├── components/
│   │   ├── __tests__/           # Testes dos componentes
│   │   ├── CPFForm.tsx          # Formulário de consulta
│   │   ├── Layout.tsx           # Layout principal
│   │   ├── ResultsList.tsx      # Lista de resultados
│   │   └── Skeleton.tsx         # Componentes de loading
│   ├── services/
│   │   └── api.ts              # Serviços de API
│   ├── styles/
│   │   └── global.css          # Estilos globais
│   ├── types/
│   │   └── index.ts            # Definições de tipos
│   ├── utils/
│   │   ├── __tests__/          # Testes dos utilitários
│   │   ├── cache.ts            # Sistema de cache
│   │   ├── config.ts           # Configurações da app
│   │   └── validation.ts       # Validações de CPF/CNPJ
│   ├── test/
│   │   └── setup.ts            # Configuração dos testes
│   ├── App.tsx                 # Componente principal
│   └── main.tsx                # Ponto de entrada
├── public/
│   └── index.html              # Template HTML
├── .env.example                # Exemplo de variáveis de ambiente
├── .eslintrc.json             # Configuração ESLint
├── .gitignore                 # Arquivos ignorados pelo Git
├── package.json                # Dependências e scripts
├── tsconfig.json              # Configuração TypeScript
├── vite.config.ts             # Configuração Vite + Vitest
└── README.md                  # Documentação
```

## 🛠️ Instalação e Execução

### Pré-requisitos

- Node.js 16+
- npm ou yarn

### Passos

1. **Clone o repositório**

   ```bash
   git clone <url-do-repositorio>
   cd portal-servicos-arapiraca
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**

   ```bash
   cp .env.example .env
   # Edite o arquivo .env conforme necessário
   ```

4. **Execute o projeto**

   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   - Abra o navegador em `http://localhost:3000`

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Serve o build de produção
- `npm run test` - Executa testes unitários
- `npm run test:ui` - Interface visual para testes
- `npm run test:coverage` - Relatório de cobertura de testes
- `npm run lint` - Verifica qualidade do código
- `npm run lint:fix` - Corrige problemas de lint automaticamente
- `npm run type-check` - Verifica tipos TypeScript

## 🔧 Configuração

### Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```env
# API
VITE_SOAP_URL=https://homologacao.abaco.com.br/arapiraca_proj_hml_eagata/servlet/apwsretornopertences
VITE_API_TIMEOUT=30000
VITE_ENABLE_LOGS=true

# Aplicação
VITE_APP_TITLE=Portal do Contribuinte - Secretaria Municipal da Fazenda - SMFAZ
VITE_APP_VERSION=1.0.0
VITE_MUNICIPALITY=Arapiraca

# Cache
VITE_CACHE_TTL=300000
VITE_ENABLE_CACHE=true
```

## 🎨 Design e UX

### Características do Design

- **Glassmorphism**: Efeitos de vidro com backdrop-filter
- **Gradientes**: Fundo com gradiente azul/roxo
- **Animações**: Transições suaves e hover effects
- **Responsividade**: Adaptável a diferentes tamanhos de tela
- **Loading States**: Skeleton screens durante carregamento
- **Acessibilidade**: WCAG 2.1, navegação por teclado, screen readers

### Paleta de Cores

- Primary: `#667eea` - `#764ba2` (gradiente)
- Success: `#27ae60`
- Warning: `#f39c12`
- Error: `#e74c3c`
- Text: `#2c3e50`
- Muted: `#7f8c8d`

## 🧪 Teste de Validação

Para testar a validação de CPF/CNPJ:

```bash
# Execute o teste simples
npx tsx src/test-validation.ts
```

Ou teste manualmente:

```javascript
import { validateDocument, formatCpfCnpj } from "./utils/validation";

// CPF válido
validateDocument("11144477735"); // true
formatCpfCnpj("11144477735"); // 111.444.777-35

// CNPJ válido
validateDocument("11222333000181"); // true
formatCpfCnpj("11222333000181"); // 11.222.333/0001-81
```

## 🔒 Segurança

### Implementado

- ✅ Validação robusta de entrada (algoritmos oficiais CPF/CNPJ)
- ✅ Sanitização de dados
- ✅ Headers de segurança nas requisições
- ✅ Tratamento de erros sem exposição de dados sensíveis
- ✅ Timeouts configuráveis
- ✅ Logs estruturados (sem dados pessoais)

### Próximas Implementações

- [ ] Rate limiting
- [ ] Autenticação/autorização
- [ ] HTTPS obrigatório
- [ ] CSP (Content Security Policy)
- [ ] Validação no backend

## 🚀 Performance

### Otimizações Implementadas

- ✅ Cache inteligente de consultas (5 min TTL padrão)
- ✅ Loading states para melhor UX
- ✅ Bundle otimizado com Vite
- ✅ Lazy loading de componentes (preparado)
- ✅ Debounce em formulários

### Métricas Alvo

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

## 🌐 Acessibilidade

### Implementado (WCAG 2.1)

- ✅ Semantic HTML
- ✅ ARIA labels e roles
- ✅ Navegação por teclado
- ✅ Contraste adequado (AAA)
- ✅ Focus indicators
- ✅ Screen reader support
- ✅ Skip links

## 🔧 Manutenção e Monitoramento

### Logs

```javascript
// Configurável via VITE_ENABLE_LOGS
logger.debug("Debug information");
logger.info("General information");
logger.warn("Warning message");
logger.error("Error occurred");
```

### Cache Management

```javascript
// Limpar cache manualmente
cache.clear();

// Verificar status
console.log(`Cache size: ${cache.size()}`);
console.log(`Cache enabled: ${cache.isEnabled()}`);
```

## 🚧 Roadmap

### Q1 2025

- [ ] Integração com API de débitos
- [ ] Sistema de autenticação
- [ ] Download de documentos
- [ ] Histórico de consultas

### Q2 2025

- [ ] PWA completo
- [ ] Notificações push
- [ ] Dashboard administrativo
- [ ] Analytics e métricas

### Q3 2025

- [ ] App mobile nativo
- [ ] Integração com Gov.br
- [ ] Chatbot de atendimento
- [ ] API pública documentada

## 👥 Contribuição

### Como Contribuir

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Faça commit: `git commit -am 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript para type safety
- Siga as regras do ESLint
- Escreva testes para novas funcionalidades
- Documente APIs e componentes complexos
- Use conventional commits

### Estrutura de Commits

```
feat: adiciona nova funcionalidade
fix: corrige bug específico
docs: atualiza documentação
style: mudanças de formatação
refactor: refatora código existente
test: adiciona ou corrige testes
chore: tarefas de manutenção
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Contato e Suporte

### Equipe de Desenvolvimento

- **Email**: desenvolvimento@arapiraca.al.gov.br
- **Telefone**: (82) 3521-1234
- **Horário**: Segunda a Sexta, 8h às 17h

### Suporte Técnico

- **Email**: suporte@arapiraca.al.gov.br
- **Chat**: Disponível no portal durante horário comercial
- **FAQ**: https://arapiraca.al.gov.br/faq

### Reportar Problemas

Para reportar bugs ou sugerir melhorias:

1. Use as Issues do GitHub
2. Inclua passos para reproduzir
3. Anexe screenshots se aplicável
4. Especifique navegador e versão

---

**Desenvolvido com ❤️ para a Prefeitura Municipal de Arapiraca**

_"Tecnologia a serviço do cidadão"_
