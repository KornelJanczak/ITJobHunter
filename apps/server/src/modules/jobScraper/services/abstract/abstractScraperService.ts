import puppeteer, { type Browser, type Page } from "puppeteer";
import { type ScrapeOptions } from "../../interfaces";
import BadRequestError from "../../../../errors/badRequestError";

export default abstract class AbstractScraperService {
  protected browser: Browser | null = null;

  async initBrowser() {
    if (!this.browser) {
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

  async waitFor(time: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, time));
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
      await this.waitFor(100);
      await this.closeBrowser();

      return result;
    } catch (err) {
      throw new BadRequestError({
        message: "Failed to scrape",
        logging: true,
        code: 400,
        context: { error: err },
      });
    }
  }
}
