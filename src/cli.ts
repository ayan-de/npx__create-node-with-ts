#!/usr/bin/env node

import prompts from 'prompts';
import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

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

  const { root, main, useDist, useNodemon ,hoverSupport } = await prompts([
    { type: 'text', name: 'root', message: 'Root folder (e.g., src)', initial: 'src' },
    { type: 'text', name: 'main', message: 'Main file name', initial: 'index.ts' },
    { type: 'confirm', name: 'useDist', message: 'Use dist folder for compiled JS?', initial: true },
    { type: 'confirm', name: 'useNodemon', message: 'Enable nodemon auto-reload?', initial: true },
    { type: 'confirm', name: 'hoverSupport', message: 'Enable Support for hover-explainer extension?', initial: true }

  ]);

  // execSync(`mkdir -p ${root}`);
  fs.mkdirSync(root, { recursive: true });
  if (useDist) {
  // execSync('mkdir -p dist');
  fs.mkdirSync('dist', { recursive: true });
  log.success('Created dist folder');
}
  fs.writeFileSync(`${root}/${main}`, `console.log('Hello from ${main}');\n`);
  log.success(`Created ${root}/${main}`);

  log.info('Initializing project...');
  execSync(`npm init -y`);
  execSync(`npm install --save-dev typescript ts-node @types/node`);
  log.success('Installed required dependencies');

  const tsconfig = {
    compilerOptions: {
      target: "esnext",
      module: "commonjs",
      strict: true,
      rootDir: root,
      ...(useDist ? { outDir: "dist" } : {}),
      esModuleInterop: true,
      skipLibCheck: true
    },
    include: [root],
    exclude: ["node_modules", ...(useDist ? ["dist"] : [])]
  };
  writeJSON('tsconfig.json', tsconfig);
  log.success('Created tsconfig.json');

  // Modify package.json
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  pkg.main = useDist ? `dist/${main.replace('.ts', '.js')}` : `${root}/${main}`;
  pkg.scripts = {
    start: useDist
      ? `tsc && node dist/${main.replace('.ts', '.js')}`
      : `ts-node ${root}/${main}`,
    build: `tsc`
  };

fs.writeFileSync('.gitignore', 'node_modules\n');

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

if (hoverSupport) {
  log.info(`Making hover-explainer support...`);

  const fileDescriptions: Record<string, string> = {
    "src": "This is the source code file.",
    "src/index.ts": "This is the main file of your project.",
    ".gitignore": "This file is used to ignore files and folders during git operations.",
    "tsconfig.json": "This file is used to configure the TypeScript compiler.",
    "package.json": "This file is used to configure the Node.js project."
  };

  if (useDist) {
    fileDescriptions["dist"] = "This folder is used to store compiled JavaScript files.";
  }

  if (useNodemon) {
    fileDescriptions["nodemon.json"] = "This file is used to configure the nodemon process.";
  }

  fs.writeFileSync('.fileDescriptions.json', JSON.stringify(fileDescriptions, null, 2));

  fs.writeFileSync('.fileignore', "node_modules\n.git/\ndist/\n");

  log.success('hover-explainer configured. Refresh your editor to see the changes.');
  log.warn(`hover-explainer will work only if you have the hover-explainer extension installed.`);
}

  log.success('Setup complete!');
  log.info('Building...');
  execSync(`npm run build`);
  log.success(`Build complete`);
  console.log(`TO build run ${chalk.cyan(`npm run build`)} `);
  console.log(`Run ${chalk.cyan(`'${useNodemon ? 'npm run dev' : 'npm start'}'`)} to begin`);
})();
