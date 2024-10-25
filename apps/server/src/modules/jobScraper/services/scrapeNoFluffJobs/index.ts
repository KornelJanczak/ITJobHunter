import { IJobScraperService, JobOffer } from "../../interfaces";
import JobSearcher from "./jobSearcher";
import AbstractScraperService from "../abstract/abstractScraperService";
import DataCollector from "./dataCollector";

class NoFluffJobsScraperService
  extends AbstractScraperService<JobOffer>
  implements IJobScraperService<JobOffer>
{
  protected url: string = "https://nofluffjobs.com/pl/";
  protected elementTag: string = ".MuiBox-root.css-ai36e1";

  protected createScraperDependencies() {
    const jobSearcher = new JobSearcher(this.page, this.options);
    const dataCollector = new DataCollector(
      this.page,
      this.elementTag,
      this.url
    );

    return { jobSearcher, dataCollector };
  }
}

export default NoFluffJobsScraperService;
