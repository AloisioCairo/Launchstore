const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverride = require('method-override')
const session = require('./config/session') // Fase 4: Controle da Sessão do Usuário > Atualizando Usuários > Express session

const server = express()

server.use(session) // Fase 4: Controle da Sessão do Usuário > Atualizando Usuários > Express session

/*  Fase 4: Controle de sessão de usuário > Bloqueio e redirecionamento de rotas > Variáveis globais com express e nunjucks
    Cria uma variável global para identificar quando o usuário está logado
*/
server.use((req, res, next) => {
    res.locals.session = req.session
    next()
})


server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))
server.use(methodOverride('_method'))
server.use(routes)

server.set("view engine", "njk")
nunjucks.configure("src/app/views", {
    express: server,
    autoescape: false,
    noCache: true
})

/*
server.use(function(req, res) {
    res.status(404).render("not-found");
});
*/

server.listen(5000, function () {
    console.log("Server is running")
})