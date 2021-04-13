// Fase 4: Cadastrando Usuários > Máscaras e Validações > Organizando validações com validators
// Arquivo para armazenar todas as validações do usuário
const User = require('../models/User')


async function post(req, res, next) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "") {
            return res.render('user/register', {
                user: req.body,
                error: 'Por favor. Preencha todos os campos..'
            })
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
        return res.render('user/register', {
            user: req.body, // Fase 4: Cadastrando Usuários > Mensagens de alerta > Mensagens de erros aos usuários  | Faz com que os campos mantem-se preenchidos
            error: 'Usuário já cadastrado.'
        })

    // check if password match
    if (password != passwordRepeat)
        return res.render('user/register', {
            user: req.body,
            error: 'As senhas informadas estão diferentes.'
        })

    next()
}

module.exports = {
    post
}