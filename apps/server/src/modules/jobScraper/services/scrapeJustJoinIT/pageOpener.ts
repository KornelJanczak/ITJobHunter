import { type IPageOpener, type JustJoinITOffer } from "../../interfaces";
import { type NextFunction } from "express";
import { type Page } from "puppeteer";
import BadRequestError from "../../../../errors/badRequestError";

class PageOpener implements IPageOpener<JustJoinITOffer> {
  async openPage(page: Page, path: string, next: NextFunction): Promise<void> {
    try {
      await page.goto(path);
      await page.waitForSelector("#cookiescript_injected");
      await page.click("#cookiescript_accept");
    } catch (err) {
      next(
        new BadRequestError({
          code: 400,
          message: "Failed to open page",
          logging: true,
          context: { error: err },
        })
      );
    }
  }
}

export const pageOpener = new PageOpener();
