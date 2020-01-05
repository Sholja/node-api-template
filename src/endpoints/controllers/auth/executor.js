import {
    response as Response, logger, crypto, errors, validator
} from 'lib';
import constants from 'config/constants';
import DAL from 'dal';

class Executor {
    async execute(req) {
        try {
            const user = await DAL.user.findByEmail(req.body.email);
            if (!user || req.body.password !== crypto.decrypt(user.password)) {
                return Response.formatError(errors.generic(`Wrong email or password.`, constants.errorCodes.UNAUTHORIZED), validator.validate(validator.auth.findByEmail, user));
            }

            const roles = await DAL.role.findByUserId(user.user_id);
            user.roles = roles;
            delete user.password;
            const data = Response.formatLogin(req, user, { valid: true });
            return Response.format(data, validator.validate(validator.auth.login, data.data));
        } catch (error) {
            logger.error(`An error occured during login proccess`, error);
            return Response.formatError(error, req);
        }
    }
}

export default new Executor();
