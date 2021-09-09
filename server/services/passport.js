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
        (accessToken, refreshToken, profile, done) => {
            User.findOne({googleId: profile.id})
                .then((existingUser)=>{
                    if(existingUser){
                        //true: we've already have that user in DB with given profile id; do nothing
                        done(null, existingUser);
                    }
                    else{
                        //we dont have this profile id now, so create it
                        console.log(profile);
                        new User({googleId: profile.id, Name: profile.displayName}) //<- this is Model Instance
                            .save()
                            .then(user =>{done(null, user) //<- an ANOTHER model instance (but it's same record, user return to serialize)
                            });
                        //async operation
                        //need to exactly check save process done then call done
                        //.then() will be called after save()
                    }
                })     
        })
);  //create a google strategy instance with constructor's configuration