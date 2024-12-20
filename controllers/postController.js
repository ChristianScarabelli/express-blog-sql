const connection = require('../data/db.js')

const posts = require('../data/posts.js')    // richiamo l'array di oggetti della risorsa post quì dove si svolgono le funzioni
let lastIndex = posts.at(-1).id        // variabile globale che racchiude l'id dell'ultimo elemento dell'array posts

// funzione rotta Index => visualizzare tutti gli elementi
const index = (req, res) => {
    console.log('elenco dei post')

    // creo la query
    const sql = `SELECT * FROM posts`

    // uso la query con connection(connessione al db), con la funzione query(), 
    // che accetta la query creata e una callback per gestire risposta ed errore, ed eventuale parametro dinamico (come l'id)
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'database query failed' })   // si usa return oppure else if per le altre condizioni
        res.json(results)     // rispondo con un json che contiene l'elenco intero
    })

}

// funzione rotta show => visualizzare un elemento 
const show = (req, res) => {
    const param = req.params.id // salvo in una variabile il parametro, che può essere sia ID che slug

    console.log(`Ecco il post con parametro: ${param}`)

    let post      // inizializzo una variabile che cambierà e verrà ritornata in json in base alla ricerca

    const id = parseInt(param); // Converto il parametro in un numero

    if (!isNaN(id) && id > 0) {    // se il parametro scritto è un numero valido cerco per id
        post = posts.find((post) => post.id === id)  // cerco nell'array posts l'elemento post con ID uguale a quello della richiesta con query string
    } else {      // altrimenti cerco per lo slug inserito
        post = posts.find((post) => post.slug === param)
    }

    if (!post) { // Se il post non è stato trovato
        return res.status(404).json({
            error: 'Post not found',
            message: 'Il post non è stato trovato',
        })
    }

    res.json(post)    // ritorno un json con l'elemento post selezionato per id o per slug, altrimenti ritorno l'errore
}

// funzione rotta store => creare un nuovo elemento
const store = (req, res) => {
    const { title, author, content, image, tags, published } = req.body   // destrutturo in una variabile i dati in arrivo con la body request

    lastIndex++     // incremento l'id così al nuovo oggetto ne verrà assegnato uno in sequenza

    const newPost = {
        title,
        author,
        id: lastIndex,      // associo alla proprietà id il valore incrementato 
        content,
        image,
        published,
        tags
    }

    posts.push(newPost)     // aggiungo il nuovo post all'array principale
    res.status(201).json(newPost)       // invio status positivo e il nuovo post
    // console.log(newPost)
}

// funzione rotta update => modificare interamente un elemento
const update = (req, res) => {
    // res.send(`Modifico interamente il post con id: ${id}`)

    // validazione dati del body
    // update del post con i dati della body request
    const { title, author, content, image, tags } = req.body

    req.post.title = title   // se il parametro title esiste, il title del post sarà il title passato nella request
    req.post.author = author
    req.post.content = content
    req.post.image = image
    req.post.tags = tags

    res.json(req.post)      // rispondo con il json del nuovo post
}

// funzione rotta modify => modificare parzialmente un elemento
const modify = (req, res) => {
    // res.send(`Modifico parzialmente il post con id: ${id}`)


    // validazione dati del body
    // update del post con i dati della body request
    const { title, author, content, image, tags } = req.body

    if (title) req.post.title = title   // se il parametro title esiste, il title del post sarà il title passato nella request, perchè possono arrivare dati parziali e si corre il rischio di undefined
    if (author) req.post.author = author
    if (content) req.post.content = content
    if (image) req.post.image = image
    if (tags) req.post.tags = tags

    res.json(req.post)      // rispondo con il json del nuovo post
}

// funzione rotta destroy => eliminare un elemento
const destroy = (req, res) => {

    // recupero il parametro dal url
    const { id } = req.params

    // creo la query con il parametro ?, che verrà definito dopo, per evitare mysql injection
    const sql = `DELETE FROM posts WHERE id = ?`

    // uso la query 
    connection.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to delete post' })
        // rispondo con esito positivo ma senza contenuto
        res.sendStatus(204)
    })
}

module.exports = { index, show, store, update, modify, destroy }