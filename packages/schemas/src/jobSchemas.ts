import { z } from "zod";

export const jobQuerySchema = z.object({
  content: z.string().optional(),
  category: z
    .enum(["frontend", "backend", "ui/ux", "machineLearning", "cyberSecurity"])
    .optional(),
  location: z.string().optional(),
  minimumSalary: z.number().optional(),
  maximumSalary: z.number().optional(),
  jobType: z.array(z.enum(["fullTime", "partTime"])).optional(),
  typeOfWorkplace: z.enum(["onSite", "hybrid", "remote"]).optional(),
  positionLevel: z
    .enum(["junior", "mid", "senior", "leader", "manager"])
    .optional(),
  techStack: z
    .array(
      z.enum([
        "react",
        "node",
        "html",
        "php",
        "python",
        "java",
        "c#",
        "ts",
        "js",
        "c",
        "c++",
        "c#",
        "ruby",
        ".net",
      ])
    )
    .optional(),
});
