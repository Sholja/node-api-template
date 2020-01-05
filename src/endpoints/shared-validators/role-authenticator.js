import _ from 'lodash';
import config from 'config';
import jwt from 'jsonwebtoken';
import enums from 'endpoints/enums';
import constants from 'config/constants';

class RoleAuthenticator {
    validate(role) {
        return async (req, res, next) => {
            const token = req.header(`Authorization`) ? req.header(`Authorization`).replace(`JWT `, ``) : null;

            const respondBadRequest = () => {
                res.send(401, `Bad request`);
            };

            jwt.verify(token, config.jwt.secret, (err, decoded) => {
                if (err || !decoded || !decoded.roles) {
                    respondBadRequest();
                    return;
                }

                if (!RoleAuthenticator.listContains(role, `name`, decoded.roles)) {
                    respondBadRequest();
                    return;
                }

                next();
            });
        };
    }

    validateByRoles() {
        return async (req, res, next, loginTypes) => {
            const token = req.header(`Authorization`) ? req.header(`Authorization`).replace(`JWT `, ``) : null;

            const respondBadRequest = () => {
                res.send(401, `Bad request`);
            };

            jwt.verify(token, config.jwt.secret, (err, decoded) => {
                if (err || !decoded || !decoded.roles) {
                    respondBadRequest();
                    return;
                }

                let found = false;
                _.forEach(loginTypes, (type) => {
                    let role = ``;
                    switch (type) {
                    case enums.authLevel.USER_LOGIN:
                        role = constants.roles.USER;
                        break;
                    case enums.authLevel.MANAGER_LOGIN:
                        role = constants.roles.MANAGER;
                        break;
                    case enums.authLevel.ADMIN_LOGIN:
                        role = constants.roles.ADMIN;
                        break;
                    default:
                        break;
                    }
                    if (RoleAuthenticator.listContains(role, `name`, decoded.roles)) {
                        found = true;
                    }
                });

                if (!found) {
                    respondBadRequest();
                    return;
                }

                next();
            });
        };
    }

    static listContains(item, key, list) {
        let found = false;
        _.forEach(list, (part) => {
            if (part[key].toLowerCase() === item.toLowerCase()) {
                found = true;
            }
        });

        return found;
    }
}

export default RoleAuthenticator;
