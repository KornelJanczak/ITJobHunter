import { Browser } from "puppeteer";
import { ScrapeOptions } from "../../interfaces";
import { NextFunction } from "express";
import { Page } from "puppeteer";
import BadRequestError from "../../../../errors/badRequestError";
import { SearchJobOffers } from "../../interfaces";
import { autoScroll } from "../../helpers/autoScroll";

export default class ScrapeJustJoinIT {
  private browser: Browser;

  constructor(browser: Browser) {
    this.browser = browser;
  }

  async scrape({ url, jobQuery, next }: ScrapeOptions) {
    try {
      console.log(jobQuery, "JobQuery");
      const { location } = jobQuery;
      const page = await this.browser.newPage();
      let path = `${url}/${location ? location : "all-locations"}`;

      await this.openPage(page, path, next);
      await this.searchJobOffers({ page, jobQuery, path, next });
      const jobLinks = await this.scrollAndCollectLinks(page);

      console.log(jobLinks, "JobLinks Final");

      return jobLinks;
    } catch {}
  }

  private async openPage(page: Page, path: string, next: NextFunction) {
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
  }

  private async searchJobOffers({
    page,
    jobQuery,
    path,
    next,
  }: SearchJobOffers) {
    const { content, techStack } = jobQuery;

    if (techStack) {
      console.log("TECH STACK", techStack);
      const javaScriptIsThere = techStack.find((tech) => tech === "js");
      if (javaScriptIsThere) path += "/javascript";
    }

    if (content) path += `?keyword=${content}`;

    try {
      await page.goto(path);
    } catch (err) {
      next(
        new BadRequestError({
          code: 400,
          logging: true,
          message: "Failed to search for job offers by job query content",
        })
      );
    }
  }

  private async collectJobLinks(page: Page) {
    const elements = await page.$$("a[target='_parent']");

    const jobLinks = [];

    for (const element of elements) {
      const href = await page.evaluate((el) => el.href, element);
      jobLinks.push(href);
    }

    return jobLinks;
  }

  private async scrollAndCollectLinks(page: Page) {
    let allJobLinks: string[] = [];
    let previousHeight = 0;

    while (true) {
      const jobLinks = await this.collectJobLinks(page);
      allJobLinks = [...new Set([...allJobLinks, ...jobLinks])];

      await autoScroll(page);

      const currentHeight = await page.evaluate(
        () => document.body.scrollHeight
      );
      if (currentHeight === previousHeight) {
        break;
      }
      previousHeight = currentHeight;
    }

    return allJobLinks;
  }

  private async collectJobOffersDetails(page: Page, jobLinks: string[]) {}
}
