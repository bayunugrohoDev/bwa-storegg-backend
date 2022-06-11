const User = require('./model')
const bcrypt = require('bcryptjs')

module.exports = {
    viewSignIn : async(req, res) => {
        const alertMessage = req.flash('alertMessage')
        const alertStatus = req.flash('alertStatus')
        try {

            const alert = { message : alertMessage, status : alertStatus }

            if(req.session.user === null || req.session.user === undefined ) {
                console.log("hjal")
                res.render('admin/user/view_signin', { alert,
                    title : 'Halaman SignIn'})
            } else {
                res.redirect('/dashboard')
            }

        } catch(error) {
            const alert = { message : alertMessage, status : alertStatus }

            console.log("errorkah")
            req.flash('alertMessage', `${error}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/')
            // res.render('admin/user/view_signin', { alert,
            //     title : 'Halaman SignIn'})
        }
    },
    actionSignIn : async(req, res) => { 
        try {

            const {email, password } =  req.body
            console.log(email)
            const check = await User.findOne({ email : email})
            console.log(check)
            console.log(check)
            if(check) {
                if(check.status === 'Y') {
                    const checkPassword = await bcrypt.compare(password, check.password)
                    if(checkPassword) {
                        req.session.user = {
                            id : check._id,
                            status : check.status,
                            name : check.name
                        }
                        res.redirect('/dashboard')
                    } else {
                        req.flash('alertMessage', `kata sandi salah`)
                        req.flash('alertStatus', 'danger')
                        res.redirect('/')
                    }
                } else {
                    req.flash('alertMessage', `maaf user tidak aktif`)
                    req.flash('alertStatus', 'danger')
                    res.redirect('/')
                }
            }else {
                req.flash('alertMessage', `email yang anda inputkan tidak ada`)
                req.flash('alertStatus', 'danger')
                res.redirect('/')
            }
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')

            const alert = { message : alertMessage, status : alertStatus }
            res.render('admin/user/view_signin', { alert})
        } catch(error) {
            req.flash('alertMessage', `${error}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/usr')
        }
    },
    actionLogout : (req, res) => {
        req.session.destroy()
        res.redirect('/')
    }
}