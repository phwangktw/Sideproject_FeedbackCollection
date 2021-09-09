const passport = require('passport');

module.exports = (app) => {
    //string google in authenticate can lead passport object know to use Google-Oauth2.0
    app.get('/auth/google', 
    passport.authenticate('google', {
    scope: ['profile', 'email']  //Google return user's info list 
    })
    );

    //callback (url: http://localhost:5000/auth/google/callback?code=xxxx )
    app.get('/auth/google/callback', 
    passport.authenticate('google')
    );

    app.get('/api/logout',(req, res)=> {
        req.logout();
        res.send(req.user);
    });

    app.get('/api/current_user', (req, res) => {
        res.send(req.user);
    });
};

