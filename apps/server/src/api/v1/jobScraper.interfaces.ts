import { type JobQuery } from "@repo/interfaces/job";
import { type NextFunction } from "express";
import { type Page } from "puppeteer";

export interface ScrapeOptions {
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
  scrape(): Promise<T[]>;
}

export interface IDataCollector<T> {
  scrollAndCollectData(): Promise<T[]>;
}

export interface IJobSearcher {
  searchJobOffers(): Promise<void>;
}

export interface ScraperServiceFactory {
  createScraperService(): void;
}

export interface IScraperServiceDependencies<T> {
  jobSearcher: IJobSearcher;
  dataCollector: IDataCollector<T>;
}
