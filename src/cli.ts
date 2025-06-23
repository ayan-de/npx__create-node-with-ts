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
  if (useDist) {
  execSync('mkdir -p dist');
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

  log.success('Setup complete!');
  log.info('Building...');
  execSync(`npm run build`);
  log.success(`Build complete`);
  console.log(`TO build run ${chalk.cyan(`npm run build`)} `);
  console.log(`Run ${chalk.cyan(`'${useNodemon ? 'npm run dev' : 'npm start'}'`)} to begin`);
})();
