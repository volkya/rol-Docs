const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const { isAuthenticated, isGuest } = require('../helpers/auth');

router.get('/users/signin', isGuest, (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/files',
    failureRedirect: '/users/signin',
    failureFlash: true,
}));

router.get('/users/signup', isGuest, (req, res) => {
    res.render('users/signup', { title: 'Registro' });
});

router.post('/users/signup', async (req, res) => {
    const errors = [];
    const { username, email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        errors.push({ text: 'Las contraseñas no coinciden' });
    }
    if (password.length < 4) {
        errors.push({ text: 'La contraseña debe tener al menos 4 caracteres' });
    }
    if (errors.length > 0) {
        return res.render('users/signup', { errors, username, email });
    }

    const emailUser = await User.findOne({ email });
    if (emailUser) {
        req.flash('error_msg', 'El email ya está en uso');
        return res.redirect('/users/signup');
    }

    const newUser = new User({ username, email, password });
    newUser.password = await newUser.encryptPassword(password);
    await newUser.save();
    req.flash('success_msg', 'Registro exitoso. Ahora puedes iniciar sesión.');
    res.redirect('/users/signin');
});

router.get('/users/logout', isAuthenticated, (req, res) => {
    req.logout();
    req.flash('success_msg', 'Sesión cerrada');
    res.redirect('/');
});

module.exports = router;
