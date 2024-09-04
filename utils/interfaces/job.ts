export interface JobQuery {
  query: string;
  category?:
    | "frontend"
    | "backend"
    | "ui/ux"
    | "machineLearning"
    | "cyberSecurity";
  location?: string;
  minimumSalary?: number;
  maximumSalary?: number;
  jobType?: "fullTime" | "partTime" | "contract" | "remote";
  lastUpdated?: number;
  typeOfWorkplace?: "onSite" | "hybrid" | "remote";
  positionLevel?: "junior" | "senior" | "leader" | "manager";
}
