import { expect, test } from '@playwright/test';

import { ExportedComponentPage, ToolboxPage } from './pages/ToolboxPage';

let toolbox: ToolboxPage;

test.beforeEach(async ({ page }) => {
  toolbox = new ToolboxPage(page);
  await toolbox.open();
});

test.afterEach(async ({ page }) => {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test('browse drawers and recover from an empty search', async ({ page }, testInfo) => {
  await toolbox.searchFor('button');
  await toolbox.toggleLid();
  await expect(toolbox.lid).toHaveAttribute('aria-expanded', 'false');
  await expect(toolbox.search).not.toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('toolbox-closed-lid.png'), fullPage: true });
  await toolbox.toggleLid();
  await expect(toolbox.lid).toHaveAttribute('aria-expanded', 'true');
  await expect(toolbox.search).toHaveValue('button');
  await toolbox.clearSearch();
  await toolbox.toggleDrawer('Inputs');
  await expect(
    toolbox.toolbox.getByRole('button', { name: 'Text input', exact: true }),
  ).not.toBeVisible();
  await toolbox.toggleDrawer('Inputs');
  await toolbox.searchFor('nothing matches');
  await expect(toolbox.page.getByText('No components found.')).toBeVisible();
  await toolbox.clearSearch();
  await toolbox.searchFor('TABLE');
  await toolbox.select('Table');
  await expect(toolbox.preview.getByRole('table', { name: 'Sample inventory' })).toBeVisible();
});

test('edit dimensions and preserve the component draft across drawers', async ({
  page,
}, testInfo) => {
  await toolbox.setLabel('Save changes');
  await toolbox.setDimensions('240', '64');
  await toolbox.setColor('Text color', '#ffffff');
  await toolbox.setColor('Background color', '#123456');
  await toolbox.setColor('Border color', '#abcdef');
  const previewButton = toolbox.preview.getByRole('button', { name: 'Save changes' });
  await expect(previewButton).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(previewButton).toHaveCSS('background-color', 'rgb(18, 52, 86)');
  await expect(previewButton).toHaveCSS('border-top-color', 'rgb(171, 205, 239)');
  await expect(toolbox.toolbox.locator('.chest-body')).toHaveCSS(
    'background-color',
    'rgb(201, 35, 43)',
  );
  await page.screenshot({ path: testInfo.outputPath('component-colors.png'), fullPage: true });
  await expect(toolbox.preview.getByRole('button', { name: 'Save changes' })).toHaveCSS(
    'width',
    '240px',
  );
  await toolbox.select('Text input');
  await expect(toolbox.colorPicker('Background color')).toHaveValue('#ffffff');
  await toolbox.preview.getByRole('textbox', { name: 'Your name' }).fill('Ada');
  await toolbox.select('Button');
  await expect(toolbox.label).toHaveValue('Save changes');
  await expect(toolbox.width).toHaveValue('240');
  await expect(toolbox.colorPicker('Background color')).toHaveValue('#123456');
  await toolbox.reset();
  await expect(toolbox.colorPicker('Text color')).toHaveValue('#000000');
  await expect(toolbox.colorPicker('Background color')).toHaveValue('#ffffff');
  await expect(toolbox.colorPicker('Border color')).toHaveValue('#000000');
});

test('reject invalid dimensions and reset the current component', async () => {
  await toolbox.setLabel('Modified');
  await toolbox.width.fill('1001');
  await expect(toolbox.page.getByRole('alert')).toContainText('24 to 1000');
  await toolbox.reset();
  await expect(toolbox.width).toHaveValue('140');
  await expect(toolbox.label).toHaveValue('Button');
  await expect(toolbox.page.getByRole('alert')).toHaveCount(0);
  await expect(toolbox.resetButton).toBeDisabled();
});

test('interact with native previews and disable a control', async () => {
  await toolbox.previewClick('Button');
  await expect(toolbox.preview.getByRole('status')).toHaveText('Clicks: 1');
  await toolbox.disabled.check();
  await expect(toolbox.preview.getByRole('button', { name: 'Button', exact: true })).toBeDisabled();
  await toolbox.select('Checkbox');
  await toolbox.preview.getByRole('checkbox', { name: 'Accept terms' }).check();
  await expect(toolbox.preview.getByRole('checkbox', { name: 'Accept terms' })).toBeChecked();
  await toolbox.select('Select');
  await toolbox.preview.getByRole('combobox').selectOption({ label: 'Option two' });
  await expect(toolbox.preview.getByRole('combobox')).toHaveValue('Option two');
});

test('use keyboard selection and inspect a narrow-screen layout', async ({ page }, testInfo) => {
  expect(await toolbox.textureLoaded()).toBe(true);
  await expect(toolbox.toolbox.locator('.chest-body')).toHaveCSS(
    'background-color',
    'rgb(201, 35, 43)',
  );
  await expect(toolbox.toolbox.locator('.drawer-tray').first()).toHaveCSS(
    'background-color',
    'rgb(17, 17, 17)',
  );
  await expect(toolbox.toolbox.locator('.drawer-handle').first()).toHaveCSS(
    'background-color',
    'rgb(198, 201, 205)',
  );
  const nameplate = toolbox.toolbox.locator('.drawer-nameplate').first();
  await expect(nameplate).toHaveCSS('background-color', 'rgb(0, 0, 0)');
  await expect(nameplate).toHaveCSS('border-top-color', 'rgb(198, 201, 205)');
  await expect(nameplate).toHaveCSS('color', 'rgb(198, 201, 205)');
  await expect(nameplate).toHaveCSS('text-transform', 'uppercase');
  await expect(nameplate).toHaveCSS('box-shadow', 'rgb(0, 0, 0) 0px 0px 0px 2px');
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() =>
      Array.from(document.fonts).some(
        (font) => font.family === 'Saira Stencil One' && font.status === 'loaded',
      ),
    ),
  ).toBe(true);
  expect(
    await toolbox.lid.evaluate((element) => getComputedStyle(element, '::before').backgroundColor),
  ).toBe('rgb(17, 17, 17)');
  await page.setViewportSize({ width: 390, height: 844 });
  const button = toolbox.toolbox.getByRole('button', { name: 'Text input', exact: true });
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(toolbox.preview.getByRole('textbox', { name: 'Your name' })).toBeVisible();
  await toolbox.setLabel('Full name');
  await toolbox.setColor('Text color', '#ffffff');
  await toolbox.setColor('Background color', '#123456');
  await expect(toolbox.preview.getByRole('textbox', { name: 'Full name' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: testInfo.outputPath('toolbox-mobile.png'), fullPage: true });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: testInfo.outputPath('toolbox-desktop.png'), fullPage: true });
});

test('copy standalone component code and recover from unavailable clipboard', async ({
  page,
  context,
}, testInfo) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await toolbox.setLabel('Export & reuse');
  await toolbox.setDimensions('240', '64');
  await toolbox.setColor('Text color', '#ffffff');
  await toolbox.setColor('Background color', '#123456');
  await toolbox.setColor('Border color', '#abcdef');
  const html = await toolbox.code('HTML').inputValue();
  await toolbox.copyExport('HTML');
  await expect(toolbox.exportSection.getByRole('status')).toHaveText('HTML copied.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(html);
  await toolbox.chooseExport('CSS');
  const css = await toolbox.code('CSS').inputValue();
  await toolbox.copyExport('CSS');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(css);
  await toolbox.chooseExport('JavaScript');
  const javascript = await toolbox.code('JavaScript').inputValue();
  await toolbox.copyExport('JavaScript');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(javascript);
  const fixturePage = await context.newPage();
  try {
    const fixture = new ExportedComponentPage(fixturePage);
    await fixture.render({ html, css, javascript });
    await expect(fixture.button).toHaveText('Export & reuse');
    await expect(fixture.button).toHaveCSS('width', '240px');
    await expect(fixture.button).toHaveCSS('background-color', 'rgb(18, 52, 86)');
    await expect(fixture.button).toHaveCSS('color', 'rgb(255, 255, 255)');
    await expect(fixture.button).toHaveCSS('border-top-color', 'rgb(171, 205, 239)');
    await fixture.clickButton();
    await expect(fixture.status).toHaveText('Clicks: 1');
  } finally {
    await fixturePage.close();
  }
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }),
  );
  await toolbox.copyExport('JavaScript');
  await expect(toolbox.exportSection.getByRole('alert')).toContainText(
    'Code selected for manual copying',
  );
  await expect(toolbox.code('JavaScript')).toBeFocused();
  expect(
    await toolbox.code('JavaScript').evaluate((element) => {
      const textarea = element as HTMLTextAreaElement;
      return textarea.selectionEnd - textarea.selectionStart;
    }),
  ).toBe(javascript.length);
  await page.screenshot({
    path: testInfo.outputPath('worktable-export-desktop.png'),
    fullPage: true,
  });
});
