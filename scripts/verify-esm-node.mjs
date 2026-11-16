#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const entry = path.join(repoRoot, 'dist/esm/index.js');

const requiredExports = [
  'ApplePayEventsEnum',
  'GooglePayEventsEnum',
  'PaymentFlowEventsEnum',
  'PaymentSheetEventsEnum',
  'Stripe',
];

const mod = await import(pathToFileURL(entry).href);

for (const name of requiredExports) {
  if (!(name in mod)) {
    console.error(`Missing export: ${name}`);
    process.exit(1);
  }
}

console.log('OK: dist/esm/index.js loads in Node ESM');