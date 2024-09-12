import z from "zod";
import { jobQuerySchema } from "@repo/schemas/jobSchemas";

export type JobQuery = z.infer<typeof jobQuerySchema>;
