import { type Page } from "puppeteer";
import {
  IDataCollector,
  IJobSearcher,
  type ScrapeOptions,
} from "../../interfaces";
import BadRequestError from "../../../../errors/badRequestError";
import JobSearcher from "../scrapeNoFluffJobs/jobSearcher";
import DataCollector from "../scrapeNoFluffJobs/dataCollector";

interface IScraperServiceDependencies<T> {
  page: Page;
  options: ScrapeOptions;
  // jobSearcher: IJobSearcher;
  // dataCollector: IDataCollector<T>;
}

export default abstract class AbstractScraperService<T> {
  protected page: Page;
  protected options: ScrapeOptions;

  // protected jobSearcher: IJobSearcher;
  // protected dataCollector: IDataCollector<T>;

  constructor({
    page,
    options,
    // jobSearcher,
    // dataCollector,
  }: IScraperServiceDependencies<T>) {
    this.options = options;
    this.page = page;
    // this.jobSearcher = jobSearcher;
    // this.dataCollector = dataCollector;
  }

  // async initBrowser() {
  //   if (!this.browser) {
  //     this.browser = await puppeteer.launch({
  //       headless: false,
  //       defaultViewport: null,
  //     });
  //   }
  // }

  // async closeBrowser() {
  //   if (this.browser) {
  //     await this.browser.close();
  //     this.browser = null;
  //   }
  // }

  // async waitFor(time: number): Promise<void> {
  //   return new Promise((resolve) => setTimeout(resolve, time));
  // }
  abstract executeScrape(): Promise<T[]>;

  async scrape(): Promise<any> {
    // await this.initBrowser();

    // if (!this.browser)
    //   throw new BadRequestError({
    //     message: "Browser is not initialized",
    //     logging: true,
    //     code: 400,
    //   });

    // this.page = await this.browser.newPage();

    try {
      const result = await this.executeScrape();

      // await this.waitFor(100);
      // await this.closeBrowser();

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
