import { Browser } from "puppeteer";
import { ScrapeOptions } from "../../../interfaces";

export const scrapeJustJoinIT = async ({
  url,
  browser,
  jobQuery,
}: ScrapeOptions) => {
  try {
    console.log(jobQuery, "JobQuery");
    let jobs;
    const { content, techStack, location } = jobQuery;
    const page = await browser.newPage();
    let path = `${url}/${location ? location : "all-locations"}`;
    await page.goto(path);

    await page.waitForSelector("#cookiescript_injected");
    await page.click("#cookiescript_accept");
    await page.waitForSelector('input[placeholder="Search"]');

    if (content) {
      await page.type('input[placeholder="Search"]', content);
      await page.keyboard.press("Enter");
    }

    await page.waitForSelector(".offer_list_offer_link");

    if (techStack) {
      console.log("techStack", techStack);

      const jobLinks = await page.evaluate(() => {
        console.log("EVALUATE");

        const links = Array.from(
          document.querySelectorAll(".offer_list_offer_link")
        );

        console.log(jobLinks, "LINKS");
        return links;
      });

      console.log("jobLinks", jobLinks);

      const maxConcurrentPages = 5;
      const jobDataPromises = [];

      for (let i = 0; i < jobLinks.length; i += maxConcurrentPages) {
        console.log(jobLinks[i], "LINK");
      }
    }
  } catch {}
};
