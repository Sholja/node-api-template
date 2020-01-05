import Error from './error';

/**
 * A custom Error class
 * @class
 */
class GenericError extends Error {
    /**
     * Constructs the MyError class
     * @param {String} message an error message
     * @param {String} error code
     * @param {Array} list of all errors
     * @constructor
     */
    constructor(message, code, internalCode = null) {
        super({
            statusCode: code || 400,
            message: message || `Unknown Error`,
            constructorOpt: GenericError
        });

        this.body.internalCode = internalCode;
        this.body.errorCode = code || 400;
    }
}

export default GenericError;
