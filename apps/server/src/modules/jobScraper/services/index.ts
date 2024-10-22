import { JobQuery } from "@repo/interfaces/job";
import { ScrapeOptions } from "../interfaces";
import { NextFunction } from "express";
import NoFluffJobsScraperService from "./scrapeNoFluffJobs";
import JobSearcher from "./scrapeNoFluffJobs/jobSearcher";
// import { scrapeJustJoinIT } from "./scrapeJustJoinIT";
// import { scrapeNoFluffJobs } from "./scrapeNoFluffJobs";

interface IJobScraperService {
  scrapeJobs(jobQuery: JobQuery, next: NextFunction): Promise<any>;
}

class JobScraperService implements IJobScraperService {
  async scrapeJobs(jobQuery: JobQuery, next: NextFunction) {
    const jobs = await this.gatherJobs({
      jobQuery,
      next,
    });

    return jobs;
  }

  private async gatherJobs(scrapeOptions: ScrapeOptions) {
    // const justJoinItJobs = await scrapeJustJoinIT.scrape({
    //   ...scrapeOptions,
    // });



    // const noFluffJobs = await scrapeNoFluffJobs.scrape({
    //   ...scrapeOptions,
    // });

    const jobs = [];

    return jobs;
  }
}

const jobScraperService = new JobScraperService();
export default jobScraperService;
