const mongoose = require('mongoose')
const {urlDB} =  require('../config')

console.log(urlDB)

mongoose.connect(urlDB, 
{
    useUnifiedTopology:true,
    useFindAndModify : true,
    useCreateIndex : true,
    useNewUrlParser : true
})

const db = mongoose.connection

module.exports = db;