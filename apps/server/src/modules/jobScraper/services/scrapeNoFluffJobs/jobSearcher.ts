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
    path = this.filterTechStack(path, techStack);
    path = this.filterPositionLevel(path, positionLevel);
    path = this.filterContent(path, content);
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
        path += `${basePath}?${criteria}`;
        break;
    }

    return path;
  }

  protected filterContent(path: string, content: string | undefined): string {
    const basePath = path.split("?")[0];
    const criteria = `criteria=requirement%3D${content}`;
    return `${basePath}?${criteria}`;
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
        path += `${basePath}?${criteria}`;
        break;
      default:
        if (positionLevel) {
          criteria = `criteria=seniority%3D${encodeURIComponent(positionLevel)}`;
          path += `${basePath}?${criteria}`;
        }
        break;
    }
    return path;
  }

  protected filterSalary(
    path: string,
    minimumSalary: number | undefined,
    maximumSalary: number | undefined
  ): string {
    // Implementation will go here
    return path;
  }

  protected filterJobType(path: string, jobType: string[] | undefined): string {
    // Implementation will go here
    return path;
  }
}

export const jobSearcher = new JobSearcher();
