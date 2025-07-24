/**
 * Formata CPF/CNPJ para exibição
 * @param value - Valor a ser formatado
 * @returns Valor formatado
 */
export const formatCpfCnpj = (value: string): string => {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 11) {
    // CPF format: 000.000.000-00
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else {
    // CNPJ format: 00.000.000/0000-00
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
};

/**
 * Valida CPF/CNPJ
 * @param value - Valor a ser validado
 * @returns true se válido, false caso contrário
 */
export const validateCpfCnpj = (value: string): boolean => {
  const numbers = value.replace(/\D/g, '');
  return numbers.length === 11 || numbers.length === 14;
};

/**
 * Valida CPF usando algoritmo oficial
 * @param cpf - CPF a ser validado
 * @returns true se válido, false caso contrário
 */
export const validateCpf = (cpf: string): boolean => {
  const numbers = cpf.replace(/\D/g, '');
  
  if (numbers.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false;
  
  // Valida primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers[i]) * (10 - i);
  }
  let digit1 = (sum * 10) % 11;
  if (digit1 === 10) digit1 = 0;
  
  if (digit1 !== parseInt(numbers[9])) return false;
  
  // Valida segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers[i]) * (11 - i);
  }
  let digit2 = (sum * 10) % 11;
  if (digit2 === 10) digit2 = 0;
  
  return digit2 === parseInt(numbers[10]);
};

/**
 * Valida CNPJ usando algoritmo oficial
 * @param cnpj - CNPJ a ser validado
 * @returns true se válido, false caso contrário
 */
export const validateCnpj = (cnpj: string): boolean => {
  const numbers = cnpj.replace(/\D/g, '');
  
  if (numbers.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false;
  
  // Valida primeiro dígito verificador
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(numbers[i]) * weights1[i];
  }
  let digit1 = sum % 11;
  digit1 = digit1 < 2 ? 0 : 11 - digit1;
  
  if (digit1 !== parseInt(numbers[12])) return false;
  
  // Valida segundo dígito verificador
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(numbers[i]) * weights2[i];
  }
  let digit2 = sum % 11;
  digit2 = digit2 < 2 ? 0 : 11 - digit2;
  
  return digit2 === parseInt(numbers[13]);
};

/**
 * Valida CPF ou CNPJ usando algoritmos oficiais
 * @param value - Valor a ser validado
 * @returns true se válido, false caso contrário
 */
export const validateDocument = (value: string): boolean => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 11) {
    return validateCpf(numbers);
  } else if (numbers.length === 14) {
    return validateCnpj(numbers);
  }
  
  return false;
};
