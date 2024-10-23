import { JobQuery } from "@repo/interfaces/job";
import { ScrapeOptions } from "../interfaces";
import puppeteer from "puppeteer";
import { NextFunction } from "express";
import { Browser } from "puppeteer";
import BadRequestError from "../../../errors/badRequestError";
import NoFluffJobsScraperService from "./scrapeNoFluffJobs";

interface IMultiScraperService {
  scrapeJobs(options: ScrapeOptions): Promise<any>;
}

class MultiSiteScraperService implements IMultiScraperService {
  private browser: Browser | null = null;

  async scrapeJobs(options: ScrapeOptions): Promise<any> {
    await this.initBrowser();

    if (!this.browser)
      throw new BadRequestError({
        message: "Browser is not initialized",
        logging: true,
        code: 400,
      });

    const page = await this.browser.newPage();

    const noFluffJobsScraper = new NoFluffJobsScraperService({ page, options });
  }

  // private async gatherJobs(scrapeOptions: ScrapeOptions) {
  // const justJoinItJobs = await scrapeJustJoinIT.scrape({
  //   ...scrapeOptions,
  // });
  // const noFluffJobs = await scrapeNoFluffJobs.scrape({
  //   ...scrapeOptions,
  // });
  // const jobs = [];
  // return jobs;
  // }

  private processScrapeJobs() {}

  private async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
      });
    }
  }

  private async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

const jobScraperService = new MultiSiteScraperService();
export default jobScraperService;
