import { itemData, testData } from '../data/interfaces';
import BasePage from './basepage';
import { type Locator, type Page } from '@playwright/test';

export class MainPage extends BasePage {
  url = '/';

  readonly itemList: Locator;
  readonly discountItemList: Locator;
  readonly fullPriceItemList: Locator;
  readonly content: Locator;

  constructor(page: Page) {
    super(page);
    this.fullPriceItemList = page.locator('.note-item:not(.hasDiscount)');
    this.discountItemList = page.locator('.note-item.hasDiscount');
    this.content = page.locator('div.note-list');
  }

  discountItem(number: number) {
    return this.discountItemList.nth(number);
  }

  itemPrice(element: Locator) {
    return element.locator('.product_price');
  }

  itemName(element: Locator) {
    return element.locator('.product_name');
  }

  itemStockBalance(element: Locator) {
    return element.locator('.product_count');
  }

  itemEnterCount(element: Locator) {
    return element.locator('input');
  }

  buyButton(element: Locator) {
    return element.locator('button.actionBuyProduct');
  }

  async waitContent() {
    await this.content.waitFor();
  }

  async refreshPage() {
    await this.page.reload();
    await this.waitContent();
  }

  async addItemToBasket(testData: testData) {
    const arrayOfLocators = testData.hasDiscount ? this.discountItemList : this.fullPriceItemList;
    const elementsCount = await arrayOfLocators.count();
    for (let i = 0; i < elementsCount; i++) {
      const element = arrayOfLocators.nth(i);
      const stockBalance = +(await this.itemStockBalance(element).innerText());
      if (stockBalance >= testData.itemCount) {
        await this.itemEnterCount(element).fill(testData.itemCount.toString());
        await this.buyButton(element).click();
        const matchNumberFromPrice = (await this.itemPrice(element).innerText()).match(/\d+/g);
        const itemData: itemData = {
          itemName: await this.itemName(element).innerText(),
          itemPrice: matchNumberFromPrice ? +matchNumberFromPrice[0] : null,
          itemCount: testData.itemCount,
        };
        return itemData;
      }
    }
  }
}
