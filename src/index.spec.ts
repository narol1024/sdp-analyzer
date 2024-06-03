import { analyze } from './index';

describe('Main Tests', () => {
  it('can be analyzed for a valid npm package', async () => {
    await expect(analyze('react')).resolves.toMatchSnapshot();
  });
  it('can be analyzed for local packages', async () => {
    await expect(analyze('./src/platforms/workspaces/yarn/fixture/valid-packages')).resolves.toMatchSnapshot();
  });
});
