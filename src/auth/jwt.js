import passport from 'passport-restify';
import { Strategy as jwt, ExtractJwt } from 'passport-jwt';

class JwtAuth {
    configure() {
        const passportOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme(`jwt`),
            secretOrKey: process.env.JWT_SECRET,
            algorithms: [`HS256`],
            passReqToCallback: true
        };

        // eslint-disable-next-line
        passport.use(new jwt(passportOptions, ((req, claims, done) => {
            // Set our user object for convinient use
            req.user = claims;

            return done(null, claims);
        })));
    }
}

export default new JwtAuth();
