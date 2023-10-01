import { Router } from 'express'

import { getMenu } from './../../utils/menu.js'

import type { Request } from './../../types/express.js'

const router = Router()

router.get('/', async (req: Request, res) => {
    const menu = await getMenu(req.user.uid)
    res.send({
        status: 200,
        msg: '菜单获取成功',
        data: {
            menu
        }
    })
})

export default router
