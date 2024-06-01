/**
 * This is a sample test suite.
 * Replace this with your implementation.
 */
import { readWorkspacesDependencies, analyze } from './index';

describe('Workspaces Tests', () => {
  it('should be that the package.json cannot be found', () => {
    expect(() => {
      readWorkspacesDependencies('./error-path');
    }).toThrow(new Error(`Cannot find package.json on ./error-path.`));
  });
  it('should be that the package.json can be found', () => {
    expect(readWorkspacesDependencies('./src/platforms/workspaces/yarn/fixture')).toMatchSnapshot();
  });
  it('can analyze for local packages', async () => {
    await expect(analyze('./src/platforms/workspaces/yarn/fixture')).resolves.toMatchSnapshot();
  });
});
