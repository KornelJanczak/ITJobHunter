import { JobQuery } from "@repo/interfaces/job";
import { ScrapeOptions } from "../../jobScraper.interfaces";
import { type Page } from "puppeteer";
import { NextFunction } from "express";

export abstract class AbstractJobSearcher {
  protected page: Page;
  protected jobQuery: JobQuery;
  protected next: NextFunction;

  constructor(page: Page, { jobQuery, next }: ScrapeOptions) {
    this.page = page;
    this.jobQuery = jobQuery;
    this.next = next;
  }
  abstract searchJobOffers(): Promise<void>;

  protected abstract filterLocation(
    path: string,
    location: string | undefined
  ): string | void;
  protected abstract filterTechStack(
    path: string,
    techStack: string[] | undefined
  ): string | void;

  protected abstract filterContent(
    path: string,
    content: string | undefined
  ): string | void;

  protected abstract filterPositionLevel(
    path: string,
    positionLevel: string | undefined
  ): string | void;

  protected abstract filterSalary(
    path: string,
    minimumSalary: number | undefined,
    maximumSalary: number | undefined
  ): string | void;
}
