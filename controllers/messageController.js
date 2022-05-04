const {body, validationResult} = require('express-validator')
const Message = require('../models/message')
const User = require('../models/user')
const async = require('async')

exports.index_get = [
    (req, res, next) => {
        async.parallel({
            messages: function(callback) {
                Message.find({})
                    .exec(callback)
            }
        }, function(err, results) {
            if(err) return next(err)
            else {
                console.log(results.messages)
                res.render('index', { title: 'Treehouse', messages: results.messages})
            }
        })
    }
]

exports.message_post = [
    body('title').trim().isLength({min: 1, max: 20}).escape().withMessage('Post must have a short title'),
    body('text').trim().isLength({min: 1, max: 200}).escape().withMessage('Post must have a text between 1 and 200 characters'), 

    (req, res, next) => {
        async.parallel({
            user: function(callback) {
                User.findById(req.user._id)
                    .exec(callback)
            } 
        }, function(err, results) {
                if(err) return next(err)
                
                const errors = validationResult(req)
                
                const message = new Message({
                    title: req.body.title,
                    text: req.body.text,
                    user: results.user
                })
            
                if(!errors.isEmpty()) {
                    res.render('/profile', {title: req.body.title, text: req.body.text})
                    return
                } else {
                    message.save(function(err) {
                        if(err) return next(err)
                        res.redirect('/')
                    })
                }
        })
    }
]

exports.admin_delete = [
    (req, res, next) => {
        if(!!req.user.isAdmin) {
            async.parallel({
                function(callback) {
                    Message.findByIdAndDelete(targetMessage)
                        .exec(callback)
                }
            }, function(err) {
                if(err) return next(err)
                else {
                    res.redirect('/')
                }
            })
        } else {
            // FIX: THROW 403 ERROR
            res.redirect('/')
        }
    }
]