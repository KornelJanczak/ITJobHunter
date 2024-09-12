import { jobQuerySchema } from "@repo/schemas/jobSchemas";

export const jobQuerySchemaWithValidation = jobQuerySchema.refine((data) =>
  Object.values(data).some((value) => value !== undefined)
);
