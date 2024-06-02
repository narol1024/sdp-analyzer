import path from 'path';
import fg from 'fast-glob';
import jsonfile from 'jsonfile';
import { evaluate } from '../../../core';
import { getStablityLabel } from '../../../utils/label';

// To read the dependencies of a package using workspaces.
export function readWorkspacesDependencies(packagePath: string) {
  const packageJsonPath = path.resolve(path.join(packagePath, 'package.json'));
  try {
    const rootPackageJson = jsonfile.readFileSync(packageJsonPath);
    const workspaces = rootPackageJson.workspaces as string[];
    if (workspaces === undefined || workspaces.length === 0) {
      return [];
    }
    const dependencyMap = fg
      .sync(
        workspaces.map(v => `${v}/*.json`),
        { cwd: packagePath },
      )
      .map(subpackage => {
        const subPackageJson = path.resolve(packagePath, subpackage);
        const json = jsonfile.readFileSync(subPackageJson);
        const { name } = json;
        return {
          name,
          dependencies: json.dependencies || {},
        };
      });
    return dependencyMap;
  } catch (error) {
    throw new Error(`Cannot find package.json on ${packagePath}.`);
  }
}

// To analyze workspaces using Yarn package manager, such as ./my-yarn-workspaces-project
export async function analyze(packagePath: string) {
  try {
    const dependencyMap = readWorkspacesDependencies(packagePath);
    if (dependencyMap.length === 0) {
      return Promise.reject(
        new Error(
          "It seems that the 'subpackages' directory has not been found, please check the configuration of yarn workspaces..",
        ),
      );
    }
    const deps = dependencyMap.map(v => {
      return {
        name: v.name,
        fanIn: 1,
        fanOut: v.dependencies ? Object.keys(v.dependencies).length : 0,
      };
    });
    return Promise.resolve(
      deps.map(dep => {
        const stablility = evaluate(dep.fanOut, dep.fanIn);
        return {
          ...dep,
          instable: stablility,
          label: getStablityLabel(stablility),
        };
      }),
    );
  } catch (error) {
    return Promise.reject(new Error(`Cannot analyze ${packagePath}`));
  }
}
