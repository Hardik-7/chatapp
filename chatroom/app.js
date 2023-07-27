const express = require('express')
const app = express()


// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
 

// import routes
const userRoutes = require('./routes/user.route')
const chatRoutes = require('./routes/chat.route')

app.use('/api/v1', userRoutes)
app.use('/api/v1', chatRoutes)

// error handler
const errorHandler = require('./middelware/errorhandler') 
app.use(errorHandler)

module.exports = app
