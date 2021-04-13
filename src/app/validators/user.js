// Fase 4: Cadastrando Usuários > Máscaras e Validações > Organizando validações com validators
// Arquivo para armazenar todas as validações do usuário
const User = require('../models/User')


async function post(req, res, next) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "") {
            return res.send('Por favor. Preencha todos os campos.')
        }
    }

    // check if user exists [email, cpf_cnpj]
    let { email, cpf_cnpj, password, passwordRepeat } = req.body

    cpf_cnpj = cpf_cnpj.replace(/\D/g, "")

    const user = await User.findOne({
        where: { email },
        or: { cpf_cnpj }
    })

    if (user)
        return res.send('Usuário já cadastrado')

    // check if password match
    if (password != passwordRepeat)
        res.send('Password diferentes')

    next()
}

module.exports = {
    post
}