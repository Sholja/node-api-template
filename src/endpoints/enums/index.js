import HttpMethods from './http-method';
import AuthLevel from './auth-level';
import MiddlewareDefaultWeights from './middleware-default-weights';
import ResponseFormatType from './response-format-type';
import MiddlewareInfoType from './middleware-info-type';

class Enums {
    get httpMethod() {
        return HttpMethods;
    }

    get authLevel() {
        return AuthLevel;
    }

    get middlewareDefaultWeights() {
        return MiddlewareDefaultWeights;
    }

    get responseFormatType() {
        return ResponseFormatType;
    }

    get middlewareInfoType() {
        return MiddlewareInfoType;
    }
}

export default new Enums();
