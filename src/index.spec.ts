/**
 * This is a sample test suite.
 * Replace this with your implementation.
 */
import { analyze } from './index';

describe('Main Tests', () => {
  it('can analyze a valid npm package', async () => {
    await expect(analyze('react')).resolves.toMatchSnapshot();
  });
  it('can analyze for local packages', async () => {
    await expect(analyze('./src/platforms/workspaces/yarn/fixture')).resolves.toMatchSnapshot();
  });
});
