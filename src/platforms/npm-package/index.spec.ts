/**
 * This is a sample test suite.
 * Replace this with your implementation.
 */
import fetch from 'node-fetch';
import { exec } from 'child_process';
import { readNpmPackageDependencies, countNpmPackageDependants, analyze } from './index';

const dependantsHtml = `
  <html>
    <body>
      <a id="package-tab-dependents" tabindex="0"><span><svg></svg>10000 Dependents</span></a>
    </body>
  </html>
`;

jest.mock('child_process');
jest.mock('node-fetch');

// TODO:
// describe('Npm pacakge Tests for the real world', () => {
//   it('can be analyzed for single package', async () => {
//     await expect(analyze('react')).resolves.toMatchSnapshot();
//   });
// });

describe('Npm pacakge Tests', () => {
  it('should not read a non-existent package', async () => {
    (exec as any).mockImplementationOnce((_: any, callback: any) => {
      callback(null, { stdout: '{"error": { "code": "E404" }}' });
    });
    await expect(readNpmPackageDependencies('is-a-non-existent-package')).rejects.toEqual(
      new Error('Cannot read is-a-non-existent-package.'),
    );
  });
  it('should read a valid package', async () => {
    (exec as any).mockImplementationOnce((_: any, callback: any) => {
      callback(null, { stdout: '{ "loose-envify": "^1.1.0" }' });
    });
    await expect(readNpmPackageDependencies('react@18.3.1')).resolves.toEqual([
      { name: 'loose-envify', version: '^1.1.0' },
    ]);
  });
  it('should count the depandants of a valid package', async () => {
    (fetch as any).mockReturnValueOnce(
      Promise.resolve({
        status: 200,
        text: () => dependantsHtml,
      }),
    );
    await expect(countNpmPackageDependants('react', '18.3.1')).resolves.toEqual(10000);
  });
  it('can not count the depandants of a invalid package', async () => {
    (fetch as any).mockReturnValueOnce(
      Promise.resolve({
        status: 200,
        text: () => '',
      }),
    );
    await expect(countNpmPackageDependants('is-a-non-existent-package', '1.0.0')).rejects.toEqual(
      new Error(`Cannot count the depandants of the is-a-non-existent-package.`),
    );
  });
  it('can be analyzed for single package', async () => {
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
  it('can be analyzed for multiple packages', async () => {
    (exec as any).mockImplementation((command: string, callback: any) => {
      if (command.includes('react')) {
        callback(null, { stdout: '{ "loose-envify": "^1.1.0" }' });
      } else if (command.includes('vue')) {
        callback(null, {
          stdout: `{  "@vue/shared": "3.4.27", "@vue/compiler-dom": "3.4.27", "@vue/compiler-sfc": "3.4.27", "@vue/runtime-dom": "3.4.27", "@vue/server-renderer": "3.4.27" }`,
        });
      } else {
        callback(null, { stdout: '{}' });
      }
    });
    (fetch as any).mockReturnValue(
      Promise.resolve({
        status: 200,
        text: () => dependantsHtml,
      }),
    );
    await expect(analyze('react,vue')).resolves.toMatchSnapshot();
  });
  it('can be analyzed for multiple packages with the package version', async () => {
    (exec as any).mockImplementation((command: string, callback: any) => {
      if (command.includes('react')) {
        callback(null, {
          stdout: `{ "fbjs": "^0.8.16", "prop-types": "^15.6.0", "loose-envify": "^1.1.0", "object-assign": "^4.1.1" }`,
        });
      } else if (command.includes('vue')) {
        callback(null, {
          stdout: `{ "@vue/shared": "3.0.0", "@vue/compiler-dom": "3.0.0", "@vue/runtime-dom": "3.0.0" }`,
        });
      } else {
        callback(null, { stdout: '{}' });
      }
    });
    await expect(analyze('react@16.0.0,vue@3.0.0')).resolves.toMatchSnapshot();
  });
});
