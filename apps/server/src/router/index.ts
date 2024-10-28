import { Router } from "express";
import v1Router from "../api/v1/jobScraper.router";

const router = Router();

router.use("/v1", v1Router);

export default router;
