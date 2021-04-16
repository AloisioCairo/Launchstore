// Fase 4: Controle da sessão de usuário > Bloqueio e redirecionamento de rotas > Bloqueio de rotas para usuário não cadastrado
// Verifica se o usuário está logado. Caso não, redireciona-o ele para a página de login
function onlyUsers(req, res, next) {
    if (!req.session.userId)
        return res.redirect('/users/login/')

    next()
}

// Fase 4: Controle da sessão de usuário > Bloqueio e redirecionamento de rotas > Redirecionamento de usuários cadastrados
// Verifica se o usuário está logado. Caso sim, redireciona-o para a página com os dados do cadastro
function isLoggedRedirectToUsers(req, res, next) {
    if (req.session.userId)
        return res.redirect('/users')

    next()
}


module.exports = {
    onlyUsers,
    isLoggedRedirectToUsers
}
