// Fase 5: Funcionalidades Extras para a Launchsore > Estrutura HTML do carrinho
const Cart = require('../../lib/cart')
const LoadProductsService = require('../services/LoadProductService')

module.exports = {
    async index(req, res) {
        try {
            const product = await LoadProductsService.load('product', { where: { id: 1 } })
            let { cart } = req.session

            // Gerenciador de carrinho
            cart = Cart.init(cart).addOne(product)

            return res.render("cart/index", { cart })

        } catch (error) {
            console.error('Houve um erro ao lista os carrinhos. Erro: ' + error)
        }
    }
}