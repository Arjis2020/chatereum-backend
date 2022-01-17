const utils = require('./utils')
const { rooms: Rooms } = require('./models')

function init(io) {
    global.io = io
    io.on('connection', (socket) => {
        //console.log(`Socket with ${socket.id} joined`)
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
                    status: 'success',
                    participants: io.sockets.adapter.rooms.get(`${room_code}`).size
                })
                socket.in(`${room_code}`).emit('room-joined', {
                    username,
                    participants: io.sockets.adapter.rooms.get(`${room_code}`).size
                })
            }
        })
        socket.on("disconnecting", async (reason) => {
            for (const room of socket.rooms) {
                if (room !== socket.id) {
                    socket.to(room).emit("user-disconnected", {
                        username: socket.nickname,
                        participants: io.sockets.adapter.rooms.get(`${room}`).size - 1
                    })
                    if (io.sockets.adapter.rooms.get(`${room}`).size - 1 === 0) {
                        await Rooms.destroy({
                            where: {
                                room_code: room
                            }
                        })
                    }
                }
            }
        })
    })
}

module.exports = { init }