// Fase 4: Cadastrando Usuários > Registro de Usuários > Formulário de registro

const User = require('../models/User')

module.exports = {
    registerForm(req, res) {
        return res.render("user/register")
    },
    show(req, res) {
        return res.send('OK. Cadastrado.')

    },
    // Fase 4: Cadastrando Usuários > Máscaras e Validações > Query dinâmica para buscar usuários
    async post(req, res) {
        const userID = await User.create(req.body)

        return res.redirect('/users')
    }
}