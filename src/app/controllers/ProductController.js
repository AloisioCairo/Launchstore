const { formatPrice, date } = require('../../lib/utils')
const { put } = require('../../routes')

const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

module.exports = {
    create(req, res) {
        // Aula: Fase 4: Launchstore - Cadastro de produts > Conhecendo promises

        // Buscar as categorias
        Category.all()
            .then(function (results) {
                const categories = results.rows

                return res.render("products/create.njk", { categories })
            }).catch(function (err) {
                throw new Error(err)
            })
    },
    async post(req, res) {
        // Aula: Fase 4: Launchstore - Cadastro de produts > Conhecendo async await

        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Por favor. Preencha todos os campos.')
            }
        }

        if (req.files.length == 0)
            return res.send('Por favor, informe ao menos uma imagem.')

        req.body.user_id = req.session.userId // Fase 4: Controle de sessão do usuário > Lógica avançada de exclusão > Verificando bugs e removendo usuários
        let results = await Product.create(req.body)
        const productId = results.rows[0].id

        // Aula: Upload de imagens > Salvando, atualizando e excluindo imagens > Array de promessas com Promisse.all()
        const filesPromise = req.files.map(file => File.create({ ...file, product_id: productId }))
        await Promise.all(filesPromise) // Espera que o arquivo com a imagem seja criado antes de prosseguir

        return res.redirect(`/products/${productId}/edit`)
    },
    async show(req, res) {
        // Aula: Fase 04 - Upload de imagens > Página de compra > Dados para apresentação de produtos
        let results = await Product.find(req.params.id)
        const product = results.rows[0]

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
        results = await Product.files(product.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("products/show", { product, files })
    },
    async edit(req, res) {
        let results = await Product.find(req.params.id)
        const product = results.rows[0]

        if (!Product)
            return res.send("Produto não encontrado.")

        product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price)

        // Buscar as categorias
        results = await Category.all()
        const categories = results.rows

        // Buscar as imagens do produto
        // Aula: Fase 4: Upload de imagens > Salvando, atualizando e excluindo imagens > Estruturando imagens para enviar ao Front end
        results = await Product.files(product.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("products/edit.njk", { product, categories, files })
    },
    async put(req, res) {
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
            req.body.old_price = oldProduct.rows[0].price
        }

        await Product.update(req.body)

        return res.redirect(`/products/${req.body.id}`)
    },
    async delete(req, res) {
        await Product.delete(req.body.id)

        return res.redirect('/products/create')
    }
}