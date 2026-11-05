// Prettier configuration shared by the editor, the format scripts and the Stop hook.
// Plain JS because Prettier loads its config with Node, which has no TypeScript support on Node 22.14.

/** @type {import('prettier').Config} */
const config = {
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/app/styles/globals.css',
};

export default config;
