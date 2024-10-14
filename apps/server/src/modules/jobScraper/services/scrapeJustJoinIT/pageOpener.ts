import { type IPageOpener, type JustJoinITOffer } from "../../interfaces";
import { type Page } from "puppeteer";
import AbstractPageOpener from "../abstract/abstractPageOpener";

class PageOpener
  extends AbstractPageOpener
  implements IPageOpener<JustJoinITOffer>
{
  async executeOpenPage(page: Page, path: string): Promise<void> {
    await page.goto(path);
    await page.waitForSelector("#cookiescript_injected");
    await page.click("#cookiescript_accept");
  }
}

export const pageOpener = new PageOpener();
