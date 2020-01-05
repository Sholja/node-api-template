import { errors, logger, response as Response } from 'lib';
import constants from 'config/constants';

async function requestExecutor(req, responseMethod, handler) {
    const path = req.getPath();
    req.startHandlerTimer(`PATH_${path}`);

    const responseObject = {
        success: true,
        response: null
    };

    try {
        responseObject.response = await responseMethod(req, handler);
        // in case the response is object, we can proceed with attaching
        // additional properties such as reqId
        if (responseObject.response && responseObject.response instanceof Object) {
            responseObject.response.reqId = req.reqId;
        }
    } catch (err) {
        logger.error(`Unexpected error in requestExecutor`, err);
        err.user_token = req.user.xsrf;

        responseObject.success = false;
        if (err.response && err.response.statusCode === 403) {
            responseObject.response = Response.formatError(errors.generic(`Authorisation failed`, constants.errorCodes.FORBIDDEN));
        } else {
            responseObject.response = Response.formatError(errors.generic(`An unexpected error occurred`, constants.errorCodes.UNEXPECTED));
        }

        if (responseObject.response) {
            responseObject.response.reqId = req.reqId;
        }
        if (err.error) {
            responseObject.response = err.error;
        }
    }
    req.endHandlerTimer(`PATH_${path}`);
    return responseObject;
}

// eslint-disable-next-line import/prefer-default-export
export { requestExecutor };
