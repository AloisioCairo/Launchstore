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
    }
}