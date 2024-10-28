import { NextFunction, Request, Response } from "express";
import MultiSiteScraperService from "./services";
import { JobQuery } from "@repo/interfaces/job";

export const jobScraperController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobQuery: Partial<JobQuery> = req.jobQuery || {};
    const jobScraperService = new MultiSiteScraperService({ jobQuery, next });
    const jobs = await jobScraperService.executeScrapers();

    return res.status(200).json({ jobs });
  } catch (err) {
    next(err);
  }
};
