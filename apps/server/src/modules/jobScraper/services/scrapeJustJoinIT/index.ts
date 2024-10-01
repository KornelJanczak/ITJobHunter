import { Browser } from "puppeteer";
import { JustJoinITOffer, ScrapeOptions } from "../../interfaces";
import e, { NextFunction } from "express";
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
      const jobs = await this.scrollAndCollectData(page);
      await this.browser.close();

      return jobs;
    } catch (err) {
      throw new BadRequestError({
        message: "Failed to scrape JustJoinIT",
        logging: true,
        code: 400,
        context: { error: err },
      });
    }
  }

  private async openPage(
    page: Page,
    path: string,
    next: NextFunction
  ): Promise<void> {
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
  }: SearchJobOffers): Promise<void> {
    const { content, techStack, positionLevel } = jobQuery;

    if (techStack) {
      console.log("TECH STACK", techStack);
      const javaScriptIsThere = techStack.find((tech) => tech === "js");
      if (javaScriptIsThere) path += "/javascript";
    }

    if (content) path += `?keyword=${content}`;

    if (positionLevel) path += `/experience-level_${positionLevel}`;

    try {
      await page.goto(path);
    } catch (err) {
      next(
        new BadRequestError({
          code: 400,
          logging: true,
          message: "Failed to search for job offers by job query content",
          context: { err },
        })
      );
    }
  }

  private async collectData(page: Page): Promise<JustJoinITOffer[]> {
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
          context: { err },
        });
      }
    }

    return jobOffers;
  }

  private async scrollAndCollectData(page: Page): Promise<{}[]> {
    let allJobs: {}[] = [];
    let previousHeight = 0;
    let currentHeight = 0;

    while (true) {
      const data = await this.collectData(page);
      allJobs = [...new Set([...data, ...allJobs])];
      await this.waitFor(3000);

      await autoScroll(page);

      currentHeight = await page.evaluate(() => document.body.scrollHeight);
      const endOfPage = await page.$("footer");

      if (endOfPage) break;
      if (currentHeight === previousHeight) break;

      previousHeight = currentHeight;
    }

    return allJobs;
  }

  private waitFor(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
