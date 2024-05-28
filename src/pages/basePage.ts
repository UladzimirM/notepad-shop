import { type Page } from '@playwright/test';
import defineConfig from '../../playwright.config';

export default abstract class BasePage {
  readonly page: Page;
  readonly url: string;

  constructor(page: Page) {
    this.page = page;
  }

  async open() {
    await this.page.goto(`${defineConfig.use?.baseURL}${this.url}`);
  }

  getFullUrl() {
    return `${defineConfig.use?.baseURL}${this.url}`;
  }
}
