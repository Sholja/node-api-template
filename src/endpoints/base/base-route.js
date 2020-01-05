import { isNullOrUndefined } from 'util';
import handlerLoader from 'endpoints/handler-loader';
import enums from 'endpoints/enums';

export default class BaseRoute {
    constructor(dirPath) {
        if (new.target === BaseRoute) {
            throw new TypeError(`Cannot construct 'BaseRoute' instances directly`);
        }

        if (this.path === undefined) {
            throw new TypeError(`'${new.target.name}' must override 'path'`);
        }

        if (this.httpMethod === undefined) {
            throw new TypeError(`'${new.target.name}' must override 'httpMethod'`);
        }

        if (this.version === undefined) {
            this.version = `1.0.0`;
        }

        if (this.authLevel === undefined) {
            this.authLevel = enums.authLevel.USER_LOGIN;
        }

        if (this.weight === undefined) {
            this.weight = 10000;
        }

        // NOTE: loading validators and executors here
        this.overridenMiddlewares = !!this.middlewares;
        if (this.overridenMiddlewares === false) {
            this.middlewareCallbacks = handlerLoader.autoLoad(dirPath);
        } else {
            this.middlewareCallbacks = handlerLoader.manualLoad(dirPath, this.middlewares);
        }

        if (isNullOrUndefined(this.middlewareCallbacks)) {
            throw new TypeError(`'${new.target.name}' must override 'middlewareCallbacks'`);
        }
    }
}
