import { Router } from 'express'

const router = Router()

// login
router.use('/login', async (req, res, next) =>
    (await import('./login.js')).default(req, res, next)
)

// register
router.use('/register', async (req, res, next) =>
    (await import('./register.js')).default(req, res, next)
)

// img
router.use('/img', async (req, res, next) =>
    (await import('./img.js')).default(req, res, next)
)

export default router
