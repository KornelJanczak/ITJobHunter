import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/appError";

export const errorHandler = (
  err: AppError | Error,
  _: Request,
  res: Response,
  __: NextFunction,

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

  if (err instanceof Error) {
    let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    console.error(JSON.stringify(err, null, 2));
    return res.status(statusCode).send({
      errors: [{ message: err.message, statusCode, stack: err.stack }],
    });
  }

  console.error(JSON.stringify(err, null, 2));
  return res
    .status(500)
    .send({ errors: [{ message: "Something went wrong" }] });
};
