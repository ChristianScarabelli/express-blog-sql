// importo l'array della risorsa post per farlo usare dalla funzione
const posts = require('../data/posts.js')

// funzione per verificare l'esistenza della risorsa tramite un id trasformato in numero
const validateResourceWithId = (req, res, next, id) => {
    const post = posts.find((post) => post.id === parseInt(id))

    if (post) {
        req.post = post
        next()
    } else {
        res.status(404).json({
            from: 'middleware param',
            error: 'Resource not found',
            message: 'Resource not found'
        })
    }
}

module.exports = validateResourceWithId