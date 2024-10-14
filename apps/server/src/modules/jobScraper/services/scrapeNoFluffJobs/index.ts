import { type Page } from "puppeteer";
import { type IDataCollector } from "../../interfaces";
import { type IJobSearcher } from "../../interfaces";
import {
  IJobScraperService,
  IScraperServiceDependencies,
  JobOffer,
  ScrapeOptions,
} from "../../interfaces";

import { jobSearcher } from "./jobSearcher";
import { dataCollector } from "./dataCollector";
import AbstractScraperService from "../abstract/abstractScraperService";

class NoFluffJobsScraperService<T extends JobOffer>
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
  ): Promise<any> {
    await this.jobSearcher.searchJobOffers({
      page,
      jobQuery,
      path: url,
      next,
    });

    return [];
  }
}

export const scrapeNoFluffJobs = new NoFluffJobsScraperService({
  jobSearcher,
  dataCollector,
});
