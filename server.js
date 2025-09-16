const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const authController = require('./controllers/auth.js');
const cardsController = require('./controllers/cards.js');

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev')); **************** Uncomment for logging
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView); // make user available in all views

// ROUTES:
app.get('/', (req, res) => {
    // checking if user is signed in
    if (req.session.user) {
        res.redirect(`/users/${req.session.user._id}/cards`); // redirect to user's cards page if so
    } else {
        res.render('index.ejs'); // otherwise render home page
    }
  });

app.use('/auth', authController);
app.use(isSignedIn); // protect all routes after this line
app.use('/users/:userId/cards', cardsController);







app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});