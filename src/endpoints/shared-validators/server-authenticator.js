import config from 'config';

class ServerAuthenticator {
    validate() {
        return async (req, res, next) => {
            const token = req.header(`Authorization`) ? req.header(`Authorization`).replace(`Bearer `, ``) : null;

            const respondBadRequest = () => {
                res.send(401, `Bad request`);
            };

            if (config.application.apiKey !== token) {
                respondBadRequest();
                return;
            }
            next();
        };
    }
}

export default ServerAuthenticator;
