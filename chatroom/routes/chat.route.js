const router = require('express').Router()

// import controller 
const { checkAuth } = require('../middelware/auth')
const { createRoom, listRooms, getMessages} = require('../controllers/chat.controller')

// protect route with auth

router.use(checkAuth)

router.route('/create-room').post(createRoom)
router.route('/rooms').get(listRooms)
router.route('/messages/:roomId').get(getMessages)

module.exports = router