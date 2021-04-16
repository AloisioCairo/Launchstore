const crypto = require('crypto')
const User = require('../models/User')
const mailer = require('../../lib/mailer')
const { hash } = require('bcryptjs')

// Fase 4: Controle de sessão do usuário > Login logout > Logout do usuário
module.exports = {
    // Fase 4: Controle de sessão do usuário > Login logout > Form de login do usuário
    loginForm(req, res) {
        return res.render("session/login")
    },
    // Fase 4: Controle de sessão do usuário > Login logout > Lógica de login
    login(req, res) {
        req.session.userId = req.user.id

        return res.redirect("/users")
    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect("/") // Redireciona para a página inicial
    },
    // Fase 4: Controle de sessão do usuário > Recuperação de senha > Form de pedido de recuperação de senha
    forgotForm(req, res) {
        return res.render("session/forgot-password")
    },
    async forgot(req, res) {
        try {
            // Fase 4: Controle de sessão do usuário > Recuperação de senha > Chave criptografada para pedido de recuperação de senha
            const user = req.user

            // Cria o token para o usuário
            const token = crypto.randomBytes(20).toString("hex")

            // Cria a expiração do token
            let now = new Date()
            now = now.setHours(now.getHours + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            // Envia o e-mail com um link de recuperação de senha
            await mailer.sendMail({
                to: user.email,
                from: 'aloisiocairo@gmail.com',
                subject: 'Recuperação de senha',
                html: `<h2>Perdeu a chave?</h2>
            <p>Não se preoucupe. Clique no link abaixo para recuperar sua senha</p>
            <p>
                <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
                    RECUPERAR SENHA
                </a>
            </p>
            `,
            })

            // Avisa o usuário que enviou o e-mail
            return res.render("session/forgot-password", {
                success: "Verifique seu e-mail para resetar sua senha!"
            })

        } catch (err) {
            console.error('Erro ao tentar recuperar senha. Error: ' + err)

            return res.render("session/forgot-password", {
                error: "Erro ao tentar recuperar a senha. Favor tentar novamente."
            })
        }
    },
    // Fase 4: Controle de sessão do usuário > Recuperação de senha > Página de recuperação de senha
    resetForm(req, res) {
        return res.render('session/password-reset', { token: req.query.token })
    },
    // Fase 4: Controle de sessão do usuário > Recuperação de senha > Lógica de recuperação de senha
    async reset(req, res) {
        try {
            const user = req.user
            const { password, token } = req.body

            // Fase 4: Controle de sessão do usuário > Recuperação de senha > Criando nova senha
            // Cria um novo hash de senha
            const newPassword = await hash(password, 8) // 8 é a força do hash da senha

            // Atualiza o usuário
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: "",
            })

            // Avisa o usuário que ele tem uma nova senha
            return res.render("session/login", {
                user: req.body,
                success: "Senha atualizada. Faça o seu login."
            })


        } catch (err) {
            console.error('Erro ao tentar resetar a senha. Error: ' + err)

            return res.render("session/password-reset", {
                user: req.body,
                token,
                error: "Erro ao tentar resetar a senha. Favor tentar novamente."
            })
        }
    }
}