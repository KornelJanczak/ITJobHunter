import { type Page } from "puppeteer";

export const collectJobLinks = async (page: Page) => {
  // await page.evaluate(() => {
  //   window.scrollBy(0, window.innerHeight * 10);
  // });

  const elements = await page.$$("a[target='_parent']");

  console.log(elements, "elements");
  const jobLinks = [];

  for (const element of elements) {
    const href = await page.evaluate((el) => el.href, element);
    jobLinks.push(href);
  }

  console.log(jobLinks, "jobLinks");

  return jobLinks;
};
