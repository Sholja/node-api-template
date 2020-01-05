import path from 'path';
import fs from 'fs';
import { isNullOrUndefined } from 'util';
import ExecutorWrapper from 'endpoints/executor-wrapper';
import ExecutorRaw from 'endpoints/executor-raw';
import SchemaValidator from 'endpoints/shared-validators/schema-validator';
import enums from 'endpoints/enums';

class HandlerLoader {
    constructor() {
        this.handlerType = {
            SCHEMA_VALIDATOR: 0,
            VALIDATOR: 1,
            EXECUTOR: 2
        };
    }

    autoLoad(dirPath) {
        const handlerLoader = (routePath, filter) => {
            const files = fs.readdirSync(routePath)
                .filter(filePath => filePath.indexOf(filter) !== -1)
                .map(filePath => path.resolve(dirPath, filePath))
                .map(fullPath => require(fullPath).default);

            return files;
        };

        const getHandlers = (handlers, requiredFunc, handlerType) => {
            const results = [];
            for (let index = 0; index < handlers.length; index += 1) {
                const handler = handlers[index];
                if (isNullOrUndefined(handler) || isNullOrUndefined(handler[requiredFunc])) {
                    throw new Error(`Invalid handler, missing func: '${requiredFunc}'`);
                }

                switch (handlerType) {
                case this.handlerType.SCHEMA_VALIDATOR:
                    results.push({
                        weight: handler.weight || enums.middlewareDefaultWeights.SCHEMA_VALIDATOR,
                        cb: async (req, res, next) => {
                            const validator = new SchemaValidator(handler.weight);
                            await validator.validate(req, res, next, handler.requestSchema);
                        },
                        schemaRequest: handler.requestSchema,
                        type: enums.middlewareInfoType.SCHEMA_VALIDATOR
                    });
                    break;
                case this.handlerType.VALIDATOR:
                    results.push({
                        weight: handler.weight || enums.middlewareDefaultWeights.VALIDATOR,
                        cb: handler[requiredFunc],
                        type: enums.middlewareInfoType.VALIDATOR
                    });
                    break;
                case this.handlerType.EXECUTOR:
                    results.push({
                        weight: handler.weight || enums.middlewareDefaultWeights.EXECUTOR,
                        cb: (req, res, next) => {
                            switch (handler.responseFormatType) {
                            case enums.responseFormatType.RAW:
                                ExecutorRaw.execute(req, res, next, handler[requiredFunc]);
                                break;
                            case enums.responseFormatType.EXECUTOR_WRAPPER:
                            default:
                                ExecutorWrapper.execute(req, res, next, handler[requiredFunc]);
                                break;
                            }
                        },
                        type: enums.middlewareInfoType.EXECUTOR
                    });
                    break;
                default:
                    throw new Error(`Invalid handler type: '${this.handlerType}'`);
                }
            }

            return results;
        };

        const schemaValidators = getHandlers(handlerLoader(dirPath, `schema.`), `requestSchema`, this.handlerType.SCHEMA_VALIDATOR);
        const validators = getHandlers(handlerLoader(dirPath, `validator.`), `validate`, this.handlerType.VALIDATOR);
        const executors = getHandlers(handlerLoader(dirPath, `executor.`), `execute`, this.handlerType.EXECUTOR);

        const response = [
            ...schemaValidators,
            ...validators,
            ...executors
        ];

        return response
            .sort((x, y) => x.weight - y.weight);
    }

    manualLoad(dirPath, callbacks) {
        const result = [];
        for (let index = 0; index < callbacks.length; index += 1) {
            const cb = callbacks[index];
            switch (cb.name) {
            case `requestSchema`:
                result.push({
                    cb: async (req, res, next) => {
                        const validator = new SchemaValidator();
                        await validator.validate(req, res, next, cb);
                    },
                    schemaRequest: cb,
                    type: enums.middlewareInfoType.SCHEMA_VALIDATOR
                });
                break;
            case `execute`:
                result.push({
                    cb: async (req, res, next) => ExecutorWrapper.execute(req, res, next, cb),
                    type: enums.middlewareInfoType.EXECUTOR
                });
                break;
            case `executeClean`:
                result.push({
                    cb,
                    type: enums.middlewareInfoType.EXECUTOR
                });
                break;
            case `validate`:
            case `noSession`:
            case `authenticate`:
                result.push({
                    cb,
                    type: enums.middlewareInfoType.AUTH
                });
                break;
            default:
                throw new Error(`Unexpected middleware callback name: '${cb.name}', ${dirPath}.`);
            }
        }

        return result;
    }
}

export default new HandlerLoader();
