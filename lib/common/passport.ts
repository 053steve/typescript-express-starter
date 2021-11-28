import passport from 'passport';
import {db} from '../db';
import { Strategy } from 'passport-local';



passport.use('local', new Strategy({
  usernameField: 'username',
  passwordField: 'password',
}, async (username, password, done) => {
  
  try {
    
    const user: any = await db.User.findOne({ where: { username } });
    
    
    if (!user) {       
      return done(null, false, {message: 'Incorrect Username'}); 
    }
    
    try {
      const isMatch = await user.validatePassword(password);

      if (!isMatch) { return done(null, false, {message: 'Incorrect Password'}); }      

      done(null, user);
    } catch (err) {
      done(err);
    }
  } catch (err) {

    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // @ts-ignore
    const user = await db.User.findOne({ where: { id } , attributes: {exclude: ['password']}});
    done(null, user);
  } catch (err) {
    done(err);
  }
});
