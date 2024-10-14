import { Page } from "puppeteer";
import { JobOffer } from "../../interfaces";
import { AbstractDataCollector } from "../abstract/abstractDataCollector";

class DataCollector extends AbstractDataCollector<JobOffer> {
  constructor() {
    super();
  }

  async scrollAndCollectData(page: Page): Promise<JobOffer[]> {
    throw new Error("Method not implemented.");
  }

  async collectData(page: Page): Promise<JobOffer[]> {
    throw new Error("Method not implemented.");
  }
}

export const dataCollector = new DataCollector();
