import type { Page } from '@playwright/test';

import type { ComponentCode } from '../../../packages/frontend/src/export-component';

export class ToolboxPage {
  constructor(readonly page: Page) {}

  get toolbox() {
    return this.page.getByRole('complementary', { name: 'Toolbox' });
  }
  get search() {
    return this.page.getByRole('searchbox');
  }
  get lid() {
    return this.toolbox.getByRole('button', { name: /^(Open|Close) toolbox lid$/ });
  }
  get preview() {
    return this.page.getByRole('region', { name: /^Preview:/ });
  }
  get label() {
    return this.page.getByLabel('Label', { exact: true });
  }
  get width() {
    return this.page.getByLabel('Width (px)', { exact: true });
  }
  get height() {
    return this.page.getByLabel('Height (px)', { exact: true });
  }
  get disabled() {
    return this.page.getByLabel('Disabled', { exact: true });
  }
  get resetButton() {
    return this.page.getByRole('button', { name: 'Reset component' });
  }
  get inspector() {
    return this.page.getByRole('complementary', { name: 'Inspector' });
  }
  get exportSection() {
    return this.page.getByRole('region', { name: 'Component code' });
  }
  code(language: string) {
    return this.exportSection.getByLabel(`${language} code`, { exact: true });
  }
  async chooseExport(language: string) {
    await this.exportSection.getByRole('tab', { name: language, exact: true }).click();
  }
  async copyExport(language: string) {
    await this.exportSection.getByRole('button', { name: `Copy ${language}`, exact: true }).click();
  }
  async textureLoaded() {
    return this.inspector.evaluate(async (element) => {
      const url = getComputedStyle(element).backgroundImage.match(/url\("([^"]+)"\)/)?.[1];
      if (!url) return false;
      const image = new Image();
      image.src = url;
      await image.decode();
      return image.naturalWidth > 0;
    });
  }

  async open() {
    await this.page.goto('/');
  }
  async select(name: string) {
    await this.toolbox.getByRole('button', { name, exact: true }).click();
  }
  async searchFor(query: string) {
    await this.search.fill(query);
  }
  async clearSearch() {
    await this.page.getByRole('button', { name: 'Clear search' }).click();
  }
  async setLabel(label: string) {
    await this.label.fill(label);
  }
  async setDimensions(width: string, height: string) {
    await this.width.fill(width);
    await this.height.fill(height);
  }
  colorPicker(label: string) {
    return this.page.getByLabel(label, { exact: true });
  }
  async setColor(label: string, color: string) {
    await this.colorPicker(label).evaluate((element, value) => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      if (!setter) throw new Error('Native input value setter is unavailable.');
      setter.call(element, value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, color);
  }
  async toggleDrawer(name: string) {
    await this.toolbox.locator('summary').filter({ hasText: name }).click();
  }
  async toggleLid() {
    await this.lid.click();
  }
  async reset() {
    await this.resetButton.click();
  }
  async previewClick(name: string) {
    await this.preview.getByRole('button', { name, exact: true }).click();
  }
}

export class ExportedComponentPage {
  constructor(readonly page: Page) {}

  get button() {
    return this.page.getByRole('button');
  }
  get status() {
    return this.page.getByRole('status');
  }

  async render(code: ComponentCode) {
    await this.page.setContent(code.html);
    await this.page.addStyleTag({ content: code.css });
    await this.page.addScriptTag({ content: code.javascript });
  }
  async clickButton() {
    await this.button.click();
  }
}
