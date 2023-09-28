import { Router } from 'express'

const router = Router()

// public
router.use('/public', async (req, res, next) =>
    (await import('./public/index')).default(req, res, next)
)

export default router
