const { expect } = require('@wdio/globals');
const fs = require('fs');
const LoginPage = require('../pageobjects/login.page');
const SearchPage = require('../pageobjects/search.page');
const username = 'scrabber.test@gmail.com',
  password = 'Rentzila123#';
const dataFile = './data.json';

describe('Scrab the data', () => {
  it('should scrab the data from site', async () => {
    await LoginPage.open();
    // await LoginPage.login(username, password)
    // await LoginPage.googleLogin(password)
    // await SearchPage.openSearchTab()
    // await SearchPage.pickLocation('United States')
    await browser.debug();
    const jsonData = JSON.stringify(await SearchPage.getFullData());
    await fs.writeFileSync(dataFile, jsonData);
    await browser.pause(5000);
  });
});
