import { IJobScraperService, JobOffer } from "../../interfaces";
import JobSearcher from "./jobSearcher";
import AbstractScraperService from "../abstract/abstractScraperService";
import DataCollector from "./dataCollector";

class NoFluffJobsScraperService
  extends AbstractScraperService
  implements IJobScraperService<JobOffer>
{
  private url: string = "https://nofluffjobs.com/pl/";

  async executeScrape(): Promise<JobOffer[]> {
    const { jobSearcher, dataCollector } = this.createScraperDependencies();
    await jobSearcher.searchJobOffers();
    const collectedData = await dataCollector.scrollAndCollectData();

    return collectedData;
  }

  private createScraperDependencies() {
    const jobSearcher = new JobSearcher(this.page, this.options);
    const dataCollector = new DataCollector(
      this.page,
      ".posting-list-item",
      this.url
    );

    return { jobSearcher, dataCollector };
  }
}

export default NoFluffJobsScraperService;
