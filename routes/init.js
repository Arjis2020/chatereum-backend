const express = require('express')
const router = express.Router()
require('dotenv').config()
const jwt = require('jsonwebtoken')
const { v4: uuidV4 } = require('uuid')
const { users: Users } = require('../models')

router.post('/', async (req, res) => {
    const token = req.body.token || ''
    try {
        jwt.verify(token, process.env.JWT_SECRET)
        res.send({
            msg: 'Token valid',
            token
        })
    }
    catch (err) {
        if (!token) {
            res.send({
                msg: 'New token',
                token: jwt.sign({ data: uuidV4() }, process.env.JWT_SECRET, { expiresIn: '1h' })
            })
        }
        else {
            if (err instanceof jwt.TokenExpiredError) {
                res.send({
                    msg: 'Token expired',
                    token: jwt.sign({ data: uuidV4() }, process.env.JWT_SECRET, { expiresIn: '1h' })
                })
            }
            else {
                res.status(401).send({
                    msg: 'Token has to be either null or something valid.'
                })
            }
        }
    }
    await Users.bulkCreate(
        [{ ip_address: req.ip, blacklisted: false }],
        {
            updateOnDuplicate: ['ip_address'],
            returning: false
        }
    )
})

module.exports = router
