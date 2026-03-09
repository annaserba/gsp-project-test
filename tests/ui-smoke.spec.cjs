const { test, expect } = require('@playwright/test');


test('dashboard webserver smoke', async ({ request, baseURL }) => {
  const response = await request.get(baseURL ?? 'http://127.0.0.1:5173');
  const html = await response.text();

  expect(response.ok()).toBeTruthy();
  expect(html).toContain('<div id="root"></div>');
  expect(html).toContain('/src/main.tsx');
});
