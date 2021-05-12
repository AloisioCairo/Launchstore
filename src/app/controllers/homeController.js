// Aula: Fase 4: Home page > Iniciando o HomeController
const { formatPrice } = require('../../lib/utils')
const Product = require('../models/Product')

module.exports = {
    async index(req, res) {
        let results = await Product.all()
        const products = results.rows

        if (!products)
            return res.send("Produtos não encontrato")

        // Retorna a imagem do produto
        async function getImage(productId) {
            let results = await Product.files(productId)
            const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            console.log('req.protocol_' + req.protocol)
            console.log('req.headers.host_' + req.headers.host)
            console.log('files_' + files[0])

            return files[0]
        }

        /*// Busca as imagens do produto
        results = await Product.files(products.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))*/

        // Essa const retorna um array
        const productsPromise = products.map(async product => {
            product.img = await getImage(product.id)
            product.oldPrice = formatPrice(product.old_price)
            product.price = formatPrice(product.price)

            return product
        }).filter((product, index) => index > 2 ? false : true) // Aula: Fase 4: Home page > Filtrando itens do array

        const lastAdded = await Promise.all(productsPromise)

        return res.render("home/index", { products: lastAdded })
    }
}