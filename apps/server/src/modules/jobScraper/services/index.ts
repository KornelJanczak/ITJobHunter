import { IJobScraperService, JobOffer, ScrapeOptions } from "../interfaces";
import puppeteer, { Page } from "puppeteer";
import { Browser } from "puppeteer";
import BadRequestError from "../../../errors/badRequestError";
import NoFluffJobsScraperService from "./scrapeNoFluffJobs";

interface IMultiScraperService {
  executeScrapers(options: ScrapeOptions): Promise<any>;
}

type scraperServiceDependencies = { page: Page; options: ScrapeOptions };

class MultiSiteScraperService implements IMultiScraperService {
  private browser: Browser | null = null;
  private options: ScrapeOptions;

  constructor(options: ScrapeOptions) {
    this.options = options;
  }

  async executeScrapers(): Promise<any> {
    await this.initBrowser();

    if (!this.browser)
      throw new BadRequestError({
        message: "Browser is not initialized",
        logging: true,
        code: 400,
      });

    const page = await this.browser.newPage();
    const scraperProps = { page, options: this.options };

    const [noFluffJobsScraper] = this.createScraperServices(scraperProps);
    await noFluffJobsScraper.scrape();

    await this.waitFor(200);
    await this.closeBrowser();
  }

  private createScraperServices(
    scraperServiceDependencies: scraperServiceDependencies
  ): IJobScraperService<JobOffer>[] {
    const noFluffJobsScraper = new NoFluffJobsScraperService(
      scraperServiceDependencies
    );
    // const justJoinItScraper = new JustJoinItScraperService();
    return [noFluffJobsScraper];
  }

  private async initBrowser() {
    try {
      this.browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
      });
    } catch (err) {
      this.options.next(err);
    }
  }

  private async closeBrowser() {
    if (!this.browser) return;

    try {
      await this.browser.close();
      this.browser = null;
    } catch (err) {
      this.options.next(err);
    }
  }

  private waitFor(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default MultiSiteScraperService;
