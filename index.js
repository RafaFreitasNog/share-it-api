const deskRoutes = require('./src/routes/desks')
const consumerRoutes = require('./src/routes/consumers')
const orderRoutes = require('./src/routes/orders')

const express = require('express')
const { urlencoded } = require('express')
const app = express()

app.listen(3001, () => console.log('ShareIt express server is running 🚀'))

app.use(express.json())
app.use(urlencoded({extended: true}))

app.use('/desks', deskRoutes)
app.use('/consumers', consumerRoutes)
app.use('/orders', orderRoutes)