/**
 * This is a sample test suite.
 * Replace this with your implementation.
 */
import { isLocalPath } from './checkLocalPath';

describe('Utils Tests', () => {
  it('should be false using invalid path', () => {
    expect(isLocalPath('./error-path')).toEqual(false);
  });
});
