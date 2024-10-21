import { Page } from "puppeteer";
import { JobOffer } from "../../interfaces";
import { AbstractDataCollector } from "../abstract/abstractDataCollector";
import { autoScroll } from "../../helpers/autoScroll";
import BadRequestError from "../../../../errors/badRequestError";

class DataCollector extends AbstractDataCollector<JobOffer> {
  constructor() {
    super();
  }

  async collectData(page: Page): Promise<JobOffer[]> {
    const elements = await page.$$(".posting-list-item");
    const jobOffers: JobOffer[] = [];

    for (const element of elements) {
      try {
        const [title, location, url] = await Promise.all([
          element.$eval(
            "h3.posting-title__position",
            (el) => el.textContent?.trim() || ""
          ),
          element.$eval(
            ".posting-info__location span",
            (el) => el.textContent?.trim() || ""
          ),
          (await (await element.getProperty("href")).jsonValue()) as string,
        ]);

        jobOffers.push({ title, location, url });
      } catch (err) {
        throw new BadRequestError({
          code: 400,
          message: "Failed to collect data",
          logging: true,
          context: { error: err },
        });
      }
    }

    return jobOffers.map(
      (job) => (job = { ...job, url: `https://nofluffjobs.com${job.url}` })
    );
  }
}

export const dataCollector = new DataCollector();
