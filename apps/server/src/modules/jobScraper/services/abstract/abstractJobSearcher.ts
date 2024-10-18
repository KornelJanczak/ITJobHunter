import { type SearchJobOffers } from "../../interfaces";
import { type Page } from "puppeteer";

export abstract class AbstractJobSearcher {
  abstract searchJobOffers({
    page,
    jobQuery,
    path,
    next,
  }: SearchJobOffers): Promise<void>;

  protected abstract filterLocation(
    path: string,
    location: string | undefined
  ): string;
  protected abstract filterTechStack(
    path: string,
    techStack: string[] | undefined
  ): string;

  protected abstract filterContent(
    path: string,
    content: string | undefined
  ): string;

  protected abstract filterPositionLevel(
    path: string,
    positionLevel: string | undefined
  ): string;

  protected abstract filterSalary(
    path: string,
    minimumSalary: number | undefined,
    maximumSalary: number | undefined
  ): string;

  // protected abstract filterJobType(
  //   path: string,
  //   jobType: string[] | undefined
  // ): string;
}
