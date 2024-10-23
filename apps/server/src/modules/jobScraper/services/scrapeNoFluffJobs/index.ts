import { type Page } from "puppeteer";
import { type IDataCollector } from "../../interfaces";
import { type IJobSearcher } from "../../interfaces";
import {
  IJobScraperService,
  IScraperServiceDependencies,
  JobOffer,
  ScrapeOptions,
} from "../../interfaces";
import JobSearcher from "./jobSearcher";
import AbstractScraperService from "../abstract/abstractScraperService";
import DataCollector from "./dataCollector";

class NoFluffJobsScraperService<T extends JobOffer>
  extends AbstractScraperService<T>
  implements IJobScraperService<T>
{
  private url: string = "https://nofluffjobs.com/pl/";

  async executeScrape(): Promise<T[]> {
    const jobSearcher = new JobSearcher(this.page, this.options);
    const dataCollector = new DataCollector(this.page, "", this.url);

    await jobSearcher.searchJobOffers();
    const collectedData = await dataCollector.scrollAndCollectData();

    // return collectedData;
  }
  // private jobSearcher: IJobSearcher;
  // private dataCollector: IDataCollector<T>;
  // constructor(
  //   config: IScraperServiceDependencies<T>,
  //   page: Page,
  //   options: ScrapeOptions
  // ) {
  //   super(page, options);
  //   this.jobSearcher = config.jobSearcher;
  //   this.dataCollector = config.dataCollector;
  // }
  // protected async executeScrape(): Promise<any> {
  //   // await this.jobSearcher.searchJobOffers({
  //   //   page,
  //   //   jobQuery,
  //   //   next,
  //   // });
  //   // return await this.dataCollector.scrollAndCollectData(page);
  // }
}

export default NoFluffJobsScraperService;

// export const scrapeNoFluffJobs = new NoFluffJobsScraperService({
//   jobSearcher,
//   dataCollector,
// });
