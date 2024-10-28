import { type JobOffer, type IDataCollector } from "../../jobScraper.interfaces";
import { type ElementHandle } from "puppeteer";
import { AbstractDataCollector } from "../abstract/abstractDataCollector";

class DataCollector
  extends AbstractDataCollector<JobOffer>
  implements IDataCollector<JobOffer>
{
  protected mapData(jobOffers: JobOffer[]): JobOffer[] {
    return jobOffers.map(
      (job) => (job = { ...job, url: `${this.pageUrl}${job.url}` })
    );
  }
  protected async extractDataFromElement(
    element: ElementHandle<Element>
  ): Promise<JobOffer> {
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
    console.log("title", title);

    return { title, location, url };
  }
}

export default DataCollector;
