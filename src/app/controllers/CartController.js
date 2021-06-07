// Fase 5: Funcionalidades Extras para a Launchsore > Estrutura HTML do carrinho
const Cart = require('../../lib/cart')
const LoadProductsService = require('../services/LoadProductService')

module.exports = {
    async index(req, res) {
        try {
            let { cart } = req.session

            // Gerenciador de carrinho
            cart = Cart.init(cart)

            return res.render("cart/index", { cart })

        } catch (error) {
            console.error('Houve um erro ao lista o carrinho. Erro: ' + error)
        }
    },
    // Fase 5: Funcionalidades Extras para a Launchsore > Utilizando funcionalidades de adicionar ao carrinho
    async addOne(req, res) {
        try {
            // Pegar o id do produto e o produto
            const { id } = req.params

            const product = await LoadProductsService.load('product', { where: { id } })

            // Pegar o carrinho
            let { cart } = req.session

            // Adicionar o produto ao carrinho (usando nosso gerenciador de carrinho)
            cart = Cart.init(cart).addOne(product)

            // Atualizar o carrinho da sessão
            req.session.cart = cart

            // Redirecionar o usuário para a tela do carrinho
            return res.redirect('/cart')

        } catch (error) {
            console.error('Houve um erro ao adicionar item ao carrinho. Erro: ' + error)
        }
    },
    // Fase 5: Funcionalidades Extras para a Launchsore > Utilizando funcionalidades de remover 1 item do carrinho
    async removeOne(req, res) {
        try {
            // Pegar o id do produto e o produto
            let { id } = req.params

            // Pegar o carrinho da sessão
            let { cart } = req.session

            // Se não tiver carrinho, retornar
            if (!cart)
                return res.redirect('/cart')

            // Iniciar o carrinho (gerenciador de carrinho) e remover
            cart = Cart.init(cart).removeOne(id)

            // Atualizar o carrinho da sessão, remover 1 item
            req.session.cart = cart

            // Redirecionar para a página cart
            return res.redirect('/cart')

        } catch (error) {
            console.error('Houve um erro ao remover item do carrinho. Erro: ' + error)
        }
    },
    // Fase 5: Funcionalidades Extras para a Launchsore > Carrinho vazio
    delete(req, res) {
        let { id } = req.params
        let { cart } = req.session

        if (!cart)
            return

        req.session.cart = Cart.init(cart).delete(id)

        return res.redirect('/cart')
    }
}