import { Router } from "express";
import jobScraper from "../modules/jobScraper/routes";

const router = Router();

export default (): Router => {
  jobScraper(router);
  return router;
};
