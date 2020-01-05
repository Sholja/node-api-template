import jwtRestify from 'passport-restify';
import constants from 'config/constants';
import loginRequiredValidator from './login-required';
import RoleAuthenticator from './role-authenticator';
import ServerAuthenticator from './server-authenticator';

class SharedValidators {
    get loginRequired() {
        return loginRequiredValidator.validate;
    }

    get jwt() {
        return jwtRestify.authenticate(`jwt`, {
            session: false
        });
    }

    get isAdmin() {
        return new RoleAuthenticator().validate(constants.roles.ADMIN);
    }

    get isUser() {
        return new RoleAuthenticator().validate(constants.roles.USER);
    }

    get isManager() {
        return new RoleAuthenticator().validate(constants.roles.MANAGER);
    }

    get signalServerAuth() {
        return new ServerAuthenticator().validate();
    }

    get hasRoles() {
        return new RoleAuthenticator().validateByRoles();
    }

    async noSession(req, res, next) {
        req.user = {
            noSession: true
        };
        next();
    }
}

export default new SharedValidators();
