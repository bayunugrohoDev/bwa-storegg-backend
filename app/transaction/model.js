const mongoose = require('mongoose')

let transactionSchema = mongoose.Schema({
    historyVoucherTopup : {
        gameName : { type : String, require: ['true', 'nama game harus diisi']},
        category : { type : String, require: ['true', 'kategori harus diisi']},
        thumbnail : { type : String },
        coinName : { type : String, require: ['true', 'nama koin harus diisi']},
        coinQuantity : { type : String, require: ['true', 'jumlah koin harus diisi']},
        price : { type : Number,},
    },
    historyPayment : {
        name : { type : String, require: ['true', 'nama harus diisi']},
        type : { type : String, require: ['true', 'tipe pembayaran harus diisi']},
        bankName : { type : String, require: ['true', 'nama bank harus diisi']},
        noRekening : { type : String, require: ['true', 'no rekening harus diisi']},
    },
    name : {
        type : String,
        require : [true, 'nama harus diisi'],
        maxLength : [225, 'panjanga harus 3 - 225 huruf'],
        minLength : [3, 'panjanga harus 3 - 225 huruf'],

    },
    accountUser : {
        type : String,
        require : [true, 'nama akun harus diisi'],
        maxLength : [225, 'panjanga harus 3 - 225 huruf'],
        minLength : [3, 'panjanga harus 3 - 225 huruf'],

    },
    tax : {
        type : Number,
        default : 0

    },
    value : {
        type : Number,
        default : 0

    },
    status : {
        type : String,
        enum : ['pending', 'status', 'success'],
        default : 'pending'
    },
    player : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Player'

    },
    historyUser : {
        name : { type : String, require: ['true', 'nama harus diisi']},
        phoneNumber : {
            type : Number,
            require : [true, 'nama akun harus diisi'],
            maxLength : [13, 'panjanga harus 9 - 13 huruf'],
            minLength : [9, 'panjanga harus 9 - 13 huruf'],
        }

    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'

    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category'

    },

},{timestamps : true})

module.exports = mongoose.model('Transaction', transactionSchema)