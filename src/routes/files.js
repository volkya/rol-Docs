const express = require('express');
const router = express.Router();
const File = require('../models/file');
const upload = require('../config/multer');
const { isAuthenticated } = require('../helpers/auth');
const { uploadImage } = require('../helpers/upload');

router.use(isAuthenticated);

router.get('/', async (req, res) => {
    const files = await File.find().sort({ createdAt: -1 }).lean();
    res.render('files/all-files', { files });
});

router.get('/add', (req, res) => {
    res.render('files/new-file');
});

router.post('/add', upload.single('image'), async (req, res) => {
    const {
        name, edad, pb, empleo, grupo, raza, nacionalidad, orientacion,
        psicologia, fisico, historia, fuerza, destreza, agilidad,
        resistencia, inteligencia, percepcion,
    } = req.body;
    const errors = [];

    if (!name) errors.push({ text: 'Ingresa el nombre del personaje' });
    if (!historia) errors.push({ text: 'Ingresa la historia del personaje' });
    if (!fisico) errors.push({ text: 'Ingresa la descripción física' });
    if (!psicologia) errors.push({ text: 'Ingresa la descripción psicológica' });

    if (errors.length > 0) {
        return res.render('files/new-file', {
            errors, name, fisico, psicologia, historia,
            edad, pb, empleo, grupo, raza, nacionalidad, orientacion,
            fuerza, destreza, agilidad, resistencia, inteligencia, percepcion,
        });
    }

    try {
        const image = await uploadImage(req.file && req.file.path);
        const newFile = new File({
            name, historia, fisico, psicologia,
            edad, empleo, grupo, raza, nacionalidad, orientacion,
            fuerza, destreza, resistencia, inteligencia, percepcion, agilidad, pb,
            imageURL: image.url,
            public_id: image.public_id,
        });
        await newFile.save();
        req.flash('success_msg', 'Ficha creada correctamente');
        res.redirect('/files');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', err.message || 'Error al subir la imagen');
        res.redirect('/files/add');
    }
});

router.get('/edit/:id', async (req, res) => {
    const file = await File.findById(req.params.id).lean();
    if (!file) {
        req.flash('error_msg', 'Ficha no encontrada');
        return res.redirect('/files');
    }
    res.render('files/edit-file', { file });
});

router.put('/edit/:id', upload.single('image'), async (req, res) => {
    const {
        name, historia, fisico, psicologia,
        edad, empleo, grupo, raza, nacionalidad, orientacion, fuerza,
        destreza, resistencia, inteligencia, percepcion, agilidad, pb,
    } = req.body;

    const update = {
        name, historia, fisico, psicologia,
        edad, empleo, grupo, raza, nacionalidad, orientacion, fuerza,
        destreza, resistencia, inteligencia, percepcion, agilidad, pb,
    };

    try {
        if (req.file) {
            const image = await uploadImage(req.file.path);
            update.imageURL = image.url;
            update.public_id = image.public_id;
        }

        await File.findByIdAndUpdate(req.params.id, update);
        req.flash('success_msg', 'Ficha actualizada');
        res.redirect('/files');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', err.message || 'Error al subir la imagen');
        res.redirect(`/files/edit/${req.params.id}`);
    }
});

router.delete('/delete/:id', async (req, res) => {
    await File.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Ficha eliminada');
    res.redirect('/files');
});

module.exports = router;
