import { SearchJobOffers } from "../../interfaces";
import BadRequestError from "../../../../errors/badRequestError";

export interface JobSearcher {
  searchJobOffers(options: SearchJobOffers): Promise<void>;
}

class DefaultJobSearcher implements JobSearcher {
  async searchJobOffers({
    page,
    jobQuery,
    path,
    next,
  }: SearchJobOffers): Promise<void> {
    const { content, techStack, positionLevel } = jobQuery;

    if (techStack) {
      const javaScriptIsThere = techStack.find((tech) => tech === "js");
      if (javaScriptIsThere) path += "/javascript";
    }

    if (content) path += `?keyword=${content}`;
    if (positionLevel) path += `/experience-level_${positionLevel}`;

    try {
      await page.goto(path);
    } catch (err) {
      next(
        new BadRequestError({
          code: 400,
          logging: true,
          message: "Failed to search for job offers by job query content",
          context: { error: err },
        })
      );
    }
  }
}

export const defaultJobSearcher = new DefaultJobSearcher();
