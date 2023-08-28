const { $ } = require('@wdio/globals')
const Page = require('./page');

class SecurePage extends Page {
  get btnSearch() {
    return $('#searcher');
  }
  get btnLocation() {
    return $('//*[contains(text(),"Location")]');
  }
  get inputLocationPlaceholder() {
    return $('[class="Select-placeholder"]');
  }
  get inputLocation() {
    return $('[class="Select-input "');
  }
  get tableData() {
    return $('[data-cy-loaded="true"]');
  }

  get rowsTable() {
    return $$('[data-cy="SelectableTableRow"]');
  }
  get btnsAccessEmail() {
    // return $$('[data-cy="SelectableTableRow"] [data-elem="button-label"]');
    return $$(`//*[@data-elem="button-label"] [contains(text(),'Access Email')]`);
  }
  get btnCreateASequence() {
    return $('[data-cy="new-sequence-button"]');
  }
  get btnAgreeTerms() {
    return $(
      `//*[contains(@data-elem, 'button-label')] [contains(text(),'I will comply')]`
    );
  }
  get btnNextPage() {
    return $(`[aria-label="right-arrow"]`);
  }

  get btnCheckbox() {
    return $(`[data-cy="SelectableTableRow"] td`);
  }

  async openSearchTab() {
    await super.waitAndClick(this.btnSearch);
    await this.btnLocation.waitForDisplayed();
  }

  async pickLocation(location) {
    await this.btnLocation.scrollIntoView();
    await super.waitAndClick(this.btnLocation);
    await this.inputLocation.scrollIntoView();
    await super.waitAndClick(this.inputLocationPlaceholder);
    await this.inputLocation.setValue(location);
    await browser.keys('Enter');
    await this.tableData.waitForDisplayed();
  }

  async openEachEmail() {
    let btns = await this.btnsAccessEmail;
    if (btns.length === 0) {
      await browser.pause(2000);
      await console.log('No emails found')
    } else {
      for (let i = 0; i < btns.length; i++) {
        let btn = btns[i];
        await btn.scrollIntoView();
        await super.waitAndClick(btn);
        if (i === 0) {
          await browser.pause(2000);
          if (await this.btnAgreeTerms.isDisplayed()) {
            await super.waitAndClick(this.btnAgreeTerms);
          }
        }
        await browser.pause(1500);
        if (await this.btnCreateASequence.isDisplayed()) {
          await browser.keys('Escape');
          await browser.pause(500);
        }
      }
    }
  }

  async moveToNextPage() {
    await super.waitAndClick(this.btnNextPage);
    await browser.pause(2000);
    await this.tableData.waitForDisplayed();
  }

  async getFullData() {
    let data = [];
    let limitNumberOfPages = 0;
    // for(let i = 0; i < limitNumberOfPages; i++) {
    do {
      await this.openEachEmail();
      let rows = await this.rowsTable;
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let cells = await row.$$('td');
        let rowData = [];
        for (let j = 0; j < cells.length; j++) {
          let cell = cells[j];
          let text = await cell.getText();
          rowData.push(text);
          let linkedInPersonalLink = await cells[j].$$(
            'span a[href*="linkedin"]'
          );
          if (linkedInPersonalLink.length > 0) {
            let linkedInPersonalLinkText =
              await linkedInPersonalLink[0].getAttribute('href');
            rowData.push(linkedInPersonalLinkText);
          }
        }
        data.push(rowData);
      }
      if (await this.btnNextPage.isClickable()) {
        await this.moveToNextPage();
      } else {
        break;
      }
      limitNumberOfPages++;
    } while (limitNumberOfPages < 5);
    return data;
  }
}

module.exports = new SecurePage();
