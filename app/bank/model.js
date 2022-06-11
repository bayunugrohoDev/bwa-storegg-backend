const mongoose = require('mongoose')

let bankSchema = mongoose.Schema({
 
    name : {
        type : String,
        require : [true, 'nama pemilik harus diisi']
    },
    bankName : {
        type : String,
        require : [true, 'nama bank harus diisi']
    },
    noRekening : {
        type : String,
        require : [true, 'no rekening harus diisi']
    },
   
},{timestamps : true})

module.exports = mongoose.model('Bank', bankSchema)