import { type NextFunction } from "express";
import { type Page } from "puppeteer";
import BadRequestError from "../../../../errors/badRequestError";

export default abstract class AbstractPageOpener {
  async openPage(page: Page, path: string, next: NextFunction): Promise<void> {
    try {
      this.executeOpenPage(page, path);
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

  protected abstract executeOpenPage(page: Page, path: string): Promise<void>;
}
