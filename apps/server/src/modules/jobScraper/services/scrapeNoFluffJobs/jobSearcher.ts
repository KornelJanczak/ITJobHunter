import { type SearchJobOffers } from "../../interfaces";
import { AbstractJobSearcher } from "../abstract/abstractJobSearcher";

export class JobSearcher extends AbstractJobSearcher {
  async searchJobOffers({
    page,
    jobQuery,
    path,
    next,
  }: SearchJobOffers): Promise<void> {
    path = this.filterTechStack(path, jobQuery.techStack);
    await page.goto(path);

    // Implementation will go here
  }

  protected filterLocation(path: string, location: string | undefined): string {
    // Implementation will go here
    return path;
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
        const basePath = path.split("?")[0]; // Pobierz bazową część ścieżki bez parametrów
        const criteria = `criteria=requirement%3D${techStack.map(encodeURIComponent).join(",")}`;
        path = `${basePath}?${criteria}`;
        break;
    }

    return path;
  }

  protected filterContent(path: string, content: string | undefined): string {
    // Implementation will go here
    return path;
  }

  protected filterPositionLevel(
    path: string,
    positionLevel: string | undefined
  ): string {
    // Implementation will go here
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
