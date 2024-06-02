/**
 * This is a sample test suite.
 * Replace this with your implementation.
 */
import fetch from 'node-fetch';
import { exec } from 'child_process';
import { analyze } from './index';

jest.mock('child_process');
jest.mock('node-fetch');

const dependantsHtml = `
  <html>
    <body>
      <a id="package-tab-dependents" tabindex="0"><span><svg></svg>10000 Dependents</span></a>
    </body>
  </html>
`;

describe('Main Tests', () => {
  it('can be analyzed for a valid npm package', async () => {
    (exec as any).mockImplementationOnce((_: any, callback: any) => {
      callback(null, { stdout: '{ "loose-envify": "^1.1.0" }' });
    });
    (fetch as any).mockReturnValueOnce(
      Promise.resolve({
        status: 200,
        text: () => dependantsHtml,
      }),
    );
    await expect(analyze('react')).resolves.toMatchSnapshot();
  });
  it('can be analyzed for local packages', async () => {
    await expect(analyze('./src/platforms/workspaces/yarn/fixture/valid-packages')).resolves.toMatchSnapshot();
  });
});
