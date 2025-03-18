import { Request, Response, NextFunction } from "express";

interface throwError {
  status: number;
  message: string;
  data?: any;
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.error(err.stack, req, res, next);
  try {
    const data: throwError = JSON.parse(err?.message);
    console.log(err);

    res.status(data?.status ?? 500).json(
      data ?? {
        status: 500,
        message: "Internal Server Error",
        error: true,
      }
    );
  } catch (error) {
    console.log("err?.message", err?.message);

    res.status(500).json({
      status: 500,
      message: err?.message ?? "Internal Server Error",
      error: true,
    });
  }
};

export const throwError = (data: throwError) => {
  throw new Error(JSON.stringify(data));
};
