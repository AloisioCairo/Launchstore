// Fase 4: Controle da Sessão do Usuário > Atualizando Usuários > Express session
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const db = require('./db')

module.exports = session({
    store: new pgSession({
        pool: db // Banco de dados
    }),
    secret: 'iabadabadu',
    resave: false, // Se "True" sempre salva uma nova sessão quando a página for recarregada
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 100 // Tempo que a sessão fica ativa no bando de dados
    }
})