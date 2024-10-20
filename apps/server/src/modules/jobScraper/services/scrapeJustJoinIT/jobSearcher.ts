import { JobOffer, type IJobSearcher } from "../../interfaces";
import { type JustJoinITOffer, type SearchJobOffers } from "../../interfaces";
import BadRequestError from "../../../../errors/badRequestError";
import { AbstractJobSearcher } from "../abstract/abstractJobSearcher";
import { Page } from "puppeteer";
import { JobQuery } from "@repo/interfaces/job";

class JobSearcher
  extends AbstractJobSearcher
  implements IJobSearcher<JobOffer>
{
  private path = "https://justjoin.it/";
  private jobQuery: JobQuery | null = null;

  async searchJobOffers({
    page,
    jobQuery,
    path,
    next,
  }: SearchJobOffers): Promise<void> {
    const {
      content,
      techStack,
      positionLevel,
      minimumSalary,
      maximumSalary,
      jobType,
      location,
    } = jobQuery;

    this.jobQuery = jobQuery;
    this.path = path;

    this.filterLocation();
    this.filterTechStack();
    this.filterContent();
    this.filterPositionLevel();
    path = this.filterSalary(path, minimumSalary, maximumSalary);
    path = this.filterJobType(path, jobType);

    try {
      console.log(page);

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

  private updateCriteria(newCriteria: string): void {
    // Future potential error reason
    this.path += `/${newCriteria}`;
  }

  protected filterLocation(): void {
    const defaultLocation = "all-locations";
    const { location = defaultLocation } = this.jobQuery ?? {
      location: defaultLocation,
    };
    this.updateCriteria(location);
  }

  protected filterTechStack(): void {
    const { techStack } = this.jobQuery ?? { techStack: undefined };
    if (!techStack) return;

    const javaScriptExist = techStack.find((tech) => tech === "js");
    if (javaScriptExist) this.updateCriteria("javascript");

    this.updateCriteria(techStack[0]);
  }

  protected filterContent(): void {
    const { content } = this.jobQuery ?? { content: undefined };
    if (content) this.updateCriteria(`?keyword=${content}`);
  }

  protected filterPositionLevel(): void {
    const { positionLevel } = this.jobQuery ?? { positionLevel: undefined };
    if (positionLevel) this.updateCriteria(positionLevel);
  }

  protected filterSalary(
    path: string,
    minimumSalary: number | undefined,
    maximumSalary: number | undefined
  ): string {
    if (minimumSalary) path += `/salary_${minimumSalary}.10000`;
    if (maximumSalary) path += `/salary_0.${maximumSalary}`;
    if (minimumSalary && maximumSalary)
      path += `/salary_${minimumSalary}.${maximumSalary}`;
    return path;
  }

  protected filterJobType(path: string, jobType: string[] | undefined): string {
    if (jobType) {
      const formattedJobs = jobType.map((job) => {
        if (job === "fullTime") return "full-time";
        if (job === "partTime") return "part-time";
        return job;
      });
      const isRemote = formattedJobs.find((job) => job === "remote");
      if (isRemote) {
        path += `/working-hours_${formattedJobs.join(".")}/remote_yes`;
      } else {
        path += `/working-hours_${formattedJobs.join(".")}`;
      }
    }
    return path;
  }
}

export const jobSearcher = new JobSearcher();
