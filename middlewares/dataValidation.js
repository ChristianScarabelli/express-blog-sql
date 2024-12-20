// middleware per errore di richiesta non valida ,con parametro request
const validateData = (req, res, next) => {
    const { title, author, content, tags } = req.body  // image

    let errors = []

    // se i vari parametri non esistono, sono diversi da stringhe, hanno spazio ai lati o  sono campi vuoti,
    // creo l'errore e lo pusho nell'array vuoto di errori
    if (!title || typeof title !== 'string') {
        errors.push('title is required')
    }

    if (!author || typeof author !== 'string') {
        errors.push('author is required')
    }

    if (!content || typeof content !== 'string') {
        errors.push('content is required')
    }

    // if (!image || typeof image !== 'string') {
    //     errors.push('image is required')
    // }

    // se l'array di tags non è un array
    // se ogni tag dell'array tags è diverso da stringa
    if (!tags || !Array.isArray(tags) || tags.length === 0 || !tags.every(tag => typeof tag === 'string')) {
        errors.push('tags are required');
    }

    if (errors.length > 0) {
        res.status(400).json({
            error: 'invalid request!',
            message: errors
        })
    }
    next()
}

module.exports = validateData