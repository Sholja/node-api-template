import request from "request-promise";
import { errors } from "lib";
import constants from "config/constants";

class HttpRequest {
    async request(method, url, body, headers) {
        try {
            const payload = {
                json: true,
                uri: url,
                method
            };
            if (body) {
                payload.body = body;
            }
            if (headers) {
                payload.headers = headers;
            }
            const response = await request(payload);

            return response;
        } catch (data) {
            if (data.error) {
                return errors.generic(data.error.message, data.error.statusCode);
            }
            return errors.generic(data, constants.errorCodes.UNEXPECTED);
        }
    }
}

const singleton = new HttpRequest();
export default singleton;
