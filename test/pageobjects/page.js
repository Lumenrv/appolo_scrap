const { browser } = require('@wdio/globals');

module.exports = class Page {

  async open() {
    return await browser.url(`https://app.apollo.io/`);
  }

  async waitAndClick(element) {
    await element.waitForDisplayed();
    await element.click();
  }
};

