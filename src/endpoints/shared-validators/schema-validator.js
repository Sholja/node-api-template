import { validator, response as Response, errors } from 'lib';
import constants from 'config/constants';

export default class SchemaValidator {
    async validate(req, res, next, getSchemaCb) {
        const result = validator.validate(getSchemaCb(req), req);

        if (!result.valid) {
            const response = Response.formatError(errors.generic(result.message, constants.errorCodes.UNPROCESSABLE_ENTITY));
            res.send(constants.errorCodes.UNPROCESSABLE_ENTITY, response);
            return next(false);
        }

        return next();
    }
}
