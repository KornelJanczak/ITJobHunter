import { JobQuery } from "@repo/interfaces/job";
import { type SearchJobOffers } from "../../interfaces";
import { AbstractJobSearcher } from "../abstract/abstractJobSearcher";

export class JobSearcher extends AbstractJobSearcher {
  private jobQuery: JobQuery | null = null;
  private path: string = "";

  async searchJobOffers({
    page,
    jobQuery,
    path,
    next,
  }: SearchJobOffers): Promise<void> {
    this.jobQuery = jobQuery;
    this.path = path;

    this.path = this.filterLocation();
    this.path = this.filterTypeOfWorkplace();
    this.path = this.filterTechStack();
    this.path = this.filterPositionLevel();
    this.path = this.filterSalary();
    this.path = this.filterContent();

    try {
      await page.goto(this.path);
    } catch (err) {
      next(err);
    }
  }
  protected filterLocation(): string {
    const { location } = this.jobQuery ?? {};
    return (this.path += location ? `/${location}` : "");
  }

  protected filterTypeOfWorkplace(): string {
    const { typeOfWorkplace, location } = this.jobQuery ?? {};

    const workplacePaths: { [key: string]: string } = {
      remote: location ? "" : "/praca-zdalna",
      hybrid: "/hybrid",
      onSite: "/fieldWork",
    };

    return (this.path += typeOfWorkplace
      ? (workplacePaths[typeOfWorkplace] ?? this.path)
      : "");
  }

  protected filterTechStack(): string {
    const { techStack } = this.jobQuery ?? {};
    if (!techStack) return this.path;

    const newCriteria = `requirement%3D${techStack.map(encodeURIComponent).join(",")}`;
    this.path = this.updateCriteria(newCriteria);

    return this.path;
  }

  protected filterPositionLevel(): string {
    const { positionLevel } = this.jobQuery ?? {};
    if (!positionLevel) return this.path;

    const seniorityConfig = {
      junior: ["junior", "trainee"],
      mid: ["mid"],
      senior: ["senior"],
      leader: ["expert"],
      manager: ["expert"],
    };

    const seniorities = seniorityConfig[positionLevel] || [positionLevel];
    const newCriteria = `seniority%3D${seniorities.map(encodeURIComponent).join(",")}`;
    this.path = this.updateCriteria(newCriteria);

    return this.path;
  }

  protected filterContent(): string {
    const { content } = this.jobQuery ?? {};
    if (!content) return this.path;

    const newCriteria = `content%3D${encodeURIComponent(content)}`;
    this.path = this.updateCriteria(newCriteria);

    return this.path;
  }

  protected filterSalary(): string {
    const { minimumSalary, maximumSalary } = this.jobQuery ?? {};
    const criteria: string[] = [];

    if (minimumSalary !== undefined)
      criteria.push(`salary%3Epln${minimumSalary}m`);

    if (maximumSalary !== undefined)
      criteria.push(`salary%3Cpln${maximumSalary}m`);

    const newCriteria = criteria.join(" ");
    this.path = this.updateCriteria(newCriteria);

    return this.path;
  }

  private updateCriteria(newCriteria: string): string {
    const basePath = this.path.split("?")[0];
    const existingCriteria = new URLSearchParams(this.path.split("?")[1]);

    const criteria = existingCriteria.get("criteria");
    const updatedCriteria = criteria
      ? `${criteria}%20${newCriteria}`
      : newCriteria;

    existingCriteria.set("criteria", updatedCriteria);
    return `${basePath}?${existingCriteria.toString()}`;
  }
}

export const jobSearcher = new JobSearcher();
