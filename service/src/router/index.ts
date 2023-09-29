import { Router } from 'express'

const router = Router()

// public
router.use('/public', async (req, res, next) =>
    (await import('./public/index')).default(req, res, next)
)

// menu
router.use('/menu', async (req, res, next) =>
    (await import('./menu/index')).default(req, res, next)
)

export default router
