import puppeteer, { type Browser, type Page } from "puppeteer";
import {
  IDataCollector,
  IJobSearcher,
  type ScrapeOptions,
} from "../../interfaces";
import BadRequestError from "../../../../errors/badRequestError";

export default abstract class AbstractScraperService<T> {
  protected browser: Browser | null = null;
  protected page: Page | null = null;
  protected options: ScrapeOptions;
  protected jobSearcher: IJobSearcher;
  protected dataCollector: IDataCollector<T>;

  constructor(
    options: ScrapeOptions,
    jobSearcher: IJobSearcher,
    dataCollector: IDataCollector<T>
  ) {
    this.options = options;
    this.jobSearcher = jobSearcher;
    this.dataCollector = dataCollector;
  }

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

  async scrape(): Promise<any> {
    await this.initBrowser();

    if (!this.browser)
      throw new BadRequestError({
        message: "Browser is not initialized",
        logging: true,
        code: 400,
      });

    this.page = await this.browser.newPage();

    try {
      const result = await this.executeScrape();
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

  private async executeScrape(): Promise<T[]> {
    await this.jobSearcher.searchJobOffers();
    return await this.dataCollector.scrollAndCollectData();
  }
}
