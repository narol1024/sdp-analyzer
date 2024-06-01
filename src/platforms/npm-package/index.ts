import { exec } from 'child_process';
import nodeFetch from 'node-fetch';
import { promisify } from 'util';
import { load as cheerioLoad } from 'cheerio';
import type { Dep, NpmDependency } from '../../types';
import { evaluate } from '../../core';
import { getStablityLabel } from '../../utils/label';
import { timeout } from '../../utils/timeout';

const execAsync = promisify(exec);

// To read the dependencies of a npm package
export async function readNpmPackageDependencies(packageName: string): Promise<NpmDependency[]> {
  let readNpmPackageDependenciesTimeId: NodeJS.Timeout;
  let retryTimes = 0;
  return new Promise((resolve, reject) => {
    // Relying on remote network is unstable possibly, it is necessary to use a task for retries.
    async function doReadTask(): Promise<void> {
      const npmViewPromise = execAsync(`npm view ${packageName} dependencies --json`).then(result => {
        try {
          const dependencies = JSON.parse(result.stdout) as NpmDependency;
          resolve(
            Object.entries(dependencies).map(([name, version]) => ({
              name,
              version,
            })),
          );
        } catch (error) {
          reject(new Error(`Cannot read ${packageName}.`));
        } finally {
          clearTimeout(readNpmPackageDependenciesTimeId);
        }
      });
      Promise.race([npmViewPromise, timeout(10000, readNpmPackageDependenciesTimeId)])
        .catch(async error => {
          if (error.message === 'Operation timed out' && retryTimes < 3) {
            retryTimes += 1;
            doReadTask();
          } else {
            reject(new Error(`Cannot read ${packageName}.`));
          }
        })
        .finally(() => {
          clearTimeout(readNpmPackageDependenciesTimeId);
        });
    }
    doReadTask();
  });
}

// Count the dependants of a npm package
export async function countNpmPackageDependants(packageName: string, version: string | null): Promise<number> {
  let countNpmPackageDependantsTimeId: NodeJS.Timeout;
  let retryTimes = 0;

  return new Promise((resolve, reject) => {
    // Relying on remote network is unstable possibly, it is necessary to use a task for retries.
    async function doCountTask(): Promise<void> {
      const path = version !== null ? `${packageName}/v/${version}` : packageName;
      const url = `https://www.npmjs.com/package/${path}?activeTab=dependents&t=${Date.now()}`;
      const fetchPromise = async (): Promise<void> => {
        try {
          const res = await nodeFetch(url);
          const html = await res.text();
          const $ = cheerioLoad(html);
          const htmlStr = $('#package-tab-dependents span').html();
          const match = htmlStr?.match(/(?<=<\/svg>\s*)(\S+)(?=\s*Dependents)/)?.[0];
          if (match) {
            // As the dependant of an npm package is dynamic, it is necessary to mock a number when testing.
            if (typeof __JEST_TEST_ENV__ !== 'undefined' && __JEST_TEST_ENV__) {
              resolve(10000);
            } else {
              resolve(parseInt(match.replace(/,/g, ''), 10));
            }
          } else {
            return Promise.reject(new Error(`Operation failed`));
          }
        } catch (error) {
          return Promise.reject(new Error(`Operation failed`));
        } finally {
          clearTimeout(countNpmPackageDependantsTimeId);
        }
      };
      Promise.race([fetchPromise(), timeout(10000, countNpmPackageDependantsTimeId)])
        .catch(async error => {
          if ((error.message === 'Operation timed out' || error.message === 'Operation failed') && retryTimes < 5) {
            retryTimes += 1;
            doCountTask();
          } else {
            reject(new Error(`Cannot read ${packageName}.`));
          }
        })
        .finally(() => {
          clearTimeout(countNpmPackageDependantsTimeId);
        });
    }
    doCountTask();
  });
}

// To analyze one or multiple packages on the npm repository, like react, vue, express, etc.
export async function analyze(packageNames: string): Promise<Dep[]> {
  try {
    // default to npm package
    const normalizedPackageNames = packageNames.split(',');
    const deps: Dep[] = [];
    for (let packageName of normalizedPackageNames) {
      let version = null;
      if (packageName.includes('@')) {
        const _arr = packageName.split('@');
        packageName = _arr[0].trim();
        version = _arr[1];
      }
      const [dependencies, dependants] = await Promise.all([
        readNpmPackageDependencies(packageName),
        countNpmPackageDependants(packageName, version),
      ]);
      const _dep = {
        name: packageName,
        fanIn: dependants,
        fanOut: dependencies.length,
      };
      const stability = _dep.fanOut === 0 ? 0 : evaluate(_dep.fanOut, _dep.fanIn);
      const dep = {
        ..._dep,
        stability,
        label: getStablityLabel(stability),
      };
      deps.push(dep);
    }
    return Promise.resolve(deps);
  } catch (error) {
    return Promise.reject(new Error(`Cannot analyze ${packageNames}`));
  }
}
