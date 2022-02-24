const utils = require('./utils')
const { rooms: Rooms, participants: Participants } = require('./models')
const { v4: uudiV4 } = require('uuid')

function init(io) {
    global.io = io
    io.on('connection', (socket) => {
        console.log(`Socket with ${socket.id} joined`)
        socket.on('join-room', async (data, callback) => {
            const { room_code, username, public_key } = data
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
                await Participants.create({
                    socket_id: socket.id,
                    room_code,
                    username,
                    public_key,
                    ip_address: socket.handshake.address
                })
                socket.join(room_code)
                const participants = await getClients(io, room_code, socket)
                callback({
                    status: 'success',
                    participants,
                    size: io.sockets.adapter.rooms.get(room_code)?.size
                })
                socket.in(`${room_code}`).emit('room-joined', {
                    username,
                    participants,
                    size: io.sockets.adapter.rooms.get(room_code)?.size
                })
            }
        })
        socket.on('private-message', ({ to, encrypted }) => {
            io.to(to).emit('new-private-message', {
                encrypted,
                from: socket.nickname,
                timestamp: new Date().getTime()
            })
        })
        socket.on('private-file', ({ to, encrypted, metadata }) => {
            io.to(to).emit('new-private-file', {
                encrypted,
                metadata,
                from: socket.nickname,
                timestamp: new Date().getTime()
            })
        })
        socket.on('typing', ({ room_code }) => {
            socket.broadcast.to(room_code).emit('user-typing', {
                username: socket.nickname
            })
        })
        socket.on('dismiss-typing', ({ room_code }) => {
            socket.broadcast.to(room_code).emit('user-dismiss-typing', null)
        })
        socket.on("disconnecting", async (reason) => {
            for (const room of socket.rooms) {
                if (room !== socket.id) {
                    const participants = await getClients(io, room, socket)
                    socket.to(room).emit("user-disconnected", {
                        username: socket.nickname,
                        participants,
                        size: io.sockets.adapter.rooms.get(room)?.size - 1
                    })
                    if (!io.sockets.adapter.rooms.get(`${room}`)?.size || io.sockets.adapter.rooms.get(`${room}`)?.size - 1 === 0) {
                        await Rooms.destroy({
                            where: {
                                room_code: room
                            }
                        })
                    }
                }
            }
            await Participants.destroy({
                where: {
                    socket_id: socket.id
                }
            })
        })
        socket.on('disconnect', (reason) => {
            console.log(`Socket with id : ${socket.id} disconnected because of ${reason}`)
        })
    })
}

function getClients(io, room_code, socket) {
    return new Promise(async (resolve, reject) => {
        try {
            const clients = io.sockets.adapter.rooms.get(room_code);
            let sockets = []

            for await (const clientId of clients) {
                //if (clientId !== socket.id) {
                const { public_key, username } = await Participants.findOne({
                    where: {
                        socket_id: clientId
                    },
                    attributes: ['public_key', 'username']
                })
                sockets.push({
                    socket_id: clientId,
                    public_key,
                    username
                })
                //}
            }
            resolve(sockets)
        }
        catch (err) {
            reject(err)
        }
    })
}

module.exports = { init }