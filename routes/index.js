var express = require('express');
var router = express.Router();

const user_controller = require('../controllers/userController')
const message_controller = require('../controllers/messageController')

const messages = [
  {
    text: 'Hi there!',
    user: "Amanda",
    added: new Date()
  },
  {
    text: 'Hello World!',
    user: 'Charles',
    added: new Date()
  }
]

/* GET home page. */
router.get('/', message_controller.index_get)

//  login page
router.get('/login', function(req, res, next) {
  res.render('login_form')
})
router.post('/login', user_controller.login_post)


//  register page
router.get('/register', function(req, res, next) {
  res.render('register_form')
})
router.post('/register', user_controller.register_post)

// profile
router.get('/profile', user_controller.profile_get)
router.post('/code', user_controller.code_post)
router.post('/admincode', user_controller.admincode_post)
router.post('/message', message_controller.message_post)
router.post('/delete-message', user_controller.delete_message)

module.exports = router;
