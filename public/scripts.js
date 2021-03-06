/* Substituido pela função "Mask" abaixo

// Aula: Fase 4: Launchstore - Cadastro de produts > Substituindo texto com expressão regular
const input = document.querySelector('input[name="price"]')
input.addEventListener("keydow", function (e) {

    setTimeout(function () {
        let { value } = e.target

        value = value.replace(/\D/g, "")

        value = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL' //R$
        }).format(value / 100)

        e.target.value = value
    }, 1);
})*/


const Mask = {
    apply(input, func) {
        setTimeout(function () {
            input.value = Mask[func](input.value)
        }, 1);
    },
    formatBRL(value) {
        value = value.replace(/\D/g, "")

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL' //R$
        }).format(value / 100)
    },
    // Fase 4: Cadastrando Usuários > Máscaras e Validações > Máscara de CPF, CNPJ e CEP
    cpfCnpj(value) {
        value = value.replace(/\D/g, "")

        // Retira o último número caso tente digitar mais que 14 números
        if (value.length > 14)
            value = value.slice(0, -1)

        if (value.length > 11) { // CNPJ
            //11222333444455

            //11.222333444455
            value = value.replace(/(\d{2})(\d)/, "$1.$2")

            //11.222.333444455
            value = value.replace(/(\d{3})(\d)/, "$1.$2")

            //11.222.333/444455
            value = value.replace(/(\d{3})(\d)/, "$1/$2")

            //11.222.333/4444-55
            value = value.replace(/(\d{4})(\d)/, "$1-$2")
        } else { // CPF
            //111.22233344
            value = value.replace(/(\d{3})(\d)/, "$1.$2")

            //111.222.33344
            value = value.replace(/(\d{3})(\d)/, "$1.$2")

            //111.222.333-44
            value = value.replace(/(\d{3})(\d)/, "$1-$2")
        }

        return value
    },
    // Fase 4: Cadastrando Usuários > Máscaras e Validações > Máscara de CPF, CNPJ e CEP
    cep(value) {
        value = value.replace(/\D/g, "")

        // Retira o último número caso tente digitar mais que 8 números
        if (value.length > 8)
            value = value.slice(0, -1)

        value = value.replace(/(\d{5})(\d)/, "$1-$2")

        return value
    }
}


const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event))
            return

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${this.uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length
        if (totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos")
            event.preventDefault()

            return true
        }

        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode // <div class="photo">
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },
    // Aula: Fase 4: Upload de imagens > Salvando, atualizando e excluindo imagens > Lógica de exclusão de imagens vindas do Backend
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')

            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }
}

// Aula: Fase 04 - Upload de imagens - Galeria de imagens - Funcionalidade da galeria de imagem
const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')

        ImageGallery.highlight.src = target.src
        Lightbox.image.src = target.src
    }
}

// Aula: Fase 04 - Upload de imagens - Galeria de imagens - Javascript do Lightbox
const Lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.lightbox a.lightbox-close'),
    open() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.botton = 0
        Lightbox.closeButton.style.top = 0
    },
    close() {
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top = "-100%"
        Lightbox.target.style.botton = "initial"
        Lightbox.closeButton.style.top = "-80px"
    }
}

const Validate = {
    apply(input, func) {
        Validate.clearErrors(input)

        let results = Validate[func](input.value)
        input.value = results.value

        if (results.error)
            Validate.displayError(input, results.error)
    },
    displayError(input, error) {
        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)
        input.focus()
    },
    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector(".error")

        if (errorDiv)
            errorDiv.remove()
    },
    // Fase 4: Cadastrando Usuários > Máscaras e Validações > Estrutura de Validação de email
    isEmail(value) {
        let error = null

        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(mailFormat))
            error = "Email inválido"

        return {
            error,
            value
        }
    },
    isCpfCnpj(value) {
        let error = null

        const cleanValues = value.replace(/\D/g, "")

        if (cleanValues.length > 11 && cleanValues.length !== 14) {
            error = "CNPJ inválido"
        } else if (cleanValues.length < 11 && cleanValues.length !== 11) {
            error = "CPF inválido"
        }

        return {
            error,
            value
        }
    },
    isCep(value) {
        let error = null

        const cleanValues = value.replace(/\D/g, "")

        if (cleanValues.length !== 8) {
            error = "CEP inválido"
        }

        return {
            error,
            value
        }
    },
    // Fase 5: NodeJS Avançado > Validação Back e Front end dos Produtos
    allFields(e) {
        const items = document.querySelectorAll(' .item input, .item select, .item textarea')

        for (item of items) {
            if (item.value == "") {
                const message = document.createElement('div')
                message.classList.add('messages')
                message.classList.add('error')
                message.style.position = 'fixed'

                message.innerHTML = 'Todos os campos são obrigatórios.'
                document.querySelector('body').append(message)

                e.preventDefault()
            }

        }
    }
}