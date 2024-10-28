import { type Page, type ElementHandle } from "puppeteer";
import BadRequestError from "../../../../common/errors/badRequestError";

export abstract class AbstractDataCollector<T> {
  protected page: Page;
  protected elementsTag: string;
  protected pageUrl: string;

  constructor(page: Page, elementsTag: string, pageUrl: string) {
    this.page = page;
    this.elementsTag = elementsTag;
    this.pageUrl = pageUrl;
  }
  protected abstract extractDataFromElement(
    element: ElementHandle<Element>
  ): Promise<T>;

  async scrollAndCollectData(): Promise<T[]> {
    const allJobs = new Set<T>();
    let previousHeight = 0;
    let currentHeight = 0;

    while (true) {
      const data = await this.collectData();
      data.forEach((job) => allJobs.add(job));
      await this.waitFor(3000);

      await this.autoScroll(this.page);

      currentHeight = await this.page.evaluate(
        () => document.body.scrollHeight
      );
      const endOfPage = await this.page.$("footer");

      if (endOfPage) break;
      if (currentHeight === previousHeight) break;

      previousHeight = currentHeight;
    }

    return Array.from(allJobs);
  }

  protected waitFor(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async collectData(): Promise<T[]> {
    const elements = await this.page.$$(this.elementsTag);
    const jobOffers: T[] = [];

    for (const element of elements) {
      try {
        const extractedData = await this.extractDataFromElement(element);
        jobOffers.push({ ...extractedData });
      } catch (err) {
        throw new BadRequestError({
          code: 400,
          message: "Failed to collect data",
          logging: true,
          context: { error: err },
        });
      }
    }

    return jobOffers;
  }

  private async autoScroll(page: Page): Promise<void> {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let currentScrolledHeight = 0; // value that's currently scrolled
        const scrollingValue = 100; // 100px per scroll

        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight; // total height of the page;
          window.scrollBy(0, scrollingValue);
          currentScrolledHeight += scrollingValue; // add 100px to the current scrolled value;

          // Repeat the process until the current scrolled value is equal to the total height of the page
          if (currentScrolledHeight >= scrollHeight - window.innerHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 50);
      });
    });
  }
}
