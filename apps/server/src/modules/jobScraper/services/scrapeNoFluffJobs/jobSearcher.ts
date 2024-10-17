import { type SearchJobOffers } from "../../interfaces";
import { AbstractJobSearcher } from "../abstract/abstractJobSearcher";

export class JobSearcher extends AbstractJobSearcher {
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
    path = this.filterJobType(path, jobType);
    console.log("filter job type", path);

    path = this.filterTechStack(path, techStack);
    path = this.filterPositionLevel(path, positionLevel);
    path = this.filterSalary(path, minimumSalary, maximumSalary);
    // path = this.filterContent(path, content);

    console.log("AFTER job searcher", path);

    await page.goto(path);
  }

  protected filterLocation(path: string, location: string | undefined): string {
    return (path += `/${location}`);
  }

  protected filterTechStack(
    path: string,
    techStack: string[] | undefined
  ): string {
    if (!techStack) return path;

    switch (techStack.length) {
      case 1:
        path += `/${techStack[0]}`;
        break;
      default:
        console.log(techStack);
        const basePath = path.split("?")[0];
        const criteria = `criteria=requirement%3D${techStack.map(encodeURIComponent).join(",")}`;
        path = `${basePath}?${criteria}`;
        break;
    }

    return path;
  }

  protected filterPositionLevel(
    path: string,
    positionLevel: string | undefined
  ): string {
    let criteria: string = "";
    let basePath = path.split("?")[0];

    switch (positionLevel) {
      case "junior":
        const seniorities = ["junior", "trainee"];
        criteria = `criteria=seniority%3D${seniorities.map(encodeURIComponent).join(",")}`;
        path = `${basePath}?${criteria}`;
        console.log("junior", path);

        break;
      default:
        if (positionLevel) {
          criteria = `criteria=seniority%3D${encodeURIComponent(positionLevel)}`;
          path = `${basePath}?${criteria}`;
        }
        break;
    }

    console.log("path", path);

    return path;
  }

  protected filterContent(path: string, content: string | undefined): string {
    const basePath = path.split("?")[0];
    const criteria = `criteria=requirement%3D${content}`;
    return `${basePath}?${criteria}`;
  }

  protected filterSalary(
    path: string,
    minimumSalary: number | undefined,
    maximumSalary: number | undefined
  ): string {
    const basePath = path.split("?")[0];
    const criteria: string[] = [];

    if (minimumSalary !== undefined)
      criteria.push(`salary%3Epln${minimumSalary}m`);

    if (maximumSalary !== undefined)
      criteria.push(`salary%3Cpln${maximumSalary}m`);

    const criteriaString =
      criteria.length > 0 ? `criteria=${criteria.join(" ")}` : "";
    return `${basePath}?${criteriaString}`;
  }

  protected filterJobType(path: string, jobType: string[] | undefined): string {
    if (!jobType) return path;
    if (jobType.length === 1) return (path += `/${jobType[0]}`);

    const basePath = path.split("?")[0];
    const criteria = `%3D${jobType.map(encodeURIComponent).join(",")}`;

    return `${basePath}?${criteria}`;
  }
}

export const jobSearcher = new JobSearcher();
