
let lastIndex = posts.at(-1).id        // variabile globale che racchiude l'id dell'ultimo elemento dell'array posts

// funzione rotta Index => visualizzare tutti gli elementi
const index = (req, res) => {
    console.log('elenco dei post')

    let filteredPosts = posts

    // filtro i posts con il valore tag che viene passato in query string
    if (req.query.tags) {
        const queryTags = req.query.tags.toLowerCase().split(',')  // metto il valore in minuscolo e separato dagli altri elementi dell'array in una variabile
        filteredPosts = filteredPosts.filter(post =>    // verifico se almeno uno dei tag della query è presente nei tag del post
            post.tags.some(tag => queryTags.includes(tag.toLowerCase()))
        )
    }

    // limito i post da vedere in elenco
    const limit = parseInt(req.query.limit)  // inserisco in una variabile il valore della query limit e lo trasformo in un numero
    if (limit && !isNaN(limit) && limit >= 0) {  // se quel numero è compreso in elenco ed è >= 0, taglio l'array dei post dall'indice 0 al numero limi inserito in query string
        filteredPosts = filteredPosts.slice(0, limit)
    }

    // se il post non esiste (quindi l'elenco dopo i filtri è vuoto), ritorno l'errore
    if (filteredPosts.length === 0) {
        res.status(404).json({
            error: 'Post not found',
            message: 'Il post non è stato trovato'
        })
    }

    res.json(filteredPosts)     // rispondo con un json che contiene l'elenco intero, o se si entra nell'if, quello filtrato
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
    const param = req.params.id     // il parametro può essere un ID o uno slug
    const id = parseInt(param)      // converto il parametro in un numero e lo salvo nella variabile id

    let postIndex

    if (!isNaN(id) && id > 0) {     // se l'id è un numero valido e >0,  recupero nella variabile l'indice dell'id corrispondente al post
        postIndex = posts.findIndex((post) => post.id === id)
    } else {
        postIndex = posts.findIndex((post) => post.slug === param) // altrimenti guardo se il parametro inserito è === allo slug
    }

    // se l'indice non è compreso imposto l'errore
    if (postIndex === -1) {
        res.status(404)

        return res.json({
            error: 'Post not found',
            message: 'post selected not found',
        })
    }

    // rimuovo il post selezionato in base al parametro (id o slug)
    posts.splice(postIndex, 1)

    console.log(posts) // post rimanenti dopo l'eliminazione

    res.sendStatus(204) // rispondo con esito positivo ma senza contenuto
}

module.exports = { index, show, store, update, modify, destroy }