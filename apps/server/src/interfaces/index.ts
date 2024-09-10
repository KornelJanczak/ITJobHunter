import { Browser } from "puppeteer";
import { JobQuery } from "@repo/interfaces/job";

export interface ScrapeOptions {
  url: string;
  browser: Browser;
  jobQuery: JobQuery;
}
