import { Router } from "express";
import { jobScraperController } from "../controller";
import { validateData } from "../../../middlewares/validateData";
import { jobQuerySchema } from "@repo/schemas/src/jobSchemas";

export default (router: Router) => {
  router.get(
    "/job-scraper",
    validateData(jobQuerySchema)
    // jobScraperController
  );
};
