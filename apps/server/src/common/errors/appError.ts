export type AppErrorContent = {
  message: string;
  context?: { [key: string]: any };
};

export abstract class AppError extends Error {
  abstract readonly statusCode: number;
  abstract readonly errors: AppErrorContent[];
  abstract readonly logging: boolean;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, AppError.prototype);
  }
}
