import { NextFunction, Request, Response } from "express";
import jobScraperService from "../services";
import { JobQuery } from "@repo/interfaces/job";

export const jobScraperController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // debugger;
    console.log("Job Scraper Controller");
    const jobQuery: Partial<JobQuery> = req.jobQuery || {};
    const jobs = await jobScraperService.scrapeJobs(jobQuery, next);

    return res.status(200).json({ jobs });
  } catch (err) {
    next(err);
  }
};
