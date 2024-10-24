import JobSearcher from "./jobSearcher";
import DataCollector from "./dataCollector";
import { IJobScraperService } from "../../interfaces";
import AbstractScraperService from "../abstract/abstractScraperService";
import { JobOffer } from "../../interfaces";

class ScrapeJustJoinITService
  extends AbstractScraperService
  implements IJobScraperService<JobOffer>
{
  private url: string = "https://justjoin.it/";

  async executeScrape(): Promise<JobOffer[]> {
    const { jobSearcher, dataCollector } = this.createScraperDependencies();
    await jobSearcher.searchJobOffers();
    const collectedData = await dataCollector.scrollAndCollectData();

    return collectedData;
  }

  protected createScraperDependencies() {
    const jobSearcher = new JobSearcher(this.page, this.options);
    const dataCollector = new DataCollector(
      this.page,
      ".posting-list-item",
      this.url
    );

    return { jobSearcher, dataCollector };
  }
}

export default ScrapeJustJoinITService;
