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

export interface JobOffer {
  title: string;
  location: string;
  url: string;
}

export interface JustJoinITOffer {
  title: string;
  location: string;
  url: string;
}

export interface ICoreJobScraperService {
  initBrowser(): Promise<void>;
  closeBrowser(): Promise<void>;
}

export interface IJobScraperService<T> {
  scrape(options: ScrapeOptions): Promise<T[]>;
}

export interface IDataCollector<T> {
  collectData(page: Page): Promise<T[]>;
  scrollAndCollectData(page: Page): Promise<T[]>;
}

export interface IJobSearcher<T> {
  searchJobOffers(options: SearchJobOffers): Promise<void>;
}

export interface IScraperServiceDependencies<T> {
  jobSearcher: IJobSearcher<T>;
  dataCollector: IDataCollector<T>;
}
