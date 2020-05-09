const RouteTemplate = () => {
    const create = () => `import BaseRoute from 'endpoints/base/base-route';
import enums from 'endpoints/enums';
    
class Route extends BaseRoute {
    constructor() {
        super(__dirname);
    }

    get httpMethod() {
        return enums.httpMethod.POST;
    }

    get path() {
        return '';
    }

    get authLevel() {
        return enums.authLevel.NO_SESSION;
    }
}

export default new Route();`;

    return Object.freeze({
        create
    });
};

module.exports = RouteTemplate;
