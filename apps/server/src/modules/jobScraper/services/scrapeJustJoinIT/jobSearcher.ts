import { type IJobSearcher } from "../../interfaces";
import { type JustJoinITOffer, type SearchJobOffers } from "../../interfaces";
import BadRequestError from "../../../../errors/badRequestError";

class JobSearcher implements IJobSearcher<JustJoinITOffer> {
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

    path = this.filterLocation(path, location);
    path = this.filterTechStack(path, techStack);
    path = this.filterContent(path, content);
    path = this.filterPositionLevel(path, positionLevel);
    path = this.filterSallary(path, minimumSalary, maximumSalary);
    path = this.filterJobType(path, jobType);

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

  private filterLocation(path: string, location: string | undefined): string {
    if (location) {
      path += `/${location}`;
    } else {
      path += "/all-locations";
    }
    return path;
  }

  private filterTechStack(
    path: string,
    techStack: string[] | undefined
  ): string {
    if (techStack) {
      const javaScriptIsThere = techStack.find((tech) => tech === "js");
      if (javaScriptIsThere) path += "/javascript";
    }

    console.log("TECH STACK", path);

    return path;
  }

  private filterContent(path: string, content: string | undefined): string {
    if (content) path += `?keyword=${content}`;
    return path;
  }

  private filterPositionLevel(
    path: string,
    positionLevel: string | undefined
  ): string {
    if (positionLevel) path += `/experience-level_${positionLevel}`;

    console.log("Position LEVEL", positionLevel);

    return path;
  }

  private filterSallary(
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

  private filterJobType(path: string, jobType: string[] | undefined): string {
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
