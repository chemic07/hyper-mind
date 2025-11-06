import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1] || authHeader;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY!, {
      algorithms: ["RS256"],
    });

    const userId = decoded.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.userId = userId.toString(); // ✅ type-safe
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
