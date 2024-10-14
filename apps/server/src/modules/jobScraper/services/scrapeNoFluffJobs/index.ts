import { type Page } from "puppeteer";
import CoreJobScraperService from "../coreJobScraperService";
import {
  type IJobScraperService,
  type JobOffer,
  type ScrapeOptions,
} from "../../interfaces";

class NoFluffJobsScraperService<T extends JobOffer>
  extends CoreJobScraperService
  implements IJobScraperService<T>
{
  protected async executeScrape(
    page: Page,
    options: ScrapeOptions
  ): Promise<any> {}
}

export const noFluffJobsScraperService = new NoFluffJobsScraperService();
