import { Router } from "express";
import { jobScraperController } from "../controller";
import { validateData } from "../../../middlewares/validateData";
import { jobQuerySchemaWithValidation } from "../middlewares/jobQuerySchemaWithValidation";

export default (router: Router) => {
  router.get(
    "/job-scraper",
    validateData(jobQuerySchemaWithValidation),
    jobScraperController
  );
};
