import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { config } from './utils/config.js'

import Router from './router/index.js'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', Router)

app.listen(config.port, () => {
    console.log(`nia-images-proxy server is running at port ${config.port}`)
})
