import { Browser } from "puppeteer";
import { JobQuery } from "@repo/interfaces/job";
import { NextFunction } from "express";
import { Page } from "puppeteer";

export interface ScrapeOptions {
  url: string;
  jobQuery: JobQuery;
  next: NextFunction;
}

export interface SearchJobOffers {
  page: Page;
  jobQuery: JobQuery;
  path: string;
  next: NextFunction;
}

export interface JustJoinITOffer {
  title: string;
  location: string;
  url: string;
}
