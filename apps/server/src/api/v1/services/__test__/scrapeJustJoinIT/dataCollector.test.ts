import "expect-puppeteer";
// import { beforeAll, describe, it } from "@jest/globals";
import { Page } from "puppeteer";

let timeout = 2500;

describe("Test dataCollector", () => {
  let page: Page;
  beforeAll(async () => {
    page = await global.__BROWSER__.newPage();
    await page.goto("https://google.com");
  }, timeout);

  it('should be titled "Google"', async () => {
    let text = await page.evaluate(() => document.body.textContent);
    expect(text).toContain("abc");
  });

  afterAll(async () => {
    await page.close();
  });
});
