var express = require('express');
var router = express.Router();

const user_controller = require('../controllers/userController')
const message_controller = require('../controllers/messageController')


/* GET home page. */
router.get('/', message_controller.index_get)
router.post('/delete-message-admin', message_controller.admin_delete)

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
router.post('/logout', user_controller.logout)

module.exports = router;
