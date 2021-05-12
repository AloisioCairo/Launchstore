const Base = require('./Base')

Base.init({ table: 'products' })

module.exports = {
    ...Base,
    files(id) {
        return db.query(`SELECT * FROM files WHERE product_id = $1`, [id])
    },
    search(params) {
        // Aula: Fase 4: Listando Produtos da Launchstore > Página de busca > SQL da página de busca
        const { filter, category } = params

        let query = "",
            filterQuery = `WHERE`

        if (category) {
            filterQuery = `${filterQuery}
            products.category_id = ${category}
            AND`
        }

        filterQuery = `
            ${filterQuery}
            products.name ILIKE '%${filter}%'
            OR products.description ILIKE '%${filter}%'
        `

        query = `
            SELECT products.*, categories.name AS category_name
            FROM products
            LEFT JOIN categories ON (categories.id = products.category_id)
            ${filterQuery}
        `

        return db.query(query)
    }

    // create(data, callback) {
    //     const query = `INSERT INTO products (category_id, user_id, name, description, old_price, price, quantity, status)
    //         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    //         RETURNING id`

    //     // Remove a mascara de valor R$
    //     data.price = data.price.replace(/\D/g, "")

    //     const values = [
    //         data.category_id,
    //         data.userid,
    //         data.name,
    //         data.description,
    //         data.old_price || data.price,
    //         data.price,
    //         data.quantity,
    //         data.status || 1
    //     ]

    //     return db.query(query, values)
    // },
}