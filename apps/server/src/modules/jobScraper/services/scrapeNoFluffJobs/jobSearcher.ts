import { type IJobSearcher } from "../../interfaces";
import { AbstractJobSearcher } from "../abstract/abstractJobSearcher";

export class JobSearcher extends AbstractJobSearcher implements IJobSearcher {
  private path: URL = new URL("https://nofluffjobs.com/pl");

  async searchJobOffers(): Promise<void> {
    this.filterJobOffers();

    try {
      await this.page.goto(this.path.toString());
    } catch (err) {
      this.next(err);
    }
  }

  private filterJobOffers(): void {
    this.filterLocation();
    this.filterTypeOfWorkplace();
    this.filterTechStack();
    this.filterPositionLevel();
    this.filterSalary();
    this.filterContent();
  }

  /**
   * Updates the criteria in the URL with new criteria.
   * @param newCriteria - The new criteria to add.
   */
  private updateCriteria(newCriteria: string): void {
    const existingCriteria = this.path.searchParams.get("criteria");
    const updatedCriteria = existingCriteria
      ? `${existingCriteria}%20${newCriteria}`
      : newCriteria;

    this.path.searchParams.set("criteria", updatedCriteria);
  }

  /**
   * Filters a generic criteria and updates the URL.
   * @param key - The key of the criteria.
   * @param value - The value of the criteria.
   */
  private filterCriteria(key: string, value?: string): void {
    if (value) {
      const newCriteria = `${key}%3D${encodeURIComponent(value)}`;
      this.updateCriteria(newCriteria);
    }
  }

  /**
   * Filters the location and updates the path.
   */
  protected filterLocation(): void {
    const { location } = this.jobQuery ?? {};
    if (location) {
      this.path.pathname += `/${location}`;
    }
  }

  /**
   * Filters the type of workplace and updates the path.
   */
  protected filterTypeOfWorkplace(): void {
    const { typeOfWorkplace, location } = this.jobQuery ?? {};

    const workplacePaths: { [key: string]: string } = {
      remote: location ? "" : "/praca-zdalna",
      hybrid: "/hybrid",
      onSite: "/fieldWork",
    };

    if (typeOfWorkplace) {
      this.path.pathname += workplacePaths[typeOfWorkplace] ?? "";
    }
  }

  /**
   * Filters the tech stack and updates the criteria.
   */
  protected filterTechStack(): void {
    const { techStack } = this.jobQuery ?? {};
    if (techStack) {
      const newCriteria = `requirement%3D${techStack
        .map((tech) => (tech === "js" ? "javascript" : tech))
        .map(encodeURIComponent)
        .join(",")}`;
      this.updateCriteria(newCriteria);
    }
  }

  /**
   * Filters the position level and updates the criteria.
   */
  protected filterPositionLevel(): void {
    const { positionLevel } = this.jobQuery ?? {};
    if (positionLevel) {
      const seniorityConfig = {
        junior: ["junior", "trainee"],
        mid: ["mid"],
        senior: ["senior"],
        leader: ["expert"],
        manager: ["expert"],
      };

      const seniorities = seniorityConfig[positionLevel] || [positionLevel];
      const newCriteria = `seniority%3D${seniorities.map(encodeURIComponent).join(",")}`;
      this.updateCriteria(newCriteria);
    }
  }

  /**
   * Filters the salary range and updates the criteria.
   */
  protected filterSalary(): void {
    const { minimumSalary, maximumSalary } = this.jobQuery ?? {};
    const criteria: string[] = [];

    if (minimumSalary !== undefined) {
      criteria.push(`salary%3Epln${minimumSalary}m`);
    }

    if (maximumSalary !== undefined) {
      criteria.push(`salary%3Cpln${maximumSalary}m`);
    }

    if (criteria.length > 0) {
      const newCriteria = criteria.join(" ");
      this.updateCriteria(newCriteria);
    }
  }

  /**
   * Filters the content and updates the criteria.
   */
  protected filterContent(): void {
    this.filterCriteria("content", this.jobQuery?.content);
  }

  /**
   * Filters the category and updates the criteria.
   */
  protected filterCategory(): void {
    this.filterCriteria("category", this.jobQuery?.category);
  }
}

export default JobSearcher;
