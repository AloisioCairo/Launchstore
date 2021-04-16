// Fase 4: Controle de sessão do usuário > Login logout > Lógica de login
const User = require('../models/User')
const { compare } = require('bcryptjs')

async function login(req, res, next) {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) return res.render("session/login", {
        error: "Usuário não cadastrado!"
    })

    // Descriptografa a senha
    const passed = await compare(password, user.password)

    if (!passed) return res.render("session/login", {
        user: req.body,
        error: "Senha incorreta."
    })

    req.user = user
    next()
}

// Fase 4: Controle de sessão do usuário > Recuperação de senha > Form de pedido de recuperação de senha > 
// Verifica se o e-mail informado está cadastro do banco de dados do sistema
async function forgot(req, res, next) {
    const { email } = req.body

    try {
        let user = await User.findOne({ where: { email } })

        if (!user) return res.render("session/forgot-password", {
            user: req.body,
            error: "E-mail não cadastrado."
        })

        req.user = user

        next()
    } catch (err) {
        console.error('Erro ao verificar se o e-mail informado está cadastrado no sistema. Erro: ' + err)
    }
}


//  Fase 4: Controle de sessão de usuário > Recuperação de senha > Validando a recuperação de senha
async function reset(req, res, next) {
    const { email, password, passwordRepeat, token } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) return res.render("session/password-reset", {
        token,
        error: "Usuário não cadastrado!"
    })

    // Verifica se as senhas informadas são iguais
    if (password != passwordRepeat) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'As senhas informadas estão diferentes.'
    })

    // Verifica se o token existe
    if (token != user.reset_token) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'Token inválido. Solicite uma nova recuperação de senha.'
    })

    // Verifica se o token não expirou
    let now = new Date()
    now = now.setHours(now.getHours())

    if (now > user.reset_token_expires) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'Token expirado. Por favor, solicite uma nova recuperação de senha.'
    })

    req.user = user

    next()
}

module.exports = {
    login,
    forgot,
    reset
}