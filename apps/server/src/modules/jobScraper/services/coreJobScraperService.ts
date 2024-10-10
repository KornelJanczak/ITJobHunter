import puppeteer, { type Browser, type Page } from "puppeteer";
import { ScrapeOptions } from "../interfaces";
import { ICoreJobScraperService } from "../interfaces";
import BadRequestError from "../../../errors/badRequestError";

export default abstract class CoreJobScraperService
  implements ICoreJobScraperService
{
  protected browser: Browser | null = null;

  constructor() {
    this.initBrowser();
  }

  async initBrowser() {
    if (this.browser) {
      this.browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
      });
    }
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  protected abstract executeScrape(
    page: Page,
    options: ScrapeOptions
  ): Promise<any>;

  async scrape(options: ScrapeOptions): Promise<any> {
    await this.initBrowser();

    if (!this.browser)
      throw new BadRequestError({
        message: "Browser is not initialized",
        logging: true,
        code: 400,
      });

    const page = await this.browser.newPage();

    try {
      const result = await this.executeScrape(page, options);
      return result;
    } catch (err) {
      throw new BadRequestError({
        message: "Failed to scrape",
        logging: true,
        code: 400,
        context: { error: err },
      });
    } finally {
      await page.close();
      await this.closeBrowser();
    }
  }
}
