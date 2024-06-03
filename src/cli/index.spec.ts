/**
 * This is a sample test suite.
 * Replace this with your implementation.
 */
import { bootstrap } from './index';

describe('CLI tool Tests', () => {
  it('main', async () => {
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
