const Base = require('./Base')

Base.init({ table: 'users' })

module.exports = {
    ...Base, // Faz com que o objeto "users", herde tudo que tem no "Base"
}

// async create(data) {
    //     try {
    //         const query = `INSERT INTO users (name, email, password, cpf_cnpj, cep, addres)
    //         VALUES ($1, $2, $3, $4, $5, $6)
    //         RETURNING id`

    //         // Hash do password
    //         const passwordHash = await hash(data.password, 8)

    //         const values = [
    //             data.name,
    //             data.email,
    //             passwordHash,
    //             data.cpf_cnpj.replace(/\D/g, ""),
    //             data.cep.replace(/\D/g, ""),
    //             data.addres
    //         ]

    //         const results = await db.query(query, values)
    //         return results.rows[0].id
    //     } catch (err) {
    //         console.error('Erro ao tentar cadastrar um novo usuário. Erro: ' + err)
    //     }
    // },
    // Fase 4: Controle de sessão de usuários > Atualizando usuários > Lógica do model de update de usuário
    // async update(id, fields) {
    //     let query = "UPDATE users SET"

    //     Object.keys(fields).map((key, index, array) => {
    //         if ((index + 1) < array.length) {
    //             query = `${query}
    //                 ${key} = '${fields[key]}',
    //             `
    //         } else {
    //             query = `${query}
    //                 ${key} = '${fields[key]}'
    //                 WHERE id = ${id}
    //             `
    //         }
    //     })

    //     await db.query(query)
    //     return
    // },
    // Fase 4: Controle de sessão do usuário > Lógica avançada de exclusão > SQL cascade
    // async delete(id) {
    //     let results = await db.query('SELECT * FROM products WHERE user_id = $1', [id])
    //     const products = results.rows

    //     // Pegar todas as imagens do produto
    //     const allFilesPromise = products.map(product =>
    //         Product.files(product.id))

    //     let promiseResults = await Promise.all(allFilesPromise)

    //     // Remove o usuário
    //     await db.query('DELETE FROM users WHERE id = $1', [id])

    //     // Remove as imagens dos produtos que estão na pasta "public/images"
    //     promiseResults.map(results => {
    //         results.rows.map(file => {
    //             try {
    //                 fs.unlinkSync(file.path)
    //             } catch (err) {
    //                 console.error('Não localizado nenhuma imagem do produto para ser excluída. ' + err)
    //             }
    //         })
    //     })
    // }