import restify from 'restify-errors';
import constants from 'config/constants';

/**
 * A custom Error class
 * @class
 */
class Error extends restify.RestError {
    /**
     * Constructs the MyError class
     * @param {String} message an error message
     * @param {String} error code
     * @param {Array} list of all errors
     * @constructor
     */
    constructor(error) {
        super(error && error.message ? error.message : `Unknown Error`, {
            restCode: error.restCode || constants.errorCodes.GENERIC,
            statusCode: error.code || 400,
            message: error.message || `Unknown Error`,
            constructorOpt: Error
        });

        this.body.internalCode = error.internalCode || null;
        this.body.errorCode = error.code || 400;
    }
}

export default Error;
