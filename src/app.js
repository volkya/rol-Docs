const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs-extra');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const morgan = require('morgan');

const app = express();
require('./database');
require('./config/passport');

const { session: sessionConfig } = require('./keys');

app.set('port', process.env.PORT || 2000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: {
        isAuth: (user) => Boolean(user),
    },
}));
app.set('view engine', '.hbs');

app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, 'public/uploads');
fs.ensureDirSync(uploadsDir);

app.use(methodOverride('_method'));
app.use(session({
    secret: sessionConfig.secret,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use(require('./routes/users'));
app.use('/files', require('./routes/files'));

app.use((err, req, res, next) => {
    if (err.message === 'Solo se permiten imágenes' || err.code === 'LIMIT_FILE_SIZE') {
        req.flash('error_msg', err.message === 'Solo se permiten imágenes'
            ? err.message
            : 'La imagen no puede superar 5 MB');
        return res.redirect(req.headers.referer || '/files/add');
    }
    next(err);
});

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
