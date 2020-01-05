import { requestExecutor } from 'lib/controller/helper';
import { logger, errors, response as Response } from 'lib';
import constants from 'config/constants';

export default class ExecutorWrapper {
    static async execute(req, res, next, cb) {
        try {
            const executionResult = await requestExecutor(req, cb);
            res.send(executionResult.response.info.code, executionResult.response);
            return next(executionResult.success);
        } catch (error) {
            logger.error(`Unexpected error in execution wrapper`, error);
            const errorResponse = Response.formatError(errors.generic(`An unexpected error occurred`, constants.errorCodes.UNEXPECTED));
            res.send(errorResponse.info.code, errorResponse);
            return next(errorResponse.success);
        }
    }
}
