import JobSearcher from "./jobSearcher";
import DataCollector from "./dataCollector";
import { IJobScraperService } from "../../interfaces";
import AbstractScraperService from "../abstract/abstractScraperService";
import { JobOffer } from "../../interfaces";

class JustJoinITScraperService
  extends AbstractScraperService<JobOffer>
  implements IJobScraperService<JobOffer>
{
  protected url: string = "https://justjoin.it/";
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

export default JustJoinITScraperService;
