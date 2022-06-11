const Category = require('./model')
module.exports = {
    index : async(req, res) => {
        try {
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')

            const alert = { message : alertMessage, status : alertStatus }
            const category = await Category.find();
            res.render('admin/category/view_category', {
                category, 
                alert,
                name: 
                req.session.user.name,
                title: 'Halaman Kategori'
            })
        } catch(error) {
            console.log(error)
            req.flash('alertMessage', `${error}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },
    viewCreate : async(req, res) => {
        try {
            res.render('admin/category/create', {
                name : req.session.user.name,
                title : 'Halaman Tambah Kategori'
            })
        } catch (error) {
            console.log(error)
        }
    },
    actionCreate : async(req, res) => {
        try {
            const { name } = req.body 
            let category = await Category({name})

            await category.save()

            req.flash('alertMessage', 'berhasil tambah category')
            req.flash('alertStatus', 'success')

            res.redirect('/category')
        } catch (err) {
            req.flash('alertMessage', `${error}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },
    viewEdit : async(req, res) => {
        try {
            const { id } = req.params
            const category = await Category.findOne({_id : id})
            res.render('admin/category/edit', {
                category,
                name : req.session.user.name,
                title : 'Halaman Ubah Kategori'
            })
        } catch (error) {
            req.flash('alertMessage', `${error}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')         
        }
    },
    actionEdit : async(req, res) => {
        try {
            const { id } = req.params
            const { name } = req.body
            
            await Category.findOneAndUpdate({
               _id:id 
            }, {name})

            req.flash('alertMessage', 'berhasil ubah category')
            req.flash('alertStatus', 'success')
            res.redirect('/category')
        } catch (error) {
            req.flash('alertMessage', `${error}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },
    actionDelete : async(req, res) => {

        try {
            
            const { id } = req.params
            
            await Category.findOneAndRemove({
                _id:id 
            });
            
            req.flash('alertMessage', 'berhasil hapus category')
            req.flash('alertStatus', 'success')
            res.redirect('/category')
        } catch (error) {
            req.flash('alertMessage', `${error}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
            
    }
}