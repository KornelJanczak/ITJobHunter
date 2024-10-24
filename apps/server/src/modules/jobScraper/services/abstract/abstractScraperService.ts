import { type Page } from "puppeteer";
import { type ScrapeOptions } from "../../interfaces";
import BadRequestError from "../../../../errors/badRequestError";

interface IScraperServiceDependencies {
  page: Page;
  options: ScrapeOptions;
}

export default abstract class AbstractScraperService {
  protected page: Page;
  protected options: ScrapeOptions;

  constructor({ page, options }: IScraperServiceDependencies) {
    this.options = options;
    this.page = page;
  }

  abstract executeScrape(): Promise<any>;

  async scrape(): Promise<any> {
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
}
