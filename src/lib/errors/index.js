import _error from './error';
import _generic from './generic';

class Errors {
    error(message = `Unknown Error`) {
        return new _error(message);
    }

    generic(message = `Unknown Error`, errorCode = 500, errors = [], internalCode = null) {
        return new _generic(message, errorCode, errors, internalCode);
    }
}

const instance = new Errors();
export default instance;
