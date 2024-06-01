/**
 * This is a sample test suite.
 * Replace this with your implementation.
 */
import fetch from 'node-fetch';
import { exec } from 'child_process';
import { bootstrap } from './index';

const dependantsHtml = `
  <html>
    <body>
      <a id="package-tab-dependents" tabindex="0"><span><svg></svg>10000 Dependents</span></a>
    </body>
  </html>
`;

jest.mock('child_process');
jest.mock('node-fetch');

describe('CLI tool Tests', () => {
  it('main', async () => {
    (exec as any).mockImplementationOnce((_: any, callback: any) => {
      callback(null, { stdout: '{ "loose-envify": "^1.1.0" }' });
    });
    (fetch as any).mockReturnValueOnce(
      Promise.resolve({
        status: 200,
        text: () => dependantsHtml,
      }),
    );
    const spy = jest.spyOn(console, 'log');
    const program = await bootstrap(['node', 'index.js', 'analyze', 'react']);
    await expect(program.commands.map((i: any) => i._name)).toEqual(['analyze']);
    const result = spy.mock.calls[0][0];
    expect(result).toEqual(
      JSON.stringify(
        [
          {
            name: 'react',
            fanIn: 10000,
            fanOut: 1,
            stability: 0.00009999000099990002,
            label: 'Stable',
          },
        ],
        null,
        2,
      ),
    );
  });
});
