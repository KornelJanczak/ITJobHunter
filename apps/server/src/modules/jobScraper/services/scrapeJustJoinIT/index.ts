import { Browser } from "puppeteer";
import { JustJoinITOffer, ScrapeOptions } from "../../interfaces";
import BadRequestError from "../../../../errors/badRequestError";
import { type DataCollector } from "./defaultDataCollector";
import { type JobSearcher } from "./defaultJobSearcher";
import { type PageOpener } from "./defaultPageOpener";

interface JustJoinITScraper {
  scrape(options: ScrapeOptions): Promise<JustJoinITOffer[]>;
}

interface ScrapeJustJoinITConfig {
  browser: Browser;
  pageOpener: PageOpener;
  jobSearcher: JobSearcher;
  dataCollector: DataCollector;
}

export default class ScrapeJustJoinIT implements JustJoinITScraper {
  private browser: Browser;
  private pageOpener: PageOpener;
  private jobSearcher: JobSearcher;
  private dataCollector: DataCollector;

  constructor(config: ScrapeJustJoinITConfig) {
    this.browser = config.browser;
    this.pageOpener = config.pageOpener;
    this.jobSearcher = config.jobSearcher;
    this.dataCollector = config.dataCollector;
  }

  async scrape({ url, jobQuery, next }: ScrapeOptions) {
    try {
      console.log(jobQuery, "JobQuery");
      const { location } = jobQuery;
      const page = await this.browser.newPage();
      let path = `${url}/${location ? location : "all-locations"}`;

      await this.pageOpener.openPage(page, path, next);
      await this.jobSearcher.searchJobOffers({ page, jobQuery, path, next });
      const jobs = await this.dataCollector.scrollAndCollectData(page);
      await this.browser.close();

      return jobs;
    } catch (err) {
      throw new BadRequestError({
        message: "Failed to scrape JustJoinIT",
        logging: true,
        code: 400,
        context: { error: err },
      });
    }
  }
}
