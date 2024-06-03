/**
 * This is a sample test suite.
 * Replace this with your implementation.
 */
import { readNpmPackageDependencies, countNpmPackageDependants, analyze } from './index';

describe('Npm package tests', () => {
  it('should not read a non-existent package', async () => {
    await expect(readNpmPackageDependencies('is-a-non-existent-package')).rejects.toEqual(
      new Error('Cannot read is-a-non-existent-package.'),
    );
  });
  it('should read a valid package', async () => {
    await expect(readNpmPackageDependencies('react@16.0.0')).resolves.toEqual([
      { name: 'fbjs', version: '^0.8.16' },
      { name: 'prop-types', version: '^15.6.0' },
      { name: 'loose-envify', version: '^1.1.0' },
      { name: 'object-assign', version: '^4.1.1' },
    ]);
  });
  it('should count the depandants of a valid package', async () => {
    await expect(countNpmPackageDependants('react', '16.0.0')).resolves.toEqual(10000);
  });
  it('can not count the depandants of a invalid package', async () => {
    await expect(countNpmPackageDependants('is-a-non-existent-package', '1.0.0')).rejects.toEqual(
      new Error(`Cannot count the depandants of the is-a-non-existent-package.`),
    );
  });
  it('can be analyzed for a invalid package', async () => {
    await expect(analyze('is-a-non-existent-package')).rejects.toEqual(
      new Error(`Cannot analyze is-a-non-existent-package, the reason is "Cannot read is-a-non-existent-package."`),
    );
  });
  it('can be analyzed for single package', async () => {
    await expect(analyze('react')).resolves.toMatchSnapshot();
  });
  it('can be analyzed for multiple packages', async () => {
    await expect(analyze('react,vue')).resolves.toMatchSnapshot();
  });
  it('can be analyzed for a zero dependency library', async () => {
    await expect(analyze('lodash@5.0.0')).resolves.toMatchSnapshot();
  });
  it('can be analyzed for multiple packages with the package version', async () => {
    await expect(analyze('react@16.0.0,vue@3.0.0')).resolves.toMatchSnapshot();
  });
});
