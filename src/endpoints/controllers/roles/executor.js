import { response as Response, logger, validator } from 'lib';
import DAL from 'dal';

class Executor {
    async execute(req) {
        try {
            const data = await DAL.role.findById(req.params.id);
            return Response.format(data, validator.validate(validator.role.findById, data));
        } catch (error) {
            logger.error(`An error occured while fetching role.`, error);
            return Response.formatError(error, req);
        }
    }
}

export default new Executor();
