import puppeteer from "puppeteer";

export const jobScraperService = async (req: Request, res: Response) => {
  //   const query = req.body.query;
  const query = "Software Engineer";
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();

  await page.goto("https://www.google.com");
  await page.type('input[name="q"]', query);
};
