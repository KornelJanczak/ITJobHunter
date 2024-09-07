import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/appError";

export const errorHandler = (
  err: AppError,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  if (err instanceof AppError) {
    const { statusCode, errors, logging } = err;
    if (logging) {
      console.error(
        JSON.stringify(
          {
            statusCode: err.statusCode,
            errors: err.errors,
            stack: err.stack,
          },
          null,
          2
        )
      );
    }

    return res.status(statusCode).send({ errors });
  }

  console.error(JSON.stringify(err, null, 2));
  return res
    .status(500)
    .send({ errors: [{ message: "Something went wrong" }] });
};
