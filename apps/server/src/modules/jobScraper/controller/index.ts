import { NextFunction, Request, Response } from "express";

export const jobScraperController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(200).json({ message: "Job Scraper Controller" });
  } catch (err) {
    next(err);
  }
};
