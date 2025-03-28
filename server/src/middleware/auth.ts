import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  email: string;
  id: number;
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // eliminating the institutions/get route from auth since it's just pulling data for the onboarding page
  if (req.path === "/plaid/institutions/get") {
    return next();
  }
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const secretKey = process.env.JWT_SECRET_KEY || "";

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403); // forbidden status
      }
      req.user = user as JwtPayload;
      return next();
    });
  } else {
    res.sendStatus(401); // unauthorized status
  }
};
