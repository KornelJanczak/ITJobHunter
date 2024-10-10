import { type Page } from "puppeteer";
import { type IDataCollector } from "../../interfaces";
import { type IJobSearcher } from "../../interfaces";
import { type IPageOpener } from "../../interfaces";
import {
  IJobScraperService,
  IScraperServiceDependencies,
  JustJoinITOffer,
  ScrapeOptions,
} from "../../interfaces";
import CoreJobScraperService from "../coreJobScraperService";
import { pageOpener } from "./pageOpener";
import { dataCollector } from "./dataCollector";
import { jobSearcher } from "./jobSearcher";

class ScrapeJustJoinIT<T extends JustJoinITOffer>
  extends CoreJobScraperService
  implements IJobScraperService<T>
{
  private pageOpener: IPageOpener<T>;
  private jobSearcher: IJobSearcher<T>;
  private dataCollector: IDataCollector<T>;

  constructor(config: IScraperServiceDependencies<T>) {
    super();
    this.pageOpener = config.pageOpener;
    this.jobSearcher = config.jobSearcher;
    this.dataCollector = config.dataCollector;
  }

  protected async executeScrape(
    page: Page,
    { url, jobQuery, next }: ScrapeOptions
  ): Promise<T[]> {
    await this.pageOpener.openPage(page, url, next);
    await this.jobSearcher.searchJobOffers({
      page,
      jobQuery,
      path: url,
      next,
    });

    return await this.dataCollector.scrollAndCollectData(page);
  }
}

export const scrapeJustJoinIT = new ScrapeJustJoinIT({
  pageOpener,
  jobSearcher,
  dataCollector,
});
