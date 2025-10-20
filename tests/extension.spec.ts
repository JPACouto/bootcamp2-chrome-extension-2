import { test, expect, chromium } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Define __dirname para o contexto de Módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dist = path.resolve(__dirname, '..', 'dist');

test('popup ou content script carrega e mostra comportamento mínimo', async () => {
  const context = await chromium.launchPersistentContext('', {
    headless: true,
    args: [
      `--disable-extensions-except=${dist}`,
      `--load-extension=${dist}`
    ]
  });
  const [page] = context.pages();
  await page.goto('https://example.com');
  const hasAnchor = await page.$('a');
  expect(hasAnchor).toBeTruthy();
  await context.close();
});

