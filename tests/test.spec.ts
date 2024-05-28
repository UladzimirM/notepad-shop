import { test, expect } from '@playwright/test';

import { LoginPage } from '../src/pages/loginPage';
import { MainPage } from '../src/pages/mainPage';
import { BasketPage } from '../src/pages/basketPage';
import { HeaderComponent } from '../src/pages/components/header.component';
import { BasketComponent } from '../src/pages/components/basket.component';

import { Utils } from '../src/utils/utils';
import { credentials } from '../src/data/constants';
import { itemData, testData } from '../src/data/interfaces';

const data = [
  {
    testCaseName: 'Navigate to basket with 1 product without discount',
    testCaseId: 2,
    testData: [
      {
        itemCount: 1,
        hasDiscount: true,
      },
    ],
  },
  {
    testCaseName: 'Navigate to basket with 1 product with discount',
    testCaseId: 3,
    testData: [
      {
        itemCount: 1,
        hasDiscount: false,
      },
    ],
  },
  {
    testCaseName: 'Navigate to basket with 9 products different products',
    testCaseId: 4,
    testData: [
      {
        itemCount: 8,
        hasDiscount: true,
      },
      {
        itemCount: 1,
        hasDiscount: false,
      },
    ],
  },
  {
    testCaseName: 'Navigete to basket with 9 products with discount',
    testCaseId: 5,
    testData: [
      {
        itemCount: 9,
        hasDiscount: true,
      },
    ],
  },
];

test.beforeEach('Login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const headerComponent = new HeaderComponent(page);
  const mainPage = new MainPage(page);
  const utils = new Utils(page);
  await loginPage.open();
  await loginPage.logIn(credentials.userName, credentials.password);
  await mainPage.waitContent();
  await expect(headerComponent.userIcon).toBeVisible();
  await utils.clearBasket();
  await mainPage.refreshPage();
  expect(await headerComponent.getItemsCount()).toEqual(0);
});

test.afterEach('Logout', async ({ page }) => {
  const header = new HeaderComponent(page);
  await header.logOut();
  await expect(header.userIcon).not.toBeVisible();
});

test(`1 Navigate to empty basket`, async ({ page }) => {
  const headerComponent = new HeaderComponent(page);
  const basketComponent = new BasketComponent(page);
  const basketPage = new BasketPage(page);

  await headerComponent.basketIcon.click();
  await expect(basketComponent.basketForm).toBeVisible();
  await basketComponent.navigateToBasketPage.click();
  expect(page.url()).toEqual(basketPage.getFullUrl());
});

data.forEach((testParameters) => {
  test(`${testParameters.testCaseId} ${testParameters.testCaseName}`, async ({ page }) => {
    const testData: testData[] = testParameters.testData;

    const mainPage = new MainPage(page);
    const headerComponent = new HeaderComponent(page);
    const basketComponent = new BasketComponent(page);
    const basketPage = new BasketPage(page);

    const buyArray: itemData[] = [];
    for (let i = 0; i < testData.length; i++) {
      const buyObject = await mainPage.addItemToBasket(testData[i]);
      buyObject ? buyArray.push(buyObject) : '';
    }
    await mainPage.refreshPage();
    const itemBasketCountActual = await headerComponent.getItemsCount();
    const itemBasketCountExpected = testData.reduce((sum, current) => sum + current.itemCount, 0);
    expect(itemBasketCountActual).toEqual(itemBasketCountExpected);

    await headerComponent.basketIcon.click();
    await expect(basketComponent.basketForm).toBeVisible();

    const basketArray = await basketComponent.getDataFromBasket();
    expect(buyArray).toEqual(basketArray);
    await basketComponent.navigateToBasketPage.click();
    expect(page.url()).toEqual(basketPage.getFullUrl());
  });
});
