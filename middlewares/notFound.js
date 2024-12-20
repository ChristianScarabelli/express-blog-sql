// funzione/middleware per gestire l'errore di una rotta inesistente => pagina non trovata (404)
// non si usa err perchè per express non è un errore chiamare una rotta inesistente
// non si usa next perchè non vogliamo continuare dopo la funzione, ma generare l'errore

const notFound = (req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: 'Resource not found'
    })

}

module.exports = notFound