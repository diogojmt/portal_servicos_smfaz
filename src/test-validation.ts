// Teste simples para validação de CPF/CNPJ
// Execute: npm test (se tiver vitest instalado)

import { validateDocument, formatCpfCnpj } from './utils/validation';

// Teste básico de CPF válido
console.log('✓ CPF válido:', validateDocument('11144477735')); // true

// Teste básico de CPF inválido
console.log('✗ CPF inválido:', validateDocument('12345678901')); // false

// Teste básico de CNPJ válido
console.log('✓ CNPJ válido:', validateDocument('11222333000181')); // true

// Teste de formatação
console.log('Formatação CPF:', formatCpfCnpj('11144477735')); // 111.444.777-35
console.log('Formatação CNPJ:', formatCpfCnpj('11222333000181')); // 11.222.333/0001-81

export {};
