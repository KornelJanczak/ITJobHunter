import { JobQuery } from "@repo/interfaces/job";
import { NextFunction } from "express";

interface INoFluffJobsScraperService {
  scrape(jobQuery: JobQuery, next: NextFunction): Promise<any>;
}

class NoFluffJobsScraperService implements INoFluffJobsScraperService {
  async scrape(jobQuery: JobQuery, next: NextFunction) {
    return "NoFluffJobsScraperService";
  }
}

export const noFluffJobsScraperService = new NoFluffJobsScraperService();
