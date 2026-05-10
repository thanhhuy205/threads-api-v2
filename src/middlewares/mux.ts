import configService from '@/config/config'
import { baseLogger } from '@/middlewares/logger'
import crypto from 'crypto'
import { NextFunction, Request, Response } from 'express'

export const muxHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {

    const signature = req.headers['mux-signature'] as string

    if (!signature) {
        return res.status(400).json({
            message: 'Missing mux-signature',
        })
    }

    const rawBody = req.body.toString('utf8')

    const secret = configService.MUX_HOOK_SECRET
    const parts = signature.split(',')

    const timestamp = parts[0].split('=')[1]
    const hash = parts[1].split('=')[1]


    baseLogger.info(`Received Mux webhook with raw body: ${JSON.stringify(parts.join(','))}`)
    baseLogger.info(`Extracted timestamp: ${timestamp}, hash: ${hash}`)

    if (!timestamp || !hash) {
        return res.status(400).json({
            message: 'Invalid mux-signature format',
        })
    }
    // docs mux signature verification: https://docs.mux.com/guides/video/webhooks#verifying-webhooks
    const signedPayload = `${timestamp}.${rawBody}`

    // HMAC-SHA256
    const expected = crypto
        .createHmac('sha256', secret)
        .update(signedPayload)
        .digest('hex')

    baseLogger.info(`Computed expected hash: ${expected}`)
    baseLogger.info(`Received hash: ${hash}`)
    if (expected !== hash) {
        return res.status(401).json({
            message: 'Invalid signature',
        })
    }

    baseLogger.info('Mux webhook signature verified successfully')

    req.body = JSON.parse(rawBody)
    next()
}