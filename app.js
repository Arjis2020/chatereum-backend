const express = require('express')
const app = express()
const PORT = process.env.PORT || 9000
const cors = require('cors')
const db = require('./sequelize')

//CORS
app.use(cors())
app.options('*', cors())
app.use((req, res, next) => {
    res.append("Access-Control-Expose-Headers", "*")
    next()
})
app.set('trust proxy', true);
app.use(express.json())

//routes
const initRoute = require('./routes/init')
const roomRoute = require('./routes/room')
const ratingRoute = require('./routes/rating')
app.use('/api/v1/init', initRoute)
app.use('/api/v1/room', roomRoute)
app.use('/api/v1/rating', ratingRoute)

db.init((err) => {
    console.log(err.toString())
}, () => {
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server started on ${PORT}`)
    })

    //SOCKET SETUP
    const io = require('socket.io')(server, {
        cors: {
            origins: '*'
        },
        maxHttpBufferSize: 1.024e9
    })

    const socket = require('./socketHandler')
    socket.init(io)
})
