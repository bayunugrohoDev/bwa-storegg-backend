const Bank = require('./model')
module.exports = {
    index : async(req, res) => {
        try {
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')

            const alert = { message : alertMessage, status : alertStatus }
            const bank = await Bank.find();
            res.render('admin/bank/view_bank', 
            {
                bank,
                alert,
                name : req.session.user.name,
                title : 'Halaman Bank'
            })
        } catch(error) {
            req.flash('alertMessage', `${error}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },
    viewCreate : async(req, res) => {
        try {
            res.render('admin/bank/create', {
                name : req.session.user.name,
                title : 'Halaman Tambah Bank'
            })
        } catch (error) {
            console.log("error nya :")
            console.log(error)
        }
    },
    actionCreate : async(req, res) => {
        try {
            const { name, bankName, noRekening } = req.body 
            let bank = await Bank({name, bankName, noRekening})

            await bank.save()

            req.flash('alertMessage', 'berhasil tambah bank')
            req.flash('alertStatus', 'success')

            res.redirect('/bank')
        } catch (err) {
            req.flash('alertMessage', `${error}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },
    viewEdit : async(req, res) => {
        try {
            const { id } = req.params
            const bank = await Bank.findOne({_id : id})
            res.render('admin/bank/edit', {
                bank,
                name : req.session.user.name,
                title : 'Halaman Edit Bank'
            })
        } catch (error) {
            req.flash('alertMessage', `${error}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')         
        }
    },
    actionEdit : async(req, res) => {
        try {
            const { id } = req.params
            const { name, bankName, noRekening } = req.body 

            
            await Bank.findOneAndUpdate({
               _id:id 
            }, { name, bankName, noRekening })

            req.flash('alertMessage', 'berhasil ubah bank')
            req.flash('alertStatus', 'success')
            res.redirect('/bank')
        } catch (error) {
            req.flash('alertMessage', `${error}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },
    actionDelete : async(req, res) => {

        try {
            
            const { id } = req.params
            
            await Bank.findOneAndRemove({
                _id:id 
            });
            
            req.flash('alertMessage', 'berhasil hapus bank')
            req.flash('alertStatus', 'success')
            res.redirect('/bank')
        } catch (error) {
            req.flash('alertMessage', `${error}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
            
    }
}