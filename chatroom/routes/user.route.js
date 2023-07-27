const router = require('express').Router()

// export controller 
const { signup, signin } = require('../controllers/auth.controller')

router.route('/signup').post(signup)
router.route('/signin').post(signin)

module.exports = router