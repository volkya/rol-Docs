const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs-extra');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const morgan = require('morgan');
const multer = require('multer');
const { session: sessionConfig } = require('./keys');

const app = express();
require('./database');
require('./config/passport');

const uploadsDir = path.join(__dirname, 'public/uploads');
fs.ensureDirSync(uploadsDir);

app.set('port', process.env.PORT || 2000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
}));
app.set('view engine', '.hbs');

app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
});
app.use(multer({ storage }).single('image'));

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

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
