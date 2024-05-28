import BasePage from './basepage';
import { type Page } from '@playwright/test';

export class BasketPage extends BasePage {
  url = 'basket';

  constructor(page: Page) {
    super(page);
  }
}
