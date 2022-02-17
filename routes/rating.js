const express = require('express')
const router = express.Router()
require('dotenv').config()
const jwt = require('jsonwebtoken')
const { v4: uuidV4 } = require('uuid')
const { ratings: Ratings } = require('../models')

router.post('/', async (req, res) => {
    try {
        const { username, rating, review } = req.body
        await Ratings.create({
            username,
            rating,
            review
        })
        res.send({
            status: 'success'
        })
    }
    catch (err) {
        res.status(500).send({
            status: 'failed'
        })
    }
})

module.exports = router