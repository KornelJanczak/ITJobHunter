import { Page } from "puppeteer";
import BadRequestError from "../../../../errors/badRequestError";
import { NextFunction } from "express";

export interface PageOpener {
  openPage(page: Page, path: string, next: NextFunction): Promise<void>;
}

class DefaultPageOpener implements PageOpener {
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

export const defaultPageOpener = new DefaultPageOpener();
