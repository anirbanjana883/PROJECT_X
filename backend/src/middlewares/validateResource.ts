import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

const validate =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        const errors = e.issues.map((issue) => ({
          field: issue.path.join("."), // safer than index access
          message: issue.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors,
        });
      }
      next(e);
    }
  };

export default validate;
