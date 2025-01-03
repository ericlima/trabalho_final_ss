const express = require('express');
const homeController = require('../controllers/homeController');

const router = express.Router();

// Página inicial
router.get('/', homeController.homePage);

// Página "Sobre"
router.get('/about', homeController.aboutPage);

router.get('/admin', homeController.adminPage);

module.exports = router;
