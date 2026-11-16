#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const entry = path.join(repoRoot, 'dist/esm/index.js');

await import(pathToFileURL(entry).href);
console.log('OK: dist/esm/index.js loads in Node ESM');