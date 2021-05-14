const Base = require('./Base')

Base.init({ table: 'users' })

module.exports = {
    ...Base, // Faz com que o objeto "users", herde tudo que tem no "Base"
}