import { response as Response } from 'lib';

class Executor {
    async execute() {
        return Response.format({ health: `OK` }, { valid: true });
    }
}

export default new Executor();
