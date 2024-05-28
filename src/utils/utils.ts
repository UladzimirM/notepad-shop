import { type Page } from '@playwright/test';
import { BasketComponent } from '../pages/components/basket.component';
import { HeaderComponent } from '../pages/components/header.component';
import { MainPage } from '../pages/mainPage';

export class Utils {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async clearBasket() {
    const headerComponent = new HeaderComponent(this.page);
    const basketComponent = new BasketComponent(this.page);
    const mainPage = new MainPage(this.page);
    const itemsCount = await headerComponent.getItemsCount();
    if (itemsCount > 0) {
      await mainPage.addItemToBasket({
        itemCount: 1,
        hasDiscount: false,
      });
      mainPage.refreshPage();
      await headerComponent.basketIcon.click();
      await basketComponent.clearButton.click();
    }
  }
}
