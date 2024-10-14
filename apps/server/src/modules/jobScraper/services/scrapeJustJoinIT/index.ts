import { type Page } from "puppeteer";
import { type IDataCollector } from "../../interfaces";
import { type IJobSearcher } from "../../interfaces";
import {
  IJobScraperService,
  IScraperServiceDependencies,
  JustJoinITOffer,
  ScrapeOptions,
} from "../../interfaces";
import AbstractScraperService from "../abstract/abstractScraperService";
import { dataCollector } from "./dataCollector";
import { jobSearcher } from "./jobSearcher";

class ScrapeJustJoinIT<T extends JustJoinITOffer>
  extends AbstractScraperService
  implements IJobScraperService<T>
{
  private jobSearcher: IJobSearcher<T>;
  private dataCollector: IDataCollector<T>;

  constructor(config: IScraperServiceDependencies<T>) {
    super();
    this.jobSearcher = config.jobSearcher;
    this.dataCollector = config.dataCollector;
  }

  protected async executeScrape(
    page: Page,
    { url, jobQuery, next }: ScrapeOptions
  ): Promise<T[]> {
    console.log("Open page");

    console.log("Page v1", page);

    await this.jobSearcher.searchJobOffers({
      page,
      jobQuery,
      path: url,
      next,
    });
    // await this.pageOpener.openPage(page, url, next);

    console.log("Before data collector");

    return await this.dataCollector.scrollAndCollectData(page);
  }
}

export const scrapeJustJoinIT = new ScrapeJustJoinIT({
  jobSearcher,
  dataCollector,
});
