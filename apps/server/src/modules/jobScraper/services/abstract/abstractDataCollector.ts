import { Page } from "puppeteer";

export abstract class AbstractDataCollector<T> {
  abstract collectData(page: Page): Promise<T[]>;

  abstract scrollAndCollectData(page: Page): Promise<T[]>;

  protected waitFor(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
