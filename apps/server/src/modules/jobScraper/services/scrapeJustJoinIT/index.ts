import { Browser } from "puppeteer";
import { ScrapeOptions } from "../../interfaces";
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
      const jobs = await this.scrollAndCollectData(page, 100);

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

    for (const element of elements) {
      const title = await page.evaluate(
        (el) => el.querySelector("h3")?.textContent || "",
        element
      );

      const location = await page.evaluate(
        (el) => el.querySelector(".css-1o4wo1x")?.textContent || "",
        element
      );

      const url = await page.evaluate(
        (el) => el.querySelector("a")?.href || "",
        element
      );

      jobOffers.push({ title, location, url });
    }

    return jobOffers;
  }

  private async scrollAndCollectData(
    page: Page,
    itemTargetCount: number
  ): Promise<{}[]> {
    let allJobs: {}[] = [];
    let previousHeight: number;

    while (itemTargetCount > allJobs.length) {
      // const jobs = await this.collectData(page);
      allJobs = await this.collectData(page);

      // await autoScroll(page);

      previousHeight = await page.evaluate(() => document.body.scrollHeight);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForFunction(
        () => document.body.scrollHeight > previousHeight
      );

      

      await new Promise((resolve) => setTimeout(resolve, 1000));
      // const currentHeight = await page.evaluate(
      //   () => document.body.scrollHeight
      // );

      // if (currentHeight === previousHeight) {
      //   console.log("currentHeight", currentHeight);
      //   console.log("previousHeight", previousHeight);

      //   break;
      // }
      // previousHeight = currentHeight;
    }

    return allJobs;
  }

  // private async collectJobsData(page: Page): Promise<string[]> {
  //   const elements = await page.$$("a[target='_parent']");

  //   const jobLinks = [];

  //   for (const element of elements) {
  //     const href = await page.evaluate((el) => el.href, element);
  //     jobLinks.push(href);
  //   }

  //   return jobLinks;
  // }
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
