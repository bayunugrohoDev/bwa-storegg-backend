const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const HASH_ROUND = 10;

let playerSchema = mongoose.Schema({
    email : {
        type : String,
        require : [true, 'email harus diisi']

    },
    name : {
        type : String,
        require : [true, 'name harus diisi'],
        maxLength : [225, 'panjang harus 3 - 225 huruf'],
        minLength : [3, 'panjang harus 3 - 225 huruf'],
    },
    username : {
        type : String,
        require : [true, 'username harus diisi'],
        maxLength : [225, 'panjang harus 3 - 225 huruf'],
        minLength : [3, 'panjang harus 3 - 225 huruf'],
    },
    password : {
        type : String,
        require : [true, 'password harus diisi'],
        maxLength : [225, 'panjang password max 8 huruf'],

    },
    role : {
        type : String,
        enum : ['admin', 'user'],
        default : 'user'
    },
    status : {
        type : String,
        enum : ['Y', 'N'],
        default : 'Y'
    },
    avatar : {
        type : String
    },
    fileName : {
        type : String
    },
    phoneNumber : {
        type : String,
        require : [true, 'no telp harus diisi'],
        maxLength : [13, 'panjang harus 9 - 13 huruf'],
        minLength : [9, 'panjang harus 9 - 13 huruf'],
    },
    favorite : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category'

    },
}, {timestamps : true})

playerSchema.path('email').validate(async function(value) {
    try {
        const count = await this.model('Player').countDocuments({ email : value})
        return !count;
    } catch (error) {
        throw error
    }
}, attr => `${ attr.value } sudah terdaftar`)

playerSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, HASH_ROUND)
    next()
})

module.exports = mongoose.model('Player', playerSchema)