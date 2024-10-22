import { type Page } from "puppeteer";
import {
  IDataCollector,
  JobOffer,
  type JustJoinITOffer,
} from "../../interfaces";
import BadRequestError from "../../../../errors/badRequestError";
import { autoScroll } from "../../helpers/autoScroll";
import { AbstractDataCollector } from "../abstract/abstractDataCollector";

class DataCollector
  extends AbstractDataCollector<JobOffer>
  implements IDataCollector<JobOffer>
{
  async collectData(page: Page): Promise<JobOffer[]> {
    const elements = await page.$$(".MuiBox-root.css-ai36e1");
    const jobOffers: JustJoinITOffer[] = [];

    for (const element of elements) {
      try {
        const [title, location, url] = await Promise.all([
          element.$eval("h3", (el) => el.textContent || ""),
          element.$eval(".css-1o4wo1x", (el) => el.textContent || ""),
          element.$eval("a", (el) => el.getAttribute("href") || ""),
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
      (job) => (job = { ...job, url: `https://justjoin.it${job.url}` })
    );
  }
}

export const dataCollector = new DataCollector();
