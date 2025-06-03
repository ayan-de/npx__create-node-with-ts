#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompts_1 = __importDefault(require("prompts"));
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const log = {
    info: (msg) => console.log(chalk_1.default.blue(msg)),
    success: (msg) => console.log(chalk_1.default.green(msg)),
    warn: (msg) => console.log(chalk_1.default.yellow(msg)),
    error: (msg) => console.log(chalk_1.default.red(msg)),
};
const writeJSON = (file, data) => fs_1.default.writeFileSync(file, JSON.stringify(data, null, 2));
(async () => {
    log.info('Welcome to Node.js + TypeScript project setup');
    const { root, main, useDist, useNodemon } = await (0, prompts_1.default)([
        { type: 'text', name: 'root', message: 'Root folder (e.g., src)', initial: 'src' },
        { type: 'text', name: 'main', message: 'Main file name', initial: 'index.ts' },
        { type: 'confirm', name: 'useDist', message: 'Use dist folder for compiled JS?', initial: true },
        { type: 'confirm', name: 'useNodemon', message: 'Enable nodemon auto-reload?', initial: true }
    ]);
    (0, child_process_1.execSync)(`mkdir -p ${root}`);
    fs_1.default.writeFileSync(`${root}/${main}`, `console.log('Hello from ${main}');\n`);
    log.success(`Created ${root}/${main}`);
    log.info('Initializing project...');
    (0, child_process_1.execSync)(`npm init -y`);
    (0, child_process_1.execSync)(`npm install --save-dev typescript ts-node @types/node`);
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
    const pkg = JSON.parse(fs_1.default.readFileSync('package.json', 'utf-8'));
    pkg.main = useDist ? `dist/${main.replace('.ts', '.js')}` : `${root}/${main}`;
    pkg.scripts = {
        start: useDist
            ? `tsc && node dist/${main.replace('.ts', '.js')}`
            : `ts-node ${root}/${main}`
    };
    fs_1.default.writeFileSync('.gitignore', 'node_modules\n');
    if (useNodemon) {
        (0, child_process_1.execSync)(`npm install --save-dev nodemon`);
        fs_1.default.writeFileSync('nodemon.json', JSON.stringify({
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
    console.log(`Run ${chalk_1.default.cyan(`'${useNodemon ? 'npm run dev' : 'npm start'}'`)} to begin`);
})();
