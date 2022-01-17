const utils = require('./utils')
const { rooms: Rooms } = require('./models')

function init(io) {
    global.io = io
    io.on('connection', (socket) => {
        console.log(`Socket with ${socket.id} joined`)
        socket.on('join-room', async (data, callback) => {
            const { room_code, username } = data
            socket.nickname = username
            const room = await Rooms.findOne({
                where: {
                    room_code
                }
            })
            if (!room) {
                callback({
                    status: 'error',
                    msg: 'Room doesn\'t exist.'
                })
            }
            else {
                socket.join(`${room_code}`)
                callback({
                    status: 'success'
                })
                socket.in(`${room_code}`).emit('room-joined', {
                    username
                })
            }
        })
        socket.on("disconnecting", (reason) => {
            for (const room of socket.rooms) {
                if (room !== socket.id) {
                    socket.to(room).emit("user-disconnected", socket.nickname);
                }
            }
        })
    })
}

module.exports = { init }