import { JobQuery } from "@repo/interfaces/job";
import puppeteer from "puppeteer";
import BadRequestError from "../../../errors/badRequestError";

export const jobScraperService = async (jobQuery: JobQuery) => {
  if (!jobQuery) throw new BadRequestError({ message: "Query is required" });

  const { content } = jobQuery;

  // const query = "Software Engineer";
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();

  await page.goto("https://www.google.com");
  await page.type('input[name="q"]', content);

  console.log(page);
};
