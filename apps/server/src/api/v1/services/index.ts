import {
  IJobScraperService,
  JobOffer,
  ScrapeOptions,
} from "../jobScraper.interfaces";
import puppeteer, { Page } from "puppeteer";
import { Browser } from "puppeteer";
import BadRequestError from "../../../common/errors/badRequestError";
import NoFluffJobsScraperService from "./scrapeNoFluffJobs";
import JustJoinITScraperService from "./scrapeJustJoinIT";

interface IMultiScraperService {
  executeScrapers(options: ScrapeOptions): Promise<any>;
}

type scraperServiceDependencies = {
  page: Page;
  options: ScrapeOptions;
};

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

    const page = await this.initPage(this.browser);

    if (!page)
      throw new BadRequestError({
        message: "Page is not initialized",
        logging: true,
        code: 400,
      });

    const scrapedData = await this.getJobOffers(page);

    await this.waitFor(500);
    await this.closeBrowser();

    return scrapedData;
  }

  private async getJobOffers(page: Page): Promise<JobOffer[]> {
    const scraperProps = { page, options: this.options };
    const [noFluffJobsScraper, justJoinItScraper] =
      this.createScraperServices(scraperProps);

    const noFluffJobJobsOffers = await noFluffJobsScraper.scrape();
    const justJoinItJobOffers = await justJoinItScraper.scrape();

    return [...noFluffJobJobsOffers, ...justJoinItJobOffers];
  }

  private createScraperServices(
    scraperServiceDependencies: scraperServiceDependencies
  ): IJobScraperService<JobOffer>[] {
    const noFluffJobsScraper = new NoFluffJobsScraperService(
      scraperServiceDependencies
    );

    const justJoinItScraper = new JustJoinITScraperService(
      scraperServiceDependencies
    );
    return [noFluffJobsScraper, justJoinItScraper];
  }

  private async initPage(browser: Browser): Promise<Page | undefined> {
    try {
      const page = await browser.newPage();
      // await page.setRequestInterception(true);

      // page.on("request", (request) => {
      //   if (
      //     ["image", "stylesheet", "font"].indexOf(request.resourceType()) !== -1
      //   ) {
      //     request.abort();
      //   } else {
      //     request.continue();
      //   }
      // });
      return page;
    } catch (err) {
      this.options.next(err);
    }
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
