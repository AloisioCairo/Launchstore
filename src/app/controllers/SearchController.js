// Aula: Fase 4: Listando Produtos da Launchstore > Página de busca > SQL da página de busca
const Product = require('../models/Product')

const LoadProductService = require('../services/LoadProductService')

module.exports = {
    async index(req, res) {
        try {
            let { filter, category } = req.query

            if (!filter || filter.toLowerCase() == 'toda a loja')
                filter = null

            let products = await Product.search({ filter, category })

            // Fase 5: NodeJS Avançado > Utilizando o Serviço de Carregamento de Produtos
            const productsPromise = products.map(LoadProductService.format)

            products = await Promise.all(productsPromise)

            const search = {
                term: filter || 'Toda a loja',
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