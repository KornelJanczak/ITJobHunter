import { type SearchJobOffers } from "../../interfaces";

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
  ): string | void;
  protected abstract filterTechStack(
    path: string,
    techStack: string[] | undefined
  ): string | void;

  protected abstract filterContent(
    path: string,
    content: string | undefined
  ): string | void;

  protected abstract filterPositionLevel(
    path: string,
    positionLevel: string | undefined
  ): string | void;

  protected abstract filterSalary(
    path: string,
    minimumSalary: number | undefined,
    maximumSalary: number | undefined
  ): string | void;
}
