const randomizer = require('randomatic')
var toonavatar = require('cartoon-avatar')

function generateRoomId() {
    return randomizer('A0', 6)
}

function generateAvatarUrl(){
    return toonavatar.generate_avatar()
}

module.exports = { generateRoomId, generateAvatarUrl }