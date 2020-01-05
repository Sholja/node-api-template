import jwtAuth from './jwt';

class MFA {
    configureJWT() {
        jwtAuth.configure();
    }
}

export default new MFA();
