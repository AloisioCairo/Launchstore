// Fase 4: Cadastrando Usuários > Registro de Usuários > Formulário de registro
const { unlinkSync } = require('fs')
const { hash } = require('bcryptjs')

const User = require('../models/User')
const Product = require('../models/Product')

const { formatCpfCnpj, formatCep } = require('../../lib/utils')
const { Console } = require('console')

module.exports = {
    registerForm(req, res) {
        return res.render("user/register")
    },
    // Fase 4: Constrole de sessão do usuário > Atualizando usuários > Criando formulário de atualização de usuário
    async show(req, res) {
        try {
            const { user } = req // Fase 4: Constrole de sessão do usuário > Atualizando usuários > Ajustando validação do usuário

            user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
            user.cep = formatCep(user.cep)

            return res.render('user/index', { user })
        } catch (error) {
            console.error(error);
        }
    },
    // Fase 4: Cadastrando Usuários > Máscaras e Validações > Query dinâmica para buscar usuários
    async post(req, res) {
        try {
            let { name, email, password, cpf_cnpj, cep, addres } = req.body

            password = await hash(password, 8)
            cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
            cep = cep.replace(/\D/g, "")

            const userId = await User.create({
                name,
                email,
                password,
                cpf_cnpj,
                cep,
                addres
            })

            req.session.userId = userId // Cria/coloca o usuário na sessão

            return res.redirect('/users')
        } catch (error) {
            console.error(error);
        }
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
            const products = await Product.findAll({ where: { user_id: req.body.id } })

            // Pegar todas as imagens do produto
            const allFilesPromise = products.map(product =>
                Product.files(product.id))

            let promiseResults = await Promise.all(allFilesPromise)

            // Remove o usuário
            await User.delete(req.body.id)

            // Destroy a sessão do usuário
            req.session.destroy()

            // Remove as imagens dos produtos que estão na pasta "public/images"
            promiseResults.map(files => {
                files.map(file => {
                    try {
                        unlinkSync(file.path)
                    } catch (err) {
                        console.error('Não localizado nenhuma imagem do produto para ser excluída. ' + err)
                    }
                })
            })

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