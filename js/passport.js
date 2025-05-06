const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Usuario = require('../Graphql/model/usuarioModel');
require('dotenv').config();
const mongoose = require('mongoose');

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "/auth/google/callback" 
},
async function (accessToken, refreshToken, profile, done) {
  try {
    const existingUser = await Usuario.findOne({ googleId: profile.id });

    if (existingUser) {
      return done(null, existingUser);
    }

    const provisionalUser = {
      googleId: profile.id,
      nombre: profile.name.givenName,
      apellidos: profile.name.familyName,
      correos: profile.emails[0].value,
    };

    return done(null, provisionalUser);
  } catch (err) {
    return done(err);
  }
}));

// Serializar: guardamos el googleId si existe, si no el _id
passport.serializeUser((user, done) => {
  done(null, user.googleId || user._id.toString());
});

// Deserializar: detectamos si es un ObjectId o un googleId
passport.deserializeUser(async (id, done) => {
  try {
    let user;
    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await Usuario.findById(id);
    } else {
      user = await Usuario.findOne({ googleId: id });
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});
