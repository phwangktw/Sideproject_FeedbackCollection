const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

require('./models/User'); //User need to be loaded before passport using it
require('./services/passport');


mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());
app.use(
    cookieSession({
        maxAge: 30*24*60*60*1000,
        keys: [keys.cookieKey]
    })
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoute')(app);
require('./routes/billingRoutes')(app);

if (process.env.NODE_ENV === 'production'){
    // Exoress will serve up production assets
    // like our main.js and main.css (particular files)
    app.use(express.static('client/build'));

    // Express will serve up the index.html
    // if it doesn't recognize a particular route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
      });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);