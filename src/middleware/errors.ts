import { NextFunction,Request, Response } from 'express';
 const notFound=(req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error)
}

const errorsHanlder=(err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({message: err.message || "Internal Server Error"});
  }


module.exports={
    notFound,
    errorsHanlder

}