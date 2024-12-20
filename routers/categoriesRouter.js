const express = require('express')
const router = express.Router()
const categoriesController = require('../controllers/categoriesController.js')


router.get('/', categoriesController.index)

module.exports = router