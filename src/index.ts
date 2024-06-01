import { isLocalPath } from './utils/checkLocalPath';

import { analyze as analyzeNpmPackage } from './platforms/npm-package';
import { analyze as analyzeYarnWorkspaces } from './platforms/workspaces/yarn';

export function analyze(target: string) {
  if (isLocalPath(target)) {
    // default to yarn workspaces
    return analyzeYarnWorkspaces(target);
  }
  return analyzeNpmPackage(target);
}
