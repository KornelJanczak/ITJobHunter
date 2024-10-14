import { type Page } from "puppeteer";
import { type IDataCollector } from "../../interfaces";
import { type IJobSearcher } from "../../interfaces";
import { type IPageOpener } from "../../interfaces";
import CoreJobScraperService from "../coreJobScraperService";
import {
  IJobScraperService,
  IScraperServiceDependencies,
  JobOffer,
  ScrapeOptions,
} from "../../interfaces";
import { pageOpener } from "./pageOpener";

class NoFluffJobsScraperService<T extends JobOffer>
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
    options: ScrapeOptions
  ): Promise<any> {}
}

export const noFluffJobsScraperService = new NoFluffJobsScraperService({
  pageOpener,
});
