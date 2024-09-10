import { JobQuery } from "@repo/interfaces/job";
import puppeteer from "puppeteer-extra";
import { Browser, executablePath } from "puppeteer";
import BadRequestError from "../../../errors/badRequestError";
import stealhPlugin from "puppeteer-extra-plugin-stealth";
import { Cluster } from "puppeteer-cluster";
import fs from "fs";
import { scrapeJustJoinIT } from "./scrapeJustJoinIT";
import { ScrapeOptions } from "../../../interfaces";

export const jobScraperService = async (jobQuery: JobQuery) => {
  const urls = {
    justJoinIT: "https://justjoin.it/",
    noFluffJobs: "https://nofluffjobs.com/",
    protocolIT: "https://theprotocol.it/",
    pracujPL: "https://www.pracuj.pl/",
  };

  const { content } = jobQuery;

  console.log("scraper");

  const browser: Browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const scrapeOptions: ScrapeOptions = {
    url: urls.justJoinIT,
    browser,
    jobQuery,
  };

  await scrapeJustJoinIT(scrapeOptions);

  // puppeteer.use(stealhPlugin());

  // const browser = await puppeteer.launch({
  //   headless: false,
  //   executablePath: executablePath(),
  // });

  // const page = await browser.newPage();

  // await page.goto("https://www.google.com");
  // await page.waitForSelector('button[aria-label="Zaakceptuj wszystko"]');
  // await page.click('button[aria-label="Zaakceptuj wszystko"]');
  // await page.click('input[name="q"]');
  // await page.type('input[name="q"]', content);

  // console.log(page);
};
