import { Browser } from "puppeteer";
import { ScrapeOptions } from "../../../interfaces";

export const scrapeJustJoinIT = async ({
  url,
  browser,
  jobQuery,
}: ScrapeOptions) => {
  try {
    const page = await browser.newPage();
    await page.goto(url);

    console.log("site");

    await page.waitForSelector("#cookiescript_injected");
    await page.click("#cookiescript_accept");
    await page.waitForSelector('input[placeholder="Search"]');
    await page.type('input[placeholder="Search"]', jobQuery.content);
    await page.keyboard.press("Enter");
  } catch {}
};
