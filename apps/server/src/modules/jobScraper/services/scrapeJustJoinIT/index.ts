import { Browser } from "puppeteer";
import { ScrapeOptions } from "../../interfaces";
import e, { NextFunction } from "express";
import { Page } from "puppeteer";
import BadRequestError from "../../../../errors/badRequestError";
import { SearchJobOffers } from "../../interfaces";
import { autoScroll } from "../../helpers/autoScroll";
import { Cluster } from "puppeteer-cluster";

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
      const jobs = await this.scrollAndCollectLinks(page);

      console.log(jobs);
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

  private async collectData(page: Page) {
    const elements = await page.$$(".MuiBox-root.css-ai36e1");

    const jobOffers = [];

    // const jobOffers = await page.evaluate(() => {
    //   // Znalezienie wszystkich elementów z ofertami pracy
    //   const offerElements = document.querySelectorAll(
    //     ".MuiBox-root.css-ai36e1"
    //   );

    //   // Mapowanie przez każdy element, aby zebrać dane
    //   return Array.from(offerElements).map((offerElement) => {
    //     const title = offerElement.querySelector("h3")?.textContent || "";

    //     return {
    //       title,
    //     };
    //   });
    // });

    for (const element of elements) {
      const title = await page.evaluate(
        (el) => el.querySelector("h3")?.textContent || "",
        element
      );

      const location = await page.evaluate(
        (el) => el.querySelector(".css-1o4wo1x")?.textContent || "",
        element
      );

      jobOffers.push({ title, location });
    }

    return jobOffers;
  }

  private async collectJobsData(page: Page): Promise<string[]> {
    const elements = await page.$$("a[target='_parent']");

    const jobLinks = [];

    for (const element of elements) {
      const href = await page.evaluate((el) => el.href, element);
      jobLinks.push(href);
    }

    return jobLinks;
  }

  private async scrollAndCollectLinks(page: Page): Promise<{}[]> {
    let allJobLinks: {}[] = [];
    let previousHeight = 0;

    while (true) {
      const jobLinks = await this.collectData(page);
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

  // private async collectJobOffersDetails(cluster: Cluster, jobLinks: string[]) {
  //   await cluster.task(async ({ page, data: jobLink }) => {
  //     await page.goto(jobLink);
  //     let isBtnDisabled = false;

  //     while (!isBtnDisabled) {
  //       await page.waitForSelector("h1");
  //     }
  //   });

  //   await cluster.queue(jobLinks);
  // }

  // private async initCluster(): Promise<Cluster> {
  //   try {
  //     return await Cluster.launch({
  //       concurrency: Cluster.CONCURRENCY_PAGE,
  //       maxConcurrency: 100,
  //       monitor: true,
  //       puppeteerOptions: {
  //         headless: false,
  //         userDataDir: "./tmp",
  //       },
  //     });
  //   } catch (err) {
  //     throw new BadRequestError({
  //       message: "Failed to initialize cluster",
  //       logging: true,
  //       code: 400,
  //       context: { error: err },
  //     });
  //   }
  // }
}
