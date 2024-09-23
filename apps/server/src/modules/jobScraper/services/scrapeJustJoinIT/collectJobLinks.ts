import { Page } from "puppeteer";

export const collectJobLinks = async (page: Page) => {
  // Przesuń mysz na współrzędne (100, 100)


  // console.log("Waiting for elements to be visible...");
  // await page.waitForSelector(".MuiBox-root.css-8xzgzu", {
  //   visible: true,
  //   timeout: 10000,
  // });

  const elements = await page.$$(".MuiBox-root.css-8xzgzu");

  console.log(elements, "elements");
  const jobLinks = [];

  for (const element of elements) {
    const linkHandle = await element.$("a");
    if (linkHandle) {
      const href = await page.evaluate((el) => el.href, linkHandle);
      jobLinks.push(href);
    }
  }

  console.log(jobLinks, "jobLinks");

  return jobLinks;
};
