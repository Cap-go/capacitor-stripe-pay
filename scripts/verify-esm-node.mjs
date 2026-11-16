#!/usr/bin/env node
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const esmDir = path.join(repoRoot, 'dist/esm');

const relativeSpecifier =
  /(?:from\s*|import\s*\(\s*|import\s+)['"](\.{1,2}\/[^'"]*)['"]/g;

const bad = [];
for (const entry of readdirSync(esmDir, { recursive: true })) {
  const relativePath = typeof entry === 'string' ? entry : entry.name;
  if (!relativePath.endsWith('.js')) {
    continue;
  }
  const filePath = path.join(esmDir, relativePath);
  const source = readFileSync(filePath, 'utf8');
  for (const match of source.matchAll(relativeSpecifier)) {
    if (!match[1].endsWith('.js')) {
      bad.push(`${relativePath}: ${match[1]}`);
    }
  }
}

if (bad.length) {
  console.error(`Extensionless relative imports in dist/esm:\n  ${bad.join('\n  ')}`);
  process.exit(1);
}

const indexMod = await import(pathToFileURL(path.join(esmDir, 'index.js')).href);

for (const name of [
  'ApplePayEventsEnum',
  'GooglePayEventsEnum',
  'PaymentFlowEventsEnum',
  'PaymentSheetEventsEnum',
  'Stripe',
]) {
  if (!(name in indexMod)) {
    console.error(`Missing export: ${name}`);
    process.exit(1);
  }
}

const webMod = await import(pathToFileURL(path.join(esmDir, 'web.js')).href);
if (typeof webMod.StripeWeb !== 'function') {
  console.error('Missing export: StripeWeb');
  process.exit(1);
}

console.log('OK: dist/esm loads in Node ESM');