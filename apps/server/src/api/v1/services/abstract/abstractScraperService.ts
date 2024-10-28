import { type Page } from "puppeteer";
import {
  type ScrapeOptions,
  IDataCollector,
  IJobSearcher,
} from "../../jobScraper.interfaces";
import BadRequestError from "../../../../common/errors/badRequestError";

interface IScraperServiceDependencies<T> {
  page: Page;
  options: ScrapeOptions;
}

export default abstract class AbstractScraperService<T> {
  protected abstract url: string;
  protected abstract elementTag: string;
  protected page: Page;
  protected options: ScrapeOptions;

  constructor({ page, options }: IScraperServiceDependencies<T>) {
    this.options = options;
    this.page = page;
  }

  protected abstract createScraperDependencies(): {
    jobSearcher: IJobSearcher;
    dataCollector: IDataCollector<T>;
  };

  async scrape(): Promise<T[]> {
    try {
      return await this.executeScrape();
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
    const { jobSearcher, dataCollector } = this.createScraperDependencies();
    await jobSearcher.searchJobOffers();
    const collectedData = await dataCollector.scrollAndCollectData();

    return collectedData;
  }
}
