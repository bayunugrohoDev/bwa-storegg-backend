const Player = require('../player/model')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config')
module.exports = {
    signup :  async(req, res, next) => {
        try {
            const payload = req.body  

            if(req.file ) {
                let tmp_path = req.file.path;
                let originaExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename + '.' + originaExt;
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`)
                // console.log(target_path)
                const src = fs.createReadStream(tmp_path)
                const dest = fs.createWriteStream(target_path)

                src.pipe(dest)

                src.on('end', async () => {
                    try {
                        const player = new Player({...payload, avatar : filename})
                        await player.save()
                        delete player._doc.password // ??
                        res.status(201).json({ data : player })

                    } catch (err) {
                        if(error && error.name === 'validationError') {
                            res.status(422).json({
                                message : error.message,
                                fields : error.errors
                            })
                        }
                        next()
                    }
                })
            }else {
                    let player = new Player(payload)
                    await player.save()
                    delete player._doc.password // ??
                    res.status(201).json({ data : player })
            }

        } catch (error) {
            if(error && error.name === 'validationError') {
                res.status(422).json({
                    message : error.message,
                    fields : error.errors
                })
            }
            res.status(500).json({message : error.message || `internal server error`})
        }
    },
    signin : async(req, res, next) => {
        const { email, password } = req.body 

        Player.findOne({ email : email}).then((player) => {

            if(player) {
                const checkPassword = bcrypt.compareSync(password, player.password)
                if(checkPassword) {
                    const token = jwt.sign({
                        player : {
                            id : player.id,
                            username : player.username,
                            email : player.email,
                            nama : player.nama,
                            phoneNumber : player.phoneNumber,
                            avatar : player.avatar,
                        }
                    }, config.jwtKey)

                    res.status(200).json({
                        data : { token }
                    })

                } else {
                    res.status(403).json({message : `password anda salah`})
                }
            }else {
                res.status(403).json({message : `email anda salah`})
            }

        }).catch((error => {
            res.status(500).json({
                message : error.message || `internal server error`
            })
            next()
        }))
    }
}