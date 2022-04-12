var express = require('express');
var router = express.Router();

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
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Messageboard', messages: messages });
});

router.get('/new', (req, res, next) => {
  res.render('form')
})

router.post('/new', (req, res, next) => {
  try{
    messages.push({text: req.body.text, user: req.body.user, added: new Date()})
    res.redirect('/')
  } catch {
    console.log(error)
  }  
})

module.exports = router;
