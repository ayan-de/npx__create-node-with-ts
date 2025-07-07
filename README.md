# Node.js + TypeScript Project Setup CLI

A small interactive CLI to scaffold a Node.js + TypeScript backend project with optional `dist/`, `nodemon`, and [hover-explainer](https://marketplace.visualstudio.com/items?itemName=ayande.hover-explainer) [RECOMMENDED] support.

## 🚀 Features

- TypeScript + ts-node support
- Optional `dist/` folder for compiled JS
- Nodemon-based dev server
- Generates `tsconfig.json`, `.gitignore`, and optional `.fileDescriptions.json` for hover support
- CLI-driven setup using `prompts`

## 🛠️ Requirements

- Node.js >= 14
- `ts-node` (installed automatically)

## 📦 Usage

1. Clone or copy this script.
2. Run:

```bash
npx create-node-with-ts
```

3. Answer the prompts:

Root folder name

Main entry file

Use dist/ for compiled output?

Enable nodemon?

Enable hover-explainer support?

```bash
npm run build     # Build the project
npm start         # Run it
npm run dev       # If nodemon enabled
```

4.Folder Structure

```bash
my-app/
├── src/
│   └── index.ts
├── dist/          # optional
├── package.json
├── tsconfig.json
├── .gitignore
├── nodemon.json   # optional
└── .fileDescriptions.json  # optional
```

```bash
License
---

Let me know if you want me to:
- convert the script into a CLI with `commander` or `yargs`
- generate `.d.ts` support
- publish it as an npm CLI (`npx create-node-ts`)
- add unit tests or linting configs

```