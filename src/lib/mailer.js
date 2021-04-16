// Fase 4: Controle de sessão do usuário > Recuperação de senha > Enviando e-mail com Nodemailer
const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "aaffb800e4b124",
        pass: "2d612f42a28bf0"
    }
});
