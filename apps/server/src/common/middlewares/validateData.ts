import { NextFunction, Request, Response } from "express";
import { z, ZodError, ZodEffects, ZodObject } from "zod";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/badRequestError";

export const validateData = (
  schema: z.ZodObject<any> | ZodEffects<ZodObject<any>>
) => {
  return (req: Request, _: Response, next: NextFunction) => {
    try {
      console.log(req.body, "query data");

      const result = schema.parse(req.body);

      req.jobQuery = result;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.error(error);
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
