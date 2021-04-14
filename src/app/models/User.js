const { create } = require('browser-sync')
const db = require('../../config/db')
const { hash } = require('bcryptjs') // Biblioteca para fazer o hash da senha
const { update } = require('../controllers/UserController')

module.exports = {
    // Fase 4: Cadastrando Usuários > Máscaras e Validações > Query dinâmica para buscar usuários
    async findOne(filters) {
        let query = "SELECT * FROM users"

        Object.keys(filters).map(key => {
            // WHERE | OR | AND

            query = `${query}
                ${key}
            `

            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key][field]}'`
            })
        })

        const results = await db.query(query)
        return results.rows[0]
    },
    async create(data) {
        try {
            const query = `INSERT INTO users (name, email, password, cpf_cnpj, cep, addres)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id`

            // Hash do password
            const passwordHash = await hash(data.password, 8)

            const values = [
                data.name,
                data.email,
                passwordHash,
                data.cpf_cnpj.replace(/\D/g, ""),
                data.cep.replace(/\D/g, ""),
                data.addres
            ]

            const results = await db.query(query, values)
            return results.rows[0].id
        } catch (err) {
            console.error('Erro ao tentar cadastrar um novo usuário. Erro: ' + err)
        }
    },
    // Fase 4: Controle de sessão de usuários > Atualizando usuários > Lógica do model de update de usuário
    async update(id, fields) {
        let query = "UPDATE users SET"

        Object.keys(fields).map((key, index, array) => {
            if ((index + 1) < array.length) {
                query = `${query}
                    ${key} = '${fields[key]}',
                `
            } else {
                query = `${query}
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}
                `
            }
        })

        await db.query(query)
        return
    }
}