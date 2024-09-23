import { NextFunction } from "express";
import { Page } from "puppeteer";
import BadRequestError from "../../../../errors/badRequestError";

export const openPage = async (
  page: Page,
  path: string,
  next: NextFunction
) => {
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
      })
    );
  }
};
