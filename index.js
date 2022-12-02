const express = require('express')
const app = express()
const cluster = require('cluster')
const os = require('os')
require('dotenv').config({ encoding: 'latin1' })
const methodOverride = require('method-override')
const db = require('./src/config/db')
const cors = require('cors');
const helmet = require('helmet')
const port = process.env.APP_PORT
const path = require('path');
const adminApi = require('./src/routes/admin')
const userApi = require('./src/routes/user')

app.use(
    helmet({
        crossOriginEmbedderPolicy: false,
        // crossOriginResourcePolicy: { policy: 'cross-origin' }
    })
)

app.use(cors())
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(methodOverride('_method'))
app.use(express.json({ limit: '1mb' }))
app.use(express.static(path.join(__dirname, './src/storage')))

app.use('/api/v1/admin', adminApi())
app.use('/api/v1', userApi())

if (cluster.isMaster) {
    for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork()
    }
    cluster.on('exit', (worker, code, signal) => {
        cluster.fork()
    })
}
else app.listen(port, () => console.log(`Server - ${process.pid} http://localhost:${port}`))

// TODO:: Add A Middleware To Let Only Trusted Party In