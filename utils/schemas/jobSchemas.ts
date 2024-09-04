import { z } from "zod";

export const jobQuerySchema = z.object({
  query: z.string(),
  category: z
    .enum(["frontend", "backend", "ui/ux", "machineLearning", "cyberSecurity"])
    .optional(),
  location: z.string().optional(),
  minimumSalary: z.number().optional(),
  maximumSalary: z.number().optional(),
  jobType: z.enum(["fullTime", "partTime", "contract", "remote"]).optional(),
  lastUpdated: z.number().optional(),
  typeOfWorkplace: z.enum(["onSite", "hybrid", "remote"]).optional(),
  positionLevel: z.enum(["junior", "senior", "leader", "manager"]).optional(),
});
