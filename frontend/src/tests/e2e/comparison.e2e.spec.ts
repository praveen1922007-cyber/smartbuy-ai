import { test, expect } from '@playwright/test';

test('comparison page loads and shows heading', async ({ page }) => {
  await page.goto('/comparison');
  await expect(page.getByRole('heading', { name: /Price & store comparison/i })).toBeVisible();
});

test('ingest marketplace and verify history', async ({ page, request }) => {
  // go to page and perform ingest via API to backend
  await page.goto('/comparison');

  // call ingest endpoint directly via Playwright request to persist mock data
  const ingestRes = await request.post('/api/marketplace/ingest', { data: { barcode: 'TEST-INGEST' } });
  expect(ingestRes.ok()).toBeTruthy();

  // wait briefly for backend persistence
  await page.waitForTimeout(800);

  // fetch history via API
  const histRes = await request.get('/api/marketplace/history', { params: { barcode: 'TEST-INGEST' } });
  expect(histRes.ok()).toBeTruthy();
  const body = await histRes.json();
  expect(Array.isArray(body.items)).toBeTruthy();
  // at least one vendorProduct persisted
  expect(body.items.length).toBeGreaterThanOrEqual(1);
});
