import { Page } from "puppeteer";

export abstract class AbstractDataCollector<T> {
  abstract collectData(page: Page): Promise<T[]>;

  protected async autoScroll(page: Page): Promise<void> {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight - window.innerHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 50);
      });
    });
  }

  protected async scrollAndCollectData(page: Page): Promise<T[]> {
    const allJobs = new Set<T>();
    let previousHeight = 0;
    let currentHeight = 0;

    while (true) {
      const data = await this.collectData(page);
      data.forEach((job) => allJobs.add(job));
      await this.waitFor(3000);

      await this.autoScroll(page);

      currentHeight = await page.evaluate(() => document.body.scrollHeight);
      const endOfPage = await page.$("footer");

      if (endOfPage) break;
      if (currentHeight === previousHeight) break;

      previousHeight = currentHeight;
    }

    return Array.from(allJobs);
  }

  protected waitFor(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
