// Fase 4: Cadastrando Usuários > Registro de Usuários > Formulário de registro

const User = require('../models/User')

module.exports = {
    registerForm(req, res) {
        return res.render("user/register")
    },
    // Fase 4: Cadastrando Usuários > Máscaras e Validações > Query dinâmica para buscar usuários
    async post(req, res) {


        return res.send('Passou')
    }
}