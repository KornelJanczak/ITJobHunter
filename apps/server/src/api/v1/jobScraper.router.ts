import { Router } from "express";
import { jobScraperController } from "./jobScraper.contoller";
import { validateData } from "../../common/middlewares/validateData";
import { jobQuerySchemaWithValidation } from "./jobScraper.middlewares";

const router = Router();

router.get(
  "/job-scraper",
  validateData(jobQuerySchemaWithValidation),
  jobScraperController
);

export default router;
