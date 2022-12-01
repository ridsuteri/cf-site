const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config()

passport.use(new GoogleStrategy({
    clientID: process.env.G_O_AUTH_ID,
    clientSecret: process.env.G_O_AUTH_SECRET,
    callbackURL: "http://localhost:8000/google/callback",
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

module.exports = passport;