import fs from 'fs';
import path from 'path';
import util from 'util';
import { exec } from 'child_process';

export const getName = async (name?: string) => {
  if (typeof name === 'string') {
    return name;
  }

  try {
    fs.statSync(path.resolve(process.cwd(), '.git'));
  } catch (error) {
    throw new Error(`No name provided, and no git repository found in cwd.`);
  }

  const { stdout, stderr } = await util.promisify(exec)('git symbolic-ref --short HEAD');

  if (stderr) {
    throw new Error(stderr);
  }

  return stdout.trim().replace(/\W+/g, '_');
};
