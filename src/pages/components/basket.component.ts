import { type Locator, type Page } from '@playwright/test';
import { itemData } from '../../data/interfaces';

export class BasketComponent {
  readonly clearButton: Locator;
  readonly navigateToBasketPage: Locator;
  readonly itemsList: Locator;
  readonly basketForm: Locator;

  constructor(page: Page) {
    this.navigateToBasketPage = page.locator('a[href*="basket"]');
    this.clearButton = page.locator('.actionClearBasket a');
    this.itemsList = page.locator('#basketContainer li');
    this.basketForm = page.locator('#basketContainer .dropdown-menu');
  }

  itemName(element: Locator) {
    return element.locator('.basket-item-title');
  }

  itemPrice(element: Locator) {
    return element.locator('.basket-item-price');
  }

  itemCount(element: Locator) {
    return element.locator('.basket-item-count');
  }

  async getDataFromBasket() {
    const elementsCount = await this.itemsList.count();
    const dataArray: itemData[] = [];
    for (let i = 0; i < elementsCount; i++) {
      const element = this.itemsList.nth(i);
      const itemData: itemData = {
        itemName: await this.itemName(element).innerText(),
        itemPrice: Number((await this.itemPrice(element).innerText()).match(/\d+/g)),
        itemCount: +(await this.itemCount(element).innerText()),
      };
      dataArray.push(itemData);
    }
    return dataArray;
  }
}
