import { ElementHandle } from "puppeteer";
import { IDataCollector, JobOffer } from "../../jobScraper.interfaces";
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

    console.log("title", title);

    return { title, location, url: `https://justjoin.it${url}` };
  }


}

export default DataCollector;
