const Voucher = require('./model')
const Category = require("../category/model")
const Nominal = require("../nominal/model")
const path = require('path')
const fs = require('fs')
const config = require('../../config')
module.exports = {
    index: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')

            const alert = {
                message: alertMessage,
                status: alertStatus
            }
            const voucher = await Voucher.find().populate('category').populate('nominals');
            res.render('admin/voucher/view_voucher', {
                voucher,
                alert,
                name : req.session.user.name,
                title : 'Halaman Voucher'
            })
        } catch (error) {
            alert(error)
            req.flash('alertMessage', `${error}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
    viewCreate: async (req, res) => {
        try {
            const category = await Category.find()
            const nominals = await Nominal.find()
            res.render('admin/voucher/create', {
                category,
                nominals,
                name : req.session.user.name,
                title : 'Halaman Voucher'
            })
        } catch (error) {
            alert(error)
            req.flash('alertMessage', `${error}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
    actionCreate: async (req, res) => {
        try {
            const {
                name,
                category,
                nominals
            } = req.body

            if (req.file) {

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
                        const voucher = new Voucher({
                            name,
                            category,
                            nominals,
                            thumbnail: filename
                        })
                        await voucher.save();

                        req.flash('alertMessage', "Berhasil tambah voucher")
                        req.flash('alertStatus ', " success ")
                        res.redirect('/voucher', {
                            name : req.session.user.name,
                            title : 'Halaman Voucher'
                        })

                    } catch (err) {
                        req.flash('alertMessage', `${err}`)
                        req.flash('alertStatus', 'danger')
                        res.redirect('/voucher')
                    }
                })
            } else {


                const voucher = new Voucher({
                    name,
                    category,
                    nominals
                })
                await voucher.save();
                res.redirect('/voucher', {
                    name : req.session.user.name,
                    title : 'Halaman Voucher'
                })

            }

        } catch (err) {
            req.flash('alertMessage', `${err}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
    viewEdit : async(req, res) => {
        try {
            const { id } = req.params
            const category = await Category.find()
            const nominals = await Nominal.find()
            const voucher = await Voucher.findOne({_id : id}).populate('category').populate('nominals');
            res.render('admin/voucher/edit', {
                voucher,
                nominals,
                category,
                name : req.session.user.name,
                title : 'Halaman Edit Voucher'
            })
        } catch (error) {
            req.flash('alertMessage', `${error}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')         
        }
    },
    actionEdit : async(req, res) => {
        try {
            const { id } = req.params
            const {
                name,
                category,
                nominals
            } = req.body

            if (req.file) {

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

                        const voucher = await Voucher.findOne({_id: id})
                        let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
                        if(fs.existsSync(currentImage)) {
                            fs.unlinkSync(currentImage)
                        }

                        await Voucher.findOneAndUpdate({
                            _id : id
                        }, {
                            name,
                            category,
                            nominals,
                            thumbnail: filename
                        })

                        await voucher.save();

                        req.flash('alertMessage', "Berhasil ubah voucher")
                        req.flash('alertStatus ', " success ")
                        res.redirect('/voucher')

                    } catch (err) {
                        req.flash('alertMessage', `${err}`)
                        req.flash('alertStatus', 'danger')
                        res.redirect('/voucher')
                    }
                })
            } else {


               await Voucher.findOneAndUpdate({
                            _id : id
                        },{
                            name,
                            category,
                            nominals,
                })

                // await voucher.save();
                req.flash('alertMessage', "Berhasil ubah voucher")
                req.flash('alertStatus ', " success ")
                res.redirect('/voucher')

            }
        } catch (error) {
            req.flash('alertMessage', `${error}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },
    actionDelete : async(req, res) => {

        try {

            const { id } = req.params

           const voucher = await Voucher.findOneAndRemove({
                _id:id 
            });

            let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
            if(fs.existsSync(currentImage)) {
                fs.unlinkSync(currentImage)
            }

            req.flash('alertMessage', 'berhasil hapus voucher')
            req.flash('alertStatus', 'success')
            res.redirect('/voucher')
        } catch (error) {
            req.flash('alertMessage', `${error}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }

    },
    actionStatus : async(req, res) => {
        try {

            const { id } = req.params
            const voucher = await Voucher.findOne({_id : id})
            console.log(voucher.status+" apa ini")

             let status = voucher.status === "Y" ? "N" : "Y"
             console.log(status)
             await Voucher.findOneAndUpdate({
                _id : id
              },{status})

            req.flash('alertMessage', 'berhasil ubah status voucher')
            req.flash('alertStatus', 'success')
            res.redirect('/voucher')
        } catch (error) {
            req.flash('alertMessage', `${error}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    }
}