import { Page } from "puppeteer";
import { JobQuery } from "@repo/interfaces/job";
import { SearchJobOffers } from "../../interfaces";
import BadRequestError from "../../../../errors/badRequestError";

export const searchJobOffers = async ({
  page,
  jobQuery,
  path,
  next,
}: SearchJobOffers) => {
  const { content, techStack, location } = jobQuery;

  if (techStack) {
    console.log("techStack", techStack);
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
};
