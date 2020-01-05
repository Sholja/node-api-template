import jwt from 'jsonwebtoken';
import moment from 'moment';
import restify from 'restify';
import {
    errors,
    logger
} from 'lib';
import constants from 'config/constants';
import config from 'config';

class Response {
    static get template() {
        return {
            success: false,
            info: {
                code: 500,
                message: `Unexpected error`
            },
            errors: [],
            data: {}
        };
    }

    /** Get the base template */
    static get baseObject() {
        return Object.assign({}, Response.template);
    }

    /** General Format output
     * @param {JSON} input - User data
     * @param {object} validator - For getting validation message
     * @returns {JSON} a standardized response to the client.
     */
    format(input, validator, nullable = false) {
        if (!validator.valid) {
            return Response.formatError(errors.generic(validator.error[0].message, constants.errorCodes.UNPROCESSABLE_ENTITY));
        }

        const response = Response.baseObject;

        // No data received
        if (!input && !nullable) {
            response.info.code = 404;
            response.info.message = `Recourse not found.`;
            return response;
        }

        response.success = true;
        response.info.code = 200;
        response.info.message = ``;
        response.data = input;

        return response;
    }

    /** Format the response for a client error
     * @param {Error} error - a restify or any other error object
     * @returns {JSON} a standardized response to the client
     */
    static formatError(error, req) {
        const response = Response.baseObject;

        if (!error) {
            return response;
        }

        if (error.body && error.body.errors) {
            response.errors = error.body.errors;
        }

        if (error.body && error.body.errorCode) {
            response.info.errorCode = error.body.errorCode || 400;
        }

        // added so we can proxy the error codes from Apple/Google stores back to clients
        // during In-app purchase receipt validation, which is done on the backend
        if (error.body && error.body.storeErrorCode) {
            response.info.storeErrorCode = error.body.storeErrorCode;
        }

        if (error.body && error.body.storeErrorMessage) {
            response.info.storeErrorMessage = error.body.storeErrorMessage;
        }

        if (error.body && error.body.internalCode) {
            response.info.internalCode = error.body.internalCode;
        }

        if (req && req.reqId) {
            response.reqId = req.reqId;
        }

        response.info.code = error.statusCode || 400;
        response.info.message = error.message || `Unexpected error`;

        return response;
    }

    /** Format the response for a client error
     * @param {Error} error - a restify or any other error object
     * @returns {JSON} a standardized response to the client
     */
    formatError(error, req) { // Workaround! Module export class instance, not class itself, so we will call static method from public method with same signature.
        return Response.formatError(error, req);
    }

    formatLogin(req, user, validator) {
        if (!validator.valid) {
            logger.error({ req, validator }, `LOGIN ERROR`);
            return Response.formatError(new restify.errors.UnprocessableEntityError(`${validator.error[0].dataPath} ${validator.error[0].message}`));
        }

        const response = Response.baseObject;

        // The WS returned no data
        if (!user) {
            return response;
        }

        if (user && user.user_id) {
            response.success = true;
            response.info.code = 200;
            response.info.message = ``;
            response.data = user;
        } else {
            response.info.message = `Username or password mismatch`;
            response.info.code = 401;
        }

        // Calculate JWT
        this.calculateJwt(response);

        return response;
    }

    generateToken(response) {
        const data = {};

        data.token = jwt.sign(this.claims(response.data), config.jwt.secret, {
            algorithm: config.jwt.algorithm
        });

        return data;
    }

    calculateJwt(response) {
        if (response.info.code !== 200) {
            response.info.token = undefined;
            return;
        }

        const tokenData = this.generateToken(response);

        response.info.token = tokenData.token;
    }

    claims(data) {
        const claims = {
            userId: data.user_id,
            email: data.email,
            roles: data.roles
        };

        return claims;
    }
}

export default new Response();
