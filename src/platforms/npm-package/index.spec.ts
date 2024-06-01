/**
 * This is a sample test suite.
 * Replace this with your implementation.
 */
import { readNpmPackageDependencies, analyze } from './index';

describe('Npm pacakge Tests', () => {
  it('should not read a non-existent package', async () => {
    await expect(readNpmPackageDependencies('is-a-non-existent-package')).rejects.toEqual(
      new Error('Cannot read is-a-non-existent-package.'),
    );
  });
  it('should read a valid package', async () => {
    await expect(readNpmPackageDependencies('react@18.3.1')).resolves.toEqual([
      { name: 'loose-envify', version: '^1.1.0' },
    ]);
  });
  it('can analyze for single package', async () => {
    await expect(analyze('react')).resolves.toMatchSnapshot();
  });
  it('can analyze for multiple packages', async () => {
    await expect(analyze('react,vue')).resolves.toMatchSnapshot();
  });
  it('can analyze for multiple packages with the package version', async () => {
    await expect(analyze('react@16.0.0,vue@3.0.0')).resolves.toMatchSnapshot();
  });
});
