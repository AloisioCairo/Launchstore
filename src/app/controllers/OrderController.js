// Fase 5: NodeJS Avançado > Pedido de compra
const LoadProductService = require('../services/LoadProductService')
const LoadOrderService = require('../services/LoadOrderService')
const User = require('../models/User')
const Order = require('../models/Order')

const mailer = require('../../lib/mailer')
const Cart = require('../../lib/cart')

const email = (seller, product, buyer) => `
<h2>Olá ${seller.name}</h2>
<p>Você tem um novo pedido de compra do seu produto</p>
<p>Produto: ${product.name}</p>
<p>Preço: ${product.formattedPrice}</p>
<p><br><br></p>
<h3>Dados do comprador</h3>
<p>${buyer.name}</p>
<p>${buyer.email}</p>
<p>${buyer.addres}</p>
<p>${buyer.cep}</p>
<p><br><br></p>
<p><strong>Entre em contato com o comprador para finalizar a venda!</strong></p>
<p><br><br></p>
<p>Atenciosamento, Equipe Launchstore</p>
`

module.exports = {
    async index(req, res) {
        const orders = await LoadOrderService.load('orders', {
            where: {
                buyer_id: req.session.userId
            }
        })

        return res.render("orders/index", { orders })
    },
    async sales(req, res) {
        const sales = await LoadOrderService.load('orders', {
            where: {
                seller_id: req.session.userId

            }
        })

        return res.render("orders/sales", { sales })
    },
    // Fase 5: Funcionalidades extra para a Launchstore > Minhas vendas e detalhes do pedido
    async show(req, res) {
        const order = await LoadOrderService.load('order', {
            where: { id: req.params.id }
        })

        return res.render("orders/details.njk", { order })
    },
    async post(req, res) {
        try {
            // Pegar os produtos do carrinho
            const cart = Cart.init(req.session.cart)

            const buyer_id = req.session.userId
            const filteredItems = cart.items.filter(item =>
                item.product.user_id = buyer_id
            )

            // Criar o pedido
            const createOrdersPromisse = filteredItems.map(async item => {
                let { product, price: total, quantity } = item
                const { price, id: product_id, user_id: seller_id } = product
                const status = "open"

                const order = await Order.create({
                    seller_id,
                    buyer_id,
                    product_id,
                    price,
                    total,
                    quantity,
                    status
                })

                // Produto
                product = await LoadProductService.load('product', {
                    where: {
                        id: product_id
                    }
                })

                // Vendedor
                const seller = await User.findOne({ where: { id: seller_id } })

                // Comprador
                const buyer = await User.findOne({ where: { id: buyer_id } })

                // Envia o email
                await mailer.sendMail({
                    to: seller.email,
                    from: 'no-reply@launchstore.com.br',
                    subject: 'Novo pedido de compra',
                    html: email(seller, product, buyer)
                })

                return order
            })

            await Promise.all(createOrdersPromisse)

            // Limpa o carrinho
            delete req.session.cart
            Cart.init()

            // Mensagem de sucesso da venda
            return res.render('orders/success')

        } catch (error) {
            console.error('Erro ao tentar realizar uma compra. Erro: ' + error)
            return res.render('orders/error')
        }
    },
    // Fase 5: Funcionalidades extra para a Launchstore > Mudar status do pedido
    async update(req, res) {
        try {
            const { id, action } = req.params

            const acceptedActions = ['close', 'cancel']

            if (!acceptedActions.includes(action))
                return res.send('Ação não localizada')

            // Pegar o pedido
            const order = await Order.findOne({
                where: { id }
            })

            if (!order)
                return res.send('Pedido não encontrado')


            // Verificar se o pedido está aberto
            if (order.status != 'open')
                return res.send('Ação não localizada')


            // Atualizar o pedido
            const statuses = {
                close: "sold",
                cancel: "canceled"
            }

            order.status = statuses[action]

            await Order.update(id, {
                status: order.status
            })

            return res.redirect('/orders/sales')
        } catch (error) {
            console.error('Ocorreu um erro ao tentar atualizar o status do pedido. Erro: ' + error)
        }
    }
}