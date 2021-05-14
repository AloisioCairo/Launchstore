const { unlinkSync } = require('fs')

const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

const { formatPrice, date } = require('../../lib/utils')

module.exports = {
    async create(req, res) {
        try {
            const categories = await Category.findAll()
            return res.render("products/create", { categories })
        } catch (error) {
            console.error(error);
        }
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send('Por favor. Preencha todos os campos.')
                }
            }

            let { category_id, name, description, old_price, price, quantity, status } = req.body

            price = price.replace(/\D/g, "")

            const product_id = await Product.create({
                category_id,
                user_id: req.session.userId,
                name,
                description,
                old_price: old_price || price,
                price,
                quantity,
                status: status || 1
            })

            if (req.files.length == 0)
                return res.send('Por favor, informe ao menos uma imagem.')

            // Aula: Upload de imagens > Salvando, atualizando e excluindo imagens > Array de promessas com Promisse.all()
            const filesPromise = req.files.map(file =>
                File.create({ name: file.filename, path: file.path, product_id }))

            await Promise.all(filesPromise) // Espera que o arquivo com a imagem seja criado antes de prosseguir

            return res.redirect(`/products/${product_id}/edit`)
        } catch (error) {
            console.error(error);
        }
    },
    async show(req, res) {
        try {
            let product = await Product.find(req.params.id)

            if (!product)
                return res.send("Produto não encontrado")

            const { day, hour, minutes, month } = date(product.updated_at)

            product.published = {
                day: `${day}/${month}`,
                hour: `${hour}h${minutes}`,
            }

            product.oldPrice = formatPrice(product.old_price)
            product.Price = formatPrice(product.price)

            // Busca as imagens do produto
            let files = await Product.files(product.id)
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            return res.render("products/show", { product, files })
        } catch (error) {
            console.error(error);
        }
    },
    async edit(req, res) {
        try {
            const product = await Product.find(req.params.id)

            if (!Product)
                return res.send("Produto não encontrado.")

            product.old_price = formatPrice(product.old_price)
            product.price = formatPrice(product.price)

            // Buscar as categorias
            const categories = await Category.findAll()

            // Buscar as imagens do produto
            // Aula: Fase 4: Upload de imagens > Salvando, atualizando e excluindo imagens > Estruturando imagens para enviar ao Front end
            let files = await Product.files(product.id)
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            return res.render("products/edit", { product, categories, files })
        } catch (error) {
            console.error(error);
        }
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == "" && key != "removed_files") {
                    return res.send('Por favor. Preencha todos os campos.')
                }
            }

            // Aula: Fase 4: Upload de imagens > Salvando, atualizando e excluindo imagens > Atualizando imagens no banco
            if (req.files.length != 0) {
                const newFilesPromisse = req.files.map(file =>
                    File.create({ ...file, product_id: req.body.id }))

                await Promise.all(newFilesPromisse)
            }

            // Aula: Fase 4: Upload de imagens > Salvando, atualizando e excluindo imagens > Lógica de exclusão de imagens vindas do Backend
            if (req.body.removed_files) {
                //1, 2, 3,
                const removedFiles = req.body.removed_files.split(",") // [1, 2, 3,]
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1) // [1, 2, 3]

                const removedFilesPromise = removedFiles.map(id => File.delete(id))

                await Promise.all(removedFilesPromise)
            }

            req.body.price = req.body.price.replace(/\D/g, "")

            if (req.body.old_price != req.body.price) {
                const oldProduct = await Product.find(req.body.id)
                req.body.old_price = oldProduct.price
            }

            await Product.update(req.body.id, {
                category_id: req.body.category_id,
                name: req.body.name,
                description: req.body.description,
                old_price: req.body.old_price,
                price: req.body.price,
                quantity: req.body.quantity,
                status: req.body.status,
            })

            return res.redirect(`/products/${req.body.id}`)
        } catch (error) {
            console.error(error);
        }
    },
    async delete(req, res) {
        const files = await Product.files(req.body.id)

        await Product.delete(req.body.id)

        files.map(file => {
            try {
                unlinkSync(file.path)
            } catch (error) {
                console.error(error)
            }
        })

        return res.redirect('/products/create')
    }
}