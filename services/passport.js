const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');//one argument means getting the result

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser( (id, done) => {
    User.findById(id).
    then(user => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            //callbackURL: '/auth/google/callback'
            //callbackURL: 'https://bayou.herokuapp.com/auth/google/callback'
            callbackURL: '/auth/google/callback',
            proxy: true
        },
        (acessToken, refreshToken, profile, done) => {
            User.findOne({ googleID: profile.id }).
            then(
                (existingUser) => {
                    if(existingUser){
                        //Record already found.
                        done(null, existingUser);
                    } else {
                        //Record not found so will create new
                        new User({ googleID: profile.id }).
                        save().
                        then(
                            user => done(null, user)
                        );
                    }
                }
            );
            
            //console.log(`access token`, acessToken);
            //console.log(`refresh token`, refreshToken);
            //console.log(`profile:`, profile);
        }
    )
);