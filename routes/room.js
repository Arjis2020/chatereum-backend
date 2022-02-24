const express = require('express')
const router = express.Router()
const { rooms: Rooms, participants: Participants } = require('../models')

router.get('/details', async (req, res) => {
    const room_code = req.query.room_code
    if (room_code) {
        const room = await Rooms.findOne({
            where: {
                room_code
            },
            include: {
                model: Participants,
                attributes: ['public_key', 'username', 'socket_id']
            }
        })
        if (room)
            return res.send({
                status: 'success',
                room
            })
        else
            return res.status(404).send({
                status: 'failed',
                msg: 'No room found'
            })
    }
    else {
        return res.status(500).send({
            status: 'invalid',
            msg: 'Room code is required'
        })
    }
})

router.post('/create', async (req, res) => {
    const { room_code, room_name, room_avatar } = req.body
    const room = await Rooms.findOne({
        where: {
            room_code
        }
    })

    if (!room) {
        await Rooms.create({
            room_code,
            room_name,
            //room_admin_id: socket.id,
            room_avatar
        })
        return res.send({
            status: 'success',
            room_code,
            room_name,
            //username,
            room_avatar
        })
    }
    else {
        return res.status(500).send({
            status: 'error',
            msg: 'Room already exists'
        })
    }
})

module.exports = router
