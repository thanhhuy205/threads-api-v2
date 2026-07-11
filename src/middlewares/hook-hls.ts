import configService from '@/config/config'
import { baseLogger } from '@/middlewares/logger'
import { NextFunction, Request, Response } from 'express'

export const hookHlsHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const signature = req.headers['x-webhook-signature'] as string

    if (!signature) {
        baseLogger.warn('Missing signature in HLS webhook request')
        return res.status(400).json({ message: 'Missing signature' })
    }
    if (signature !== configService.HOOK_SECRET_KEY) {
        baseLogger.warn('Invalid signature in HLS webhook request')
        return res.status(401).json({ message: 'Invalid signature' })
    }

    next()
}