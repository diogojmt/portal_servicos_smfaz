import { describe, it, expect } from 'vitest';
import { formatCpfCnpj, validateCpf, validateCnpj, validateDocument } from '../../utils/validation';

describe('Validation Utils', () => {
  describe('formatCpfCnpj', () => {
    it('should format CPF correctly', () => {
      expect(formatCpfCnpj('12345678901')).toBe('123.456.789-01');
      expect(formatCpfCnpj('123.456.789-01')).toBe('123.456.789-01');
    });

    it('should format CNPJ correctly', () => {
      expect(formatCpfCnpj('12345678000195')).toBe('12.345.678/0001-95');
      expect(formatCpfCnpj('12.345.678/0001-95')).toBe('12.345.678/0001-95');
    });

    it('should handle empty string', () => {
      expect(formatCpfCnpj('')).toBe('');
    });
  });

  describe('validateCpf', () => {
    it('should validate correct CPF', () => {
      expect(validateCpf('11144477735')).toBe(true);
      expect(validateCpf('111.444.777-35')).toBe(true);
    });

    it('should reject invalid CPF', () => {
      expect(validateCpf('12345678901')).toBe(false);
      expect(validateCpf('111.444.777-36')).toBe(false);
      expect(validateCpf('11111111111')).toBe(false);
    });

    it('should reject CPF with wrong length', () => {
      expect(validateCpf('123456789')).toBe(false);
      expect(validateCpf('123456789012')).toBe(false);
    });
  });

  describe('validateCnpj', () => {
    it('should validate correct CNPJ', () => {
      expect(validateCnpj('11222333000181')).toBe(true);
      expect(validateCnpj('11.222.333/0001-81')).toBe(true);
    });

    it('should reject invalid CNPJ', () => {
      expect(validateCnpj('12345678000195')).toBe(false);
      expect(validateCnpj('11.222.333/0001-82')).toBe(false);
      expect(validateCnpj('11111111111111')).toBe(false);
    });

    it('should reject CNPJ with wrong length', () => {
      expect(validateCnpj('1122233300018')).toBe(false);
      expect(validateCnpj('112223330001811')).toBe(false);
    });
  });

  describe('validateDocument', () => {
    it('should validate CPF', () => {
      expect(validateDocument('11144477735')).toBe(true);
      expect(validateDocument('12345678901')).toBe(false);
    });

    it('should validate CNPJ', () => {
      expect(validateDocument('11222333000181')).toBe(true);
      expect(validateDocument('12345678000195')).toBe(false);
    });

    it('should reject invalid length', () => {
      expect(validateDocument('123456789')).toBe(false);
      expect(validateDocument('123456789012345')).toBe(false);
    });
  });
});
