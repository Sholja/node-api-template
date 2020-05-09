const ExecutorTemplate = () => {
    const create = () => `import {
    response as Response, logger, businessLogic as bl
} from 'lib';
    
class Executor {
    async execute(req) {
        try {
                return Response.format({ message: '' }, { valid: true });
            } catch (error) {
                const err = error && error.data ? error.data : error;
                logger.error('An error occurred.', err);
                return Response.formatError(err, req);
            }
        }
    }
    
export default new Executor();`;

    return Object.freeze({
        create
    });
};

module.exports = ExecutorTemplate;
