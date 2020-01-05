export default class ExecutorRaw {
    static async execute(req, res, next, cb) {
        const executionResult = await cb(req);

        return res.json(executionResult.code, executionResult.data);
    }
}
