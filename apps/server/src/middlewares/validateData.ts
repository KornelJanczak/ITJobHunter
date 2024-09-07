import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/badRequestError";
import { JobQuery } from "@repo/interfaces/job";

export const validateData = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);

      schema.parse(req.body);
      const result: JobQuery = { ...req.body };
      req.jobQuery = result;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestError({
          message: "Invalid data",
          context: error.errors.map((issue: any) => ({
            message: `${issue.path.join(".")} is ${issue.message}`,
          })),
          code: StatusCodes.BAD_REQUEST,
        });
      } else {
        throw new BadRequestError({
          message: "Something went wrong",
          code: StatusCodes.INTERNAL_SERVER_ERROR,
        });
      }
    }
  };
};
