const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const Player = require('../player/model')

module.exports = {
    isLoginAdmin : (req, res, next) => {
        if(req.session.user === null || req.session.user === undefined ) {
            req.flash('alertMessage', 'mohon maaf session habis, silahkan login kembali')
            req.flash('alertStatus', 'danger')
            res.redirect('/')
        } else {
            next()
        }
    },
    isLoginUser : async(req, res, next) => {
        try {
            const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null ;
            
            const data  = jwt.verify(token, config.jwtKey)

            const player = await Player.findOne({_id : data.player.id})
            // console.log(player._id);

            if(!player) {
                throw new Error()
            }

            req.player = player
            req.token = token
            next()
        } catch (error) {
            res.status(401).json({
                error : `No Authorize to access this page || ${error.message}`
            })
        }
    },
    
}