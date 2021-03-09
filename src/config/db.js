/* Necessário para toda as vezes que for fazer uma conexão com o banco, não 
tenha a necessidade de informar o login e senha */
const { Pool } = require("pg")

module.exports = new Pool({
    user: "postgres",
    password: "postgres1004",
    host: "localhost",
    port: "5432",
    database: "launchstoredb"
})