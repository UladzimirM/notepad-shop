import BasePage from './basepage';
import { type Locator, type Page } from '@playwright/test';

export class LoginPage extends BasePage {
  url = 'login';

  readonly loginInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.loginInput = page.locator('input#loginform-username');
    this.passwordInput = page.locator('input#loginform-password');
    this.loginButton = page.locator('button[name="login-button"]');
  }

  async logIn(login: string, password: string) {
    await this.loginInput.fill(login);
    await this.passwordInput.click();
    await this.page.keyboard.type(password);
    await this.loginButton.click();
  }
}
