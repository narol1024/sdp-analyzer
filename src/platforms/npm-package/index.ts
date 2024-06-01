import { exec } from 'child_process';
import nodeFetch from 'node-fetch';
import { promisify } from 'util';
import { load as cheerioLoad } from 'cheerio';
import type { Dep, NpmDependency } from '../../types';
import { evaluate } from '../../core';
import { getStablityLabel } from '../../utils/label';

const execAsync = promisify(exec);

// To read the dependencies of a npm package
export async function readNpmPackageDependencies(packageName: string): Promise<NpmDependency[]> {
  let readNpmPackageDependenciesTimeId: NodeJS.Timeout;
  let retriedTimes = 0;
  return new Promise((resolve, reject) => {
    // Relying on remote network is unstable possibly, it is necessary to use a task for retries.
    async function doReadTask(): Promise<void> {
      const timeoutPromise = new Promise<void>((_, timeoutReject) => {
        readNpmPackageDependenciesTimeId = setTimeout(() => timeoutReject(new Error('Operation timed out')), 5000);
      });
      const npmViewPromise = execAsync(`npm view ${packageName} dependencies --json`).then(result => {
        try {
          const resultJson = JSON.parse(result.stdout) as any;
          if (!!resultJson.error) {
            reject(new Error(`Cannot read ${packageName}.`));
          }
          resolve(
            Object.entries(resultJson as NpmDependency).map(([name, version]) => ({
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
      Promise.race([npmViewPromise, timeoutPromise])
        .catch(async error => {
          if (error.message === 'Operation timed out' && retriedTimes < 100) {
            retriedTimes += 1;
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
  let retriedTimes = 0;

  return new Promise((resolve, reject) => {
    // Relying on remote network is unstable possibly, it is necessary to use a task for retries.
    async function doCountTask(): Promise<void> {
      const path = version !== null ? `${packageName}/v/${version}` : packageName;
      const url = `https://www.npmjs.com/package/${path}?activeTab=dependents&t=${Date.now()}`;
      const timeoutPromise = new Promise<void>((_, timeoutReject) => {
        countNpmPackageDependantsTimeId = setTimeout(() => timeoutReject(new Error('Operation timed out')), 20000);
      });
      const fetchPromise = async (): Promise<void> => {
        try {
          const res = await nodeFetch(url);
          const html = await res.text();
          const $ = cheerioLoad(html);
          const htmlStr = $('#package-tab-dependents span').html();
          const match = htmlStr?.match(/(?<=<\/svg>\s*)(\S+)(?=\s*Dependents)/)?.[0];
          if (match) {
            resolve(parseInt(match.replace(/,/g, ''), 10));
          } else {
            return Promise.reject(new Error(`Operation failed`));
          }
        } catch (error) {
          return Promise.reject(new Error(`Operation failed`));
        } finally {
          clearTimeout(countNpmPackageDependantsTimeId);
        }
      };
      Promise.race([fetchPromise(), timeoutPromise])
        .catch(async error => {
          if ((error.message === 'Operation timed out' || error.message === 'Operation failed') && retriedTimes < 100) {
            retriedTimes += 1;
            doCountTask();
          } else {
            reject(new Error(`Cannot count the depandants of the ${packageName}.`));
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
    const normalizedPackageNames = packageNames.split(',');
    const depsPromises = normalizedPackageNames.map(async packageName => {
      let version = null;
      if (packageName.includes('@')) {
        [packageName, version] = packageName.split('@').map(part => part.trim());
      }
      const [dependencies, dependants] = await Promise.all([
        readNpmPackageDependencies(packageName),
        countNpmPackageDependants(packageName, version),
      ]);
      const fanOut = dependencies.length;
      const stability = fanOut === 0 ? 0 : evaluate(fanOut, dependants);
      return {
        name: packageName,
        fanIn: dependants,
        fanOut,
        stability,
        label: getStablityLabel(stability),
      };
    });

    const deps = await Promise.all(depsPromises);
    return Promise.resolve(deps);
  } catch (error: any) {
    return Promise.reject(new Error(`Cannot analyze ${packageNames}, the reason is \"${error.message}\"`));
  }
}
