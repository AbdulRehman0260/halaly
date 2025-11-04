import type { Request, Response, NextFunction } from 'express';
import { getBearerToken, validateJWT } from '../../auth.js';
import { config } from '../../config.js';

export const middlewareAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwt.secret);
    // attach userId to the request for downstream handlers
    (req as unknown as { userId?: string }).userId = userId;
    return next();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('Auth middleware rejected request:', msg);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export default middlewareAuth;
