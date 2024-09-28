import { JobQuery } from "@repo/interfaces/job";
import puppeteer from "puppeteer-extra";
import { Browser } from "puppeteer";
import ScrapeJustJoinIT from "./scrapeJustJoinIT";
import { ScrapeOptions } from "../interfaces";
import { NextFunction } from "express";
import BadRequestError from "../../../errors/badRequestError";

const urls = {
  justJoinIT: "https://justjoin.it/",
  noFluffJobs: "https://nofluffjobs.com/",
  protocolIT: "https://theprotocol.it/",
  pracujPL: "https://www.pracuj.pl/",
};

class JobScraperService {
  private browser: Browser | null = null;

  async scrapeJobs(jobQuery: JobQuery, next: NextFunction) {
    await this.initBrowser();
    const jobs = await this.gatherJobs({
      jobQuery,
      next,
      url: urls.justJoinIT,
    });

    await this.closeBrowser();
    return jobs;
  }

  private async initBrowser() {
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
  }

  private async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  private async gatherJobs(scrapeOptions: ScrapeOptions) {
    const { scrapeJustJoinIt } = this.initScrapers();

    const jobs = await scrapeJustJoinIt.scrape({
      ...scrapeOptions,
      url: urls.justJoinIT,
    });

    return jobs;
  }

  private initScrapers(): { scrapeJustJoinIt: ScrapeJustJoinIT } {
    if (!this.browser)
      throw new BadRequestError({
        code: 400,
        message: "Browser not initialized",
      });
    const scrapeJustJoinIt = new ScrapeJustJoinIT(this.browser);
    return { scrapeJustJoinIt };
  }
}

const jobScraperService = new JobScraperService();

export default jobScraperService;
