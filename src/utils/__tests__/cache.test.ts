import { describe, it, expect, beforeEach } from 'vitest';
import { cache } from '../../utils/cache';

describe('Cache Utils', () => {
  beforeEach(() => {
    cache.clear();
  });

  it('should store and retrieve data', () => {
    const testData = { name: 'Test', value: 123 };
    cache.set('test-key', testData);
    
    const retrieved = cache.get('test-key');
    expect(retrieved).toEqual(testData);
  });

  it('should return null for non-existent key', () => {
    const result = cache.get('non-existent');
    expect(result).toBeNull();
  });

  it('should expire data after TTL', async () => {
    const testData = { name: 'Test' };
    cache.set('test-key', testData, 100); // 100ms TTL
    
    // Should exist immediately
    expect(cache.get('test-key')).toEqual(testData);
    
    // Wait for expiration
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Should be expired
    expect(cache.get('test-key')).toBeNull();
  });

  it('should delete specific keys', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    
    expect(cache.delete('key1')).toBe(true);
    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBe('value2');
  });

  it('should clear all data', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    
    cache.clear();
    
    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBeNull();
    expect(cache.size()).toBe(0);
  });

  it('should return correct size', () => {
    expect(cache.size()).toBe(0);
    
    cache.set('key1', 'value1');
    expect(cache.size()).toBe(1);
    
    cache.set('key2', 'value2');
    expect(cache.size()).toBe(2);
  });
});
