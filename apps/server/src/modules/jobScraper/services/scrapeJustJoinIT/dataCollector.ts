import { ElementHandle, type Page } from "puppeteer";
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
  async extractDataFromElement(
    element: ElementHandle<Element>
  ): Promise<JobOffer> {
    const [title, location, url] = await Promise.all([
      element.$eval("h3", (el) => el.textContent || ""),
      element.$eval(".css-1o4wo1x", (el) => el.textContent || ""),
      element.$eval("a", (el) => el.getAttribute("href") || ""),
    ]);

    return { title, location, url: `https://justjoin.it${url}` };
  }

  mapData(jobOffers: JobOffer[]): JobOffer[] {
    return jobOffers.map((job) => {
      return { ...job, url: `${this.pageUrl}${job.url}` };
    });
  }
}

export default DataCollector;

// export const dataCollector = new DataCollector();
