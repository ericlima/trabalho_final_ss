const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('layout', {
        title: 'Login',
        body: 'pages/login',
        error: '',
        user: req.session.user || null
    });
});

router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Página de recuperação de senha
router.get('/forgot', (req, res) => {
    res.render('layout', { 
        title: 'Esqueci minha senha', 
        body: 'pages/forgot', 
        error: '',
        user: req.session.user || null,
    });
});

// Processa o pedido de redefinição de senha
router.post('/forgot', authController.forgotPassword);

// Página de troca de senha
router.get('/password', (req, res) => {
    res.render('layout', {
        title: 'Troca de Password',
        body: 'pages/change_password',
        error: '',
        email: req.query.email || '',
        user: req.session.user || null,
    });
});

// Processa a troca de senha
router.post('/password', authController.changePassword);

module.exports = router;
