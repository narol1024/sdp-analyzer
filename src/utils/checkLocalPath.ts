import path from 'path';
import fs from 'fs';

export function isLocalPath(target: string) {
  const absolutePath = path.resolve(target);
  try {
    fs.statSync(absolutePath);
    return true;
  } catch (error) {
    return false;
  }
}
