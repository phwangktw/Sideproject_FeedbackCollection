const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

//Instance out User schema from User.js (already built)
const User = mongoose.model('User');

//Arrow function, as the argument to the original function
//user.id = OID in MongoDB
//more appropriate, since app. may have multiple auths (FB, Linkedin) 
passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
})

//passport handle genric authentication process
//but user need to specifiy how the auth is gonna execute
passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleCientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
    },
        async (accessToken, refreshToken, profile, done) => {
            const existingUser = await User.findOne({googleId: profile.id});
            if(existingUser){
                return done(null, existingUser);
            }
            
            const user = await new User({googleId: profile.id, Name: profile.displayName}).save();
            done(null, user);   
        }
    )     
        
);  //create a google strategy instance with constructor's configuration