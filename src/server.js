import restify from 'restify';
import crypto from 'crypto';
import auth from 'auth';
import endpoints from 'endpoints';
import corsMiddleware from 'restify-cors-middleware';
import helper from 'lib/helper';
import logger from 'lib/logger';
import config from 'config';
import constants from 'config/constants';
import jwt from 'jsonwebtoken';
import ENV_CONFIG from './config/environment';

class Server {
    constructor() {
        this._runMigrationsAndSeeders();

        this._defaultVersion = `1.0.0`;
        this._server = restify.createServer({
            version: this._defaultVersion
        });

        auth.configureJWT();

        this.configureServer();

        endpoints.loadRoutes(this._server);
    }

    _buildSecretEnvs() {
        return ENV_CONFIG.map((variable) => {
            if (variable.secret) {
                return `${variable.name}="${process.env[variable.name].replace(`$`, `\\$`)}"`;
            }
            return null;
        })
            .filter(variable => !!variable)
            .join(` `);
    }

    async _runMigrationsAndSeeders() {
        const envSecrets = this._buildSecretEnvs();
        const commands = [`${envSecrets} npm run migrate`, `${envSecrets} npm run seed-prod`];
        if (process.env.NODE_ENV === `development`) {
            commands.push(`${envSecrets} npm run seed-dev`);
        }
        const error = await helper.series(commands);
        if (!error) {
            logger.info(`Migrations and seeds are completed`);
        } else {
            logger.error(error);
        }
    }

    configureServer() {
        this._server.use(restify.plugins.bodyParser());
        this._server.use(restify.plugins.queryParser());

        const cors = corsMiddleware({
            preflightMaxAge: 5,
            origins: [`*`],
            allowHeaders: constants.application.ALLOWED_HEADERS,
            exposeHeaders: constants.application.EXPOSED_HEADERS
        });

        this._server.use((req, res, next) => {
            res.header(`Access-Control-Allow-Origin`, `*`);
            res.header(`Content-Security-Policy`, `default-src 'self'`);
            res.header(`X-XSS-Protection`, `1; mode=block`);
            res.header(`Strict-Transport-Security`, `max-age=300`);
            return next();
        });

        this._server.pre(cors.preflight);

        // API Version
        this._server.pre((req, res, next) => {
            if (!req.headers[`x-api-version`]) {
                req.headers[`x-api-version`] = this._defaultVersion;
            }
            next();
        });

        const getAppLanguage = (req) => {
            const supportedLanguages = constants.supportedLanguages;
            const lang = req.headers.applanguage || config.application.defaultLanguage;

            if (supportedLanguages.has(lang)) {
                return lang;
            }

            return config.application.defaultLanguage;
        };

        this._server.pre((req, res, next) => {
            const requestId = req.headers[`request-id`] || crypto.randomBytes(10).toString(`hex`);
            req.headers.applanguage = getAppLanguage(req);
            try {
                req.reqId = requestId;
            } catch (error) {
                logger.error(`Request id could not be set. `, error);
            }

            let userData = {
                userId: null
            };

            if (
                req.headers
        && req.headers.authorization
        && req.headers.authorization.length > 4
        && req.headers.authorization.substr(0, 3).toLowerCase() === `jwt`
            ) {
                try {
                    userData = jwt.decode(req.headers.authorization.substr(4)) || {
                        userId: null
                    };
                } catch (e) {
                    logger.error(`Some error trying to grab token`, e);
                    userData = {
                        userId: null
                    };
                }
            }

            logger.info(`ROUTE`, {
                path: req.getPath(),
                reqId: req.reqId,
                method: req.method,
                client: req.headers[`x-forwarded-for`] || req.connection.remoteAddress,
                userId: userData.userId
            });
            next();
        });
    }

    async start() {
        this._server.on(`uncaughtException`, (req, res, route, err) => {
            logger.error({ err }, `An unexpected error occured`);

            res.send(err.code || 500, {
                success: false,
                info: {
                    code: err.code || 500,
                    message: err.status || err.message || err.description || `Internal Server Error`
                },
                errors: [],
                data: {
                    req_body: req.params
                }
            });
        });

        process.on(`uncaughtException`, (err) => {
            logger.error({ err }, `An unexpected error occured`);

            process.exit(1);
        });

        this._server.on(`after`, (req, res) => {
            try {
                const response_sample = res.statusCode == 200 ? `[DATA]` : JSON.stringify(res._data || `[NONE]`).slice(0, 1024);

                logger.info(`RESPONSE`, {
                    path: req.getPath(),
                    reqId: req.reqId,
                    method: req.method,
                    client: req.headers[`x-forwarded-for`] || req.connection.remoteAddress,
                    statusCode: res.statusCode,
                    response_sample,
                    userId: req.user ? req.user.userId : null
                });
            } catch (e) {
                logger.error(`Error in 'after' logger`, e);
            }
        });

        this._server.listen(process.env.PORT || 3000, () => {
            logger.info(`${this._server.name} listening at ${this._server.url}`);
        });
    }
}

const serverSingleton = new Server();
export default serverSingleton;
