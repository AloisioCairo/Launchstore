// Aula: Fase 4: Listando Produtos da Launchstore > Página de busca > SQL da página de busca
const { formatPrice } = require('../../lib/utils')
const Product = require('../models/Product')

module.exports = {
    async index(req, res) {
        try {
            let results,
                params = {}

            const { filter, category } = req.query

            if (!filter)
                return res.redirect("/")

            params.filter = filter

            if (category) {
                params.category = category
            }

            results = await Product.search(params)

            // Aula: Fase 4: Listando Produtos da Launchstore > Página de busca > SQL da página de busca. Minuto: 13:10 min
            // Retorna a imagem do produto
            async function getImage(productId) {
                let results = await Product.files(productId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

                return files[0]
            }

            // Essa const retorna um array
            const productsPromise = results.rows.map(async product => {
                product.img = await getImage(product.id)
                product.oldPrice = formatPrice(product.old_price)
                product.price = formatPrice(product.price)

                return product
            })

            const products = await Promise.all(productsPromise)

            const search = {
                term: req.query.filter,
                total: products.length // Retorna a quantidade total de produtos
            }

            // Aula: Fase 4: Listando Produtos da Launchstore > Página de busca > Organizando categorias e filtros
            const categories = products.map(product => ({
                id: product.category_id,
                name: product.category_name
            })).reduce((categoriesFiltered, category) => { // Aula: Fase 4: Listando Produtos da Launchstore > Página de busca > Organizando categorias e filtros. Minuto: 11:00 min
                const found = categoriesFiltered.some(cat => cat.id == category.id)

                if (!found)
                    categoriesFiltered.push(category)

                // Retorna um array de objetos de categorias
                return categoriesFiltered
            }, [])




            return res.render("search/index", { products, search, categories })
        } catch (error) {
            console.error('Erro ao listar os produtos. Erro: ' + error)
        }
    }
}