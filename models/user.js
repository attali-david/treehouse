const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String, 
        required: true, 
        unique: true,
        minlength: 3,
        maxlength: 20 
    },
    email: {
        type: String, 
        require: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
    isMember: {
        type: Boolean,
        required: false,
        default: false
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default: false
    },
    avatar: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        default: 1,
        required: true
    }
})

UserSchema.virtual('url').get(function() {
    return '/user/' + this.username
})

module.exports = mongoose.model('User', UserSchema)