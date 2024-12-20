const express = require('express')      // importo express
const router = express.Router()         // inizializzo la funzione router di express
const postController = require('../controllers/postController.js')      // importo le funzioni delle rotte
const validateResourceWithId = require('../middlewares/validateResource.js')    // importo il middleware di controllo quì nel router, dove verrà usato su tutte le rotte
const validateData = require('../middlewares/dataValidation.js')

// operazioni CRUD secondo convenzioni REST della risorsa posts
// a cui passo le funzioni controller della risorsa post
// PREFIX /posts

// utilizzo il middleware di controllo
router.use(validateResourceWithId)

// rotta Index => visualizzare tutti gli elementi
router.get('/', postController.index)

// rotta Show => visualizzare un elemento
router.get('/:id', postController.show)

// rotta Store => creare un nuovo elemento
router.post('/', validateData, postController.store)

// rotta Update => modificare interamente un elemento
router.put('/:id', validateData, postController.update)

// rotta Modify => modificare parzialmente un elemento   
router.patch('/:id', postController.modify)

// rotta Destroy => eliminare un elemento
router.delete('/:id', postController.destroy)

module.exports = router