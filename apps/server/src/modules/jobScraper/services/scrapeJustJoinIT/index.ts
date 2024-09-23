import { Browser } from "puppeteer";
import { ScrapeOptions } from "../../interfaces";
import { openPage } from "./openPage";
import { searchJobOffers } from "./searchJobOffers";
import { collectJobLinks } from "./collectJobLinks";

export const scrapeJustJoinIT = async ({
  url,
  browser,
  jobQuery,
  next,
}: ScrapeOptions) => {
  try {
    console.log(jobQuery, "JobQuery");
    let jobs;
    const { content, techStack, location } = jobQuery;
    const page = await browser.newPage();
    let path = `${url}/${location ? location : "all-locations"}`;

    await openPage(page, path, next);
    await searchJobOffers({ page, jobQuery, path, next });
    await collectJobLinks(page);

    
  } catch {}
};
