// Fase 4: Cadastrando Usuários > Registro de Usuários > Formulário de registro
const User = require('../models/User')
const { formatCpfCnpj, formatCep } = require('../../lib/utils')

module.exports = {
    registerForm(req, res) {
        return res.render("user/register")
    },
    // Fase 4: Constrole de sessão do usuário > Atualizando usuários > Criando formulário de atualização de usuário
    async show(req, res) {
        const { user } = req // Fase 4: Constrole de sessão do usuário > Atualizando usuários > Ajustando validação do usuário

        user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
        user.cep = formatCep(user.cep)

        return res.render('user/index', { user })
    },
    // Fase 4: Cadastrando Usuários > Máscaras e Validações > Query dinâmica para buscar usuários
    async post(req, res) {
        const userId = await User.create(req.body)

        req.session.userId = userId

        return res.redirect('/users')
    },
    // Fase 4: Controle de sessão do usuário > Atualizando usuários > Controller de atualização do usuário
    async update(req, res) {
        try {
            const { user } = req
            let { name, email, cpf_cnpj, cep, addres } = req.body

            cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
            cep = cep.replace(/\D/g, "")

            await User.update(user.id, {
                name,
                email,
                cpf_cnpj,
                cep,
                addres
            })

            return res.render("user/index", {
                user: req.body,
                success: "Conta atualizada com sucesso!"
            })



        } catch (err) {
            console.error('Erro ao atualizar o cadastro do usuário. Error: ' + err)
            return res.render("user/index", {
                error: "Algum erro aconteceu ao tentar atualizar o cadastro do usuário."
            })
        }
    },
    // Fase 4: Controle de sessão do usuário > Lógica avançada de exclusão > SQL cascade
    async delete(req, res) {
        try {
            await User.delete(req.body.id)
            req.session.destroy() // Destroi a seção do usuário

            return res.render("session/login", {
                success: "Conta deletada com sucesso."
            })
        } catch (err) {
            console.error('Houve um erro ao tentar deletar o cadastro do usuário. Erro: ' + err)
            return res.render("user/index", {
                user: req.body,
                error: "Erro ao tentar deletar sua conta de usuário."
            })
        }
    }

}