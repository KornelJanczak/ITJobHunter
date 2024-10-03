import { Browser } from "puppeteer";
import { JustJoinITOffer, ScrapeOptions } from "../../interfaces";
import BadRequestError from "../../../../errors/badRequestError";
import { type IDataCollector } from "./dataCollector";
import { type IJobSearcher } from "./jobSearcher";
import { type IPageOpener } from "./pageOpener";

interface JustJoinITScraper {
  scrape(options: ScrapeOptions): Promise<JustJoinITOffer[]>;
}

interface ScrapeJustJoinITConfig {
  browser: Browser;
  pageOpener: IPageOpener;
  jobSearcher: IJobSearcher;
  dataCollector: IDataCollector;
}

export default class ScrapeJustJoinIT implements JustJoinITScraper {
  private browser: Browser;
  private pageOpener: IPageOpener;
  private jobSearcher: IJobSearcher;
  private dataCollector: IDataCollector;

  constructor(config: ScrapeJustJoinITConfig) {
    this.browser = config.browser;
    this.pageOpener = config.pageOpener;
    this.jobSearcher = config.jobSearcher;
    this.dataCollector = config.dataCollector;
  }

  async scrape({ url, jobQuery, next }: ScrapeOptions) {
    try {
      const page = await this.browser.newPage();
      await this.pageOpener.openPage(page, url, next);
      await this.jobSearcher.searchJobOffers({
        page,
        jobQuery,
        path: url,
        next,
      });

      return await this.dataCollector.scrollAndCollectData(page);
    } catch (err) {
      throw new BadRequestError({
        message: "Failed to scrape JustJoinIT",
        logging: true,
        code: 400,
        context: { error: err },
      });
    } finally {
      await this.browser.close();
    }
  }
}
