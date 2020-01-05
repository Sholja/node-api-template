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
        return `/roles/:id`;
    }

    get authLevel() {
        return enums.authLevel.ADMIN_LOGIN;
    }
}

export default new Route();
