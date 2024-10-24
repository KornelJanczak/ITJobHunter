import { JobOffer, type IJobSearcher } from "../../interfaces";
import { type SearchJobOffers } from "../../interfaces";
import { AbstractJobSearcher } from "../abstract/abstractJobSearcher";
import { JobQuery } from "@repo/interfaces/job";

class JobSearcher
  extends AbstractJobSearcher
  implements IJobSearcher
{
  private path = "";
  private jobQuery: JobQuery | null = null;

  async searchJobOffers({
    page,
    jobQuery,
    path,
    next,
  }: SearchJobOffers): Promise<void> {
    this.jobQuery = jobQuery;
    this.path = path;
    this.filterJobOffers();

    try {
      await page.goto(this.path);
    } catch (err) {
      next(err);
    }
  }

  protected filterJobOffers(): void {
    this.filterLocation();
    this.filterTechStack();
    this.filterContent();
    this.filterPositionLevel();
    this.filterSalary();
    this.filterJobType();
  }

  private updateCriteria(newCriteria: string): void {
    this.path += `/${newCriteria}`;
  }

  protected filterLocation(): void {
    const defaultLocation = "all-locations";
    const { location = defaultLocation } = this.jobQuery ?? {
      location: defaultLocation,
    };
    this.updateCriteria(location);
    console.log(this.path);
  }

  protected filterTechStack(): void {
    const { techStack } = this.jobQuery ?? { techStack: undefined };
    if (!techStack) return;

    const javaScriptExist = techStack.find((tech) => tech === "js");
    if (javaScriptExist) this.updateCriteria("javascript");
    else this.updateCriteria(techStack[0]);

    console.log(this.path);
  }

  protected filterContent(): void {
    const { content } = this.jobQuery ?? { content: undefined };
    if (content) this.updateCriteria(`?keyword=${content}`);
    console.log(this.path);
  }

  protected filterPositionLevel(): void {
    const { positionLevel } = this.jobQuery ?? { positionLevel: undefined };

    const positionLevelConfig: { [key: string]: string } = {
      junior: "junior",
      senior: "senior",
      mid: "mid",
      leader: "c-level",
      manager: "c-level",
    };

    if (positionLevel)
      this.updateCriteria(
        `?experience-level=${positionLevelConfig[positionLevel]}`
      );
  }

  protected filterSalary(): void {
    const { minimumSalary, maximumSalary } = this.jobQuery ?? {};

    if (minimumSalary) this.updateCriteria(`salary_0.${minimumSalary}`);
    if (maximumSalary) this.updateCriteria(`salary_0.${maximumSalary}`);

    if (minimumSalary && maximumSalary)
      this.updateCriteria(`salary_${minimumSalary}.${maximumSalary}`);
  }

  protected filterJobType(): void {
    const { jobType, typeOfWorkplace } = this.jobQuery ?? {
      jobType: undefined,
    };
    if (!jobType) return;

    const formattedJobs = jobType.map((job) => {
      const jobsTypeConfig: { [key: string]: string } = {
        fullTime: "full-time",
        partTime: "part-time",
      };
      return jobsTypeConfig[job];
    });

    const isRemote = typeOfWorkplace === "remote";

    if (isRemote) {
      this.updateCriteria(
        `working-hours_${formattedJobs.join(".")}/remote_yes`
      );
    } else {
      this.updateCriteria(`working-hours_${formattedJobs.join(".")}`);
    }

    console.log(this.path);
  }
}

export default JobSearcher;
