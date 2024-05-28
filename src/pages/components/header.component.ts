import { type Locator, type Page } from '@playwright/test';

export class HeaderComponent {
  readonly page: Page;
  readonly logo: Locator;
  readonly userIcon: Locator;
  readonly logoutButton: Locator;
  readonly basketIcon: Locator;
  readonly itemsCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('.navbar .navbar-toggler');
    this.userIcon = page.locator('a#dropdownUser');
    this.logoutButton = page.locator('button.logout');
    this.basketIcon = page.locator('#dropdownBasket');
    this.itemsCount = page.locator('#basketContainer .basket-count-items');
  }

  async logOut() {
    await this.userIcon.click();
    await this.logoutButton.click();
  }

  async getItemsCount() {
    const itemsCount = await this.itemsCount.innerText();
    return Number(itemsCount);
  }
}
