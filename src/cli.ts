#!/usr/bin/env node

import prompts from 'prompts';
import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs';

const log = {
  info: (msg: string) => console.log(chalk.blue(msg)),
  success: (msg: string) => console.log(chalk.green(msg)),
  warn: (msg: string) => console.log(chalk.yellow(msg)),
  error: (msg: string) => console.log(chalk.red(msg)),
};

const writeJSON = (file: string, data: object) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

(async () => {
  log.info('Welcome to Node.js + TypeScript project setup');

  const { root, main, useDist, useNodemon } = await prompts([
    { type: 'text', name: 'root', message: 'Root folder (e.g., src)', initial: 'src' },
    { type: 'text', name: 'main', message: 'Main file name', initial: 'index.ts' },
    { type: 'confirm', name: 'useDist', message: 'Use dist folder for compiled JS?', initial: true },
    { type: 'confirm', name: 'useNodemon', message: 'Enable nodemon auto-reload?', initial: true }
  ]);

  execSync(`mkdir -p ${root}`);
  fs.writeFileSync(`${root}/${main}`, `console.log('Hello from ${main}');\n`);
  log.success(`Created ${root}/${main}`);

  log.info('Initializing project...');
  execSync(`npm init -y`);
  execSync(`npm install --save-dev typescript ts-node @types/node`);
  log.success('Installed required dependencies');

  execSync(`npx tsc --init`);
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf-8'));
  tsconfig.compilerOptions.rootDir = root;
  if (useDist) tsconfig.compilerOptions.outDir = "dist";
  writeJSON('tsconfig.json', tsconfig);
  log.success('tsconfig.json updated');

  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  pkg.main = useDist ? `dist/${main.replace('.ts', '.js')}` : `${root}/${main}`;
  pkg.scripts = {
    start: useDist
      ? `tsc && node dist/${main.replace('.ts', '.js')}`
      : `ts-node ${root}/${main}`
  };

  if (useNodemon) {
    execSync(`npm install --save-dev nodemon`);
    fs.writeFileSync('nodemon.json', JSON.stringify({
      watch: [root],
      ext: "ts",
      ignore: ["dist"],
      exec: `ts-node ${root}/${main}`
    }, null, 2));
    pkg.scripts.dev = "nodemon";
    log.success('Nodemon configured');
  }

  writeJSON('package.json', pkg);

  log.success('Setup complete!');
  console.log(`Run ${chalk.cyan(`'${useNodemon ? 'npm run dev' : 'npm start'}'`)} to begin`);
})();
