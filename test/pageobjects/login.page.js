const { $ } = require('@wdio/globals');
const Page = require('./page');

class LoginPage extends Page {
  get inputUsername() {
    return $('[name="email"]');
  }
  get inputPassword() {
    return $('[name="password"]');
  }
  get btnSubmit() {
    return $('button[type="submit"]');
  }
  get btnLogin() {
    return $('a[href="/login"]');
  }
  get btnGoogleLoginNext() {
    return $('#identifierNext');
  }
  get inputGooglePassword() {
    return $('[name="Passwd"]');
  }
  get btnGooglePasswordNext() {
    return $('#passwordNext');
  }
  get logoApollo() {
    return $('img[alt="Apollo"]');
  }

  async login(username, password) {
    await this.inputUsername.setValue(username);
    await this.inputPassword.setValue(password);
    await this.btnSubmit.click();
  }

  async googleLogin(password) {
    await super.waitAndClick(this.btnGoogleLoginNext);
    await this.inputGooglePassword.setValue(password);
    await super.waitAndClick(this.btnGooglePasswordNext);
    await this.logoApollo.waitForDisplayed();
  }
  /**
   * overwrite specific options to adapt it to page object
   */
  async open() {
    let attempts = 0,
      maxAttempts = 10;
    let logoDisplayed = false;

    while (attempts < maxAttempts && !logoDisplayed) {
      try {
        await super.open();
        await this.btnSubmit.waitForDisplayed({ timeout: 5000 });
        logoDisplayed = true;
        console.log('Logo is displayed!');
      } catch (error) {
        console.log(
          `Attempt ${attempts + 1}: Logo is not displayed. Reloading...`
        );
        attempts++;
      }
    }
  }
}

module.exports = new LoginPage();
