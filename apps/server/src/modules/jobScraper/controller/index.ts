import { NextFunction, Request, Response } from "express";
import { jobScraperService } from "../services";
import { JobQuery } from "@repo/interfaces/job";

export const jobScraperController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Job Scraper Controller");

    const jobQuery: JobQuery = req.jobQuery;
    await jobScraperService(jobQuery, next);

    return res.status(200).json({ message: "Job Scraper Controller" });
  } catch (err) {
    next(err);
  }
};
