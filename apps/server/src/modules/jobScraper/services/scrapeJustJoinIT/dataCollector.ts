import { type Page } from "puppeteer";
import { type IDataCollector, type JustJoinITOffer } from "../../interfaces";
import BadRequestError from "../../../../errors/badRequestError";
import { autoScroll } from "../../helpers/autoScroll";
import { AbstractDataCollector } from "../abstract/abstractDataCollector";

class DataCollector
  extends AbstractDataCollector<JustJoinITOffer>
  implements IDataCollector<JustJoinITOffer>
{
  async collectData(page: Page): Promise<JustJoinITOffer[]> {
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

  async scrollAndCollectData(page: Page): Promise<JustJoinITOffer[]> {
    const allJobs = new Set<JustJoinITOffer>();
    let previousHeight = 0;
    let currentHeight = 0;

    while (true) {
      const data = await this.collectData(page);
      data.forEach((job) => allJobs.add(job));
      await this.waitFor(3000);

      await autoScroll(page);

      currentHeight = await page.evaluate(() => document.body.scrollHeight);
      const endOfPage = await page.$("footer");

      if (endOfPage) break;
      if (currentHeight === previousHeight) break;

      previousHeight = currentHeight;
    }

    return Array.from(allJobs);
  }
}

export const dataCollector = new DataCollector();
