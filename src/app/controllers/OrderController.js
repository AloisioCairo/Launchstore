// Fase 5: NodeJS Avançado > Pedido de compra
const LoadProductService = require('../services/LoadProductService')
const User = require('../models/User')
const Order = require('../models/Order')

const mailer = require('../../lib/mailer')
const Cart = require('../../lib/cart')
const { formatPrice, date } = require('../../lib/utils')

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
        // Pegar os pedidos do usuário
        let orders = await Order.findAll({ where: { buyer_id: req.session.userId } })

        const getOrdersPromise = orders.map(async order => {
            // Detalhes do produto
            order.product = await LoadProductService.load('product', {
                where: { id: order.product_id }
            })

            // Detalhes do comprador
            order.buyer = await User.findOne({
                where: { id: order.buyer_id }
            })

            // Detalhes do vendedor
            order.seller = await User.findOne({
                where: { id: order.seller_id }
            })

            // Formatação do preço
            order.formattedPrice = formatPrice(order.price)
            order.formattedTotal = formatPrice(order.total)

            // Formatação do status
            const statuses = {
                open: 'Aberto',
                sold: 'Vendido',
                canceled: 'Cancelado'
            }

            order.formattedStatus = statuses[order.status]

            // Formatação de atualizado em ...
            const updatedAt = date(order.updated_at)
            order.formattedUpdatedAt = `${order.formattedStatus} em ${updatedAt.day}/${updatedAt.month}/${updatedAt.year} às ${updatedAt.hour}h${updatedAt.minutes}`

            return order
        })

        orders = await Promise.all(getOrdersPromise)

        return res.render("orders/index", { orders })
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
    }
}