import type { Request, Response, NextFunction } from 'express';
import type { ServerResponse } from 'http';

type MiddlewareLogging = (req: Request, res: Response & ServerResponse, next: NextFunction) => void;

export const middlewareLogging: MiddlewareLogging = (req, res, next) => {
        // Wait for the response to finish so we log the final status code.
        res.on('finish', () => {
                const method = req.method;
                const url = req.originalUrl ?? req.url;
                const status = res.statusCode;
                console.log(`[${new Date().toISOString()}] ${method} ${url} - ${status}`);
        });

        next();
};