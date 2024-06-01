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
  it('should read a valid package', () => {
    expect(readWorkspacesDependencies('./src/platforms/workspaces/yarn/fixture/valid-packages')).toMatchSnapshot();
  });
  it('should not read an invalid package', async () => {
    await expect(analyze('./src/platforms/workspaces/yarn/fixture/invalid-packages')).rejects.toEqual(
      new Error(
        `It seems that the 'subpackages' directory has not been found, please check the configuration of yarn workspaces.`,
      ),
    );
  });
  it('can not analyze for the invalid local packages', async () => {
    await expect(analyze('./error-path')).rejects.toEqual(
      new Error(`Cannot analyze ./error-path, the reason is \"Cannot find package.json on ./error-path.\".`),
    );
  });
  it('can be analyzed for the local packages', async () => {
    await expect(analyze('./src/platforms/workspaces/yarn/fixture/valid-packages')).resolves.toMatchSnapshot();
  });
});
