const Base = require('./Base')

Base.init({ table: 'files' })

module.exports = {
    ...Base,
    // Aula: Fase 4: Upload de imagens > Salvando, atualizando e excluindo imagens > Apresentando imagens no gerenciador de uploads
    // async delete(id) {
    //     try {
    //         const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
    //         const file = result.rows[0]

    //         // Remove a imagem/arquivo da pasta "public"
    //         fs.unlinkSync(file.path)

    //         return db.query(`DELETE FROM files WHERE id = $1`, [id])
    //     } catch (err) {
    //         console.error(err)
    //     }
    // },
}