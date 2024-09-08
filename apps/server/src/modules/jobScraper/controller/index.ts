import { NextFunction, Request, Response } from "express";

export const jobScraperController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Job Scraper Controller');
    
    return res.status(200).json({ message: "Job Scraper Controller" });
  } catch (err) {
    next(err);
  }
};
