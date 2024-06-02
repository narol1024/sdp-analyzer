/**
 * This is a sample test suite.
 * Replace this with your implementation.
 */
import { evaluate } from './index';

describe('Core Tests', () => {
  test('should return correct SDP value with non-zero fan-in and fan-out', () => {
    expect(evaluate(4, 4)).toBe(0.5);
  });

  test('should return 1 when fan-in is 0', () => {
    expect(evaluate(5, 0)).toBe(1);
  });

  test('should return 0 when fan-out is 0', () => {
    expect(evaluate(0, 3)).toBe(0);
  });

  test('should return 0 when both fan-in and fan-out are 0', () => {
    expect(evaluate(0, 0)).toBe(0);
  });

  test('should handle large numbers', () => {
    expect(evaluate(1000, 500)).toBe(2 / 3);
  });
});
