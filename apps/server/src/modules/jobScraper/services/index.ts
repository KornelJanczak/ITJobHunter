import { JobQuery } from "@repo/interfaces/job";
import { ScrapeOptions } from "../interfaces";
import { NextFunction } from "express";
import { scrapeJustJoinIT } from "./scrapeJustJoinIT";
import { scrapeNoFluffJobs } from "./scrapeNoFluffJobs";

interface IJobScraperService {
  scrapeJobs(jobQuery: JobQuery, next: NextFunction): Promise<any>;
}

class JobScraperService implements IJobScraperService {
  urls = {
    justJoinIT: "https://justjoin.it",
    noFluffJobs: "https://nofluffjobs.com/pl",
    protocolIT: "https://theprotocol.it/",
    pracujPL: "https://www.pracuj.pl/",
  };

  async scrapeJobs(jobQuery: JobQuery, next: NextFunction) {
    const jobs = await this.gatherJobs({
      jobQuery,
      next,
      url: this.urls.justJoinIT,
    });

    return jobs;
  }

  private async gatherJobs(scrapeOptions: ScrapeOptions) {
    const justJoinItJobs = await scrapeJustJoinIT.scrape({
      ...scrapeOptions,
      url: this.urls.justJoinIT,
    });

    const noFluffJobs = await scrapeNoFluffJobs.scrape({
      ...scrapeOptions,
      url: this.urls.noFluffJobs,
    });

    const jobs = [...justJoinItJobs, ...noFluffJobs];

    return jobs;
  }
}

const jobScraperService = new JobScraperService();

export default jobScraperService;
