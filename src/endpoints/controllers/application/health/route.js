import BaseRoute from 'endpoints/base/base-route';
import enums from 'endpoints/enums';

class Route extends BaseRoute {
    constructor() {
        super(__dirname);
    }

    get httpMethod() {
        return enums.httpMethod.GET;
    }

    get path() {
        return `/application/health`;
    }

    get authLevel() {
        return enums.authLevel.NO_SESSION;
    }
}

export default new Route();
