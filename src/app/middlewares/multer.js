// Aula: Upload de imagens > Salvando, atualizando e excluindo imagens > Configurando upload com multer
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images') // Local que vai salvar as imagens
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now().toString()}-${file.originalname}`) // Nome do arquivo
    }
})

const fileFilter = (req, file, cb) => {
    const isAccepted = ['image/png', 'image/jpg', 'image/jpeg']
        .find(acceptedFormat => acceptedFormat == file.mimetype)

    if (isAccepted) {
        return cb(null, true);
    }

    return cb(null, false);
}

module.exports = multer({
    storage,
    fileFilter
})