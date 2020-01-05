/* eslint-disable global-require, import/no-dynamic-require */
import { isNullOrUndefined } from 'util';
import path from 'path';
import klawSync from 'klaw-sync';
import sharedValidators from 'endpoints/shared-validators';
import enums from 'endpoints/enums';

class RouteLoader {
    constructor() {
        this.configureMiddlewares = (route, filePath) => {
            const getAuthMw = cb => ({
                cb,
                type: enums.middlewareInfoType.AUTH
            });

            let authLevel = route.authLevel;
            if (Array.isArray(route.authLevel)) {
                authLevel = enums.authLevel.BY_ROLES;
            }

            switch (authLevel) {
            case enums.authLevel.NO_SESSION:
                route.middlewareCallbacks.unshift(getAuthMw((req, res, next) => {
                    sharedValidators.noSession(req, res, next);
                }));
                break;
            case enums.authLevel.ANY_LOGIN:
                route.middlewareCallbacks.unshift(getAuthMw((req, res, next) => {
                    sharedValidators.loginRequired(req, res, next);
                }));
                route.middlewareCallbacks.unshift(getAuthMw((req, res, next) => {
                    sharedValidators.jwt(req, res, next);
                }));
                break;
            case enums.authLevel.USER_LOGIN:
                route.middlewareCallbacks.unshift(getAuthMw((req, res, next) => {
                    sharedValidators.loginRequired(req, res, next);
                }));
                route.middlewareCallbacks.unshift(getAuthMw((req, res, next) => {
                    sharedValidators.jwt(req, res, next);
                }));
                break;
            case enums.authLevel.ADMIN_LOGIN:
                route.middlewareCallbacks.unshift(getAuthMw((req, res, next) => {
                    sharedValidators.loginRequired(req, res, next);
                }));
                route.middlewareCallbacks.unshift(getAuthMw((req, res, next) => {
                    sharedValidators.jwt(req, res, next);
                }));
                route.middlewareCallbacks.unshift(getAuthMw((req, res, next) => {
                    sharedValidators.isAdmin(req, res, next);
                }));
                break;
            case enums.authLevel.MANAGER_LOGIN:
                route.middlewareCallbacks.unshift(getAuthMw((req, res, next) => {
                    sharedValidators.loginRequired(req, res, next);
                }));
                route.middlewareCallbacks.unshift(getAuthMw((req, res, next) => {
                    sharedValidators.jwt(req, res, next);
                }));
                route.middlewareCallbacks.unshift(getAuthMw((req, res, next) => {
                    sharedValidators.isManager(req, res, next);
                }));
                break;
            case enums.authLevel.BY_ROLES:
                route.middlewareCallbacks.unshift(getAuthMw((req, res, next) => {
                    sharedValidators.loginRequired(req, res, next);
                }));
                route.middlewareCallbacks.unshift(getAuthMw((req, res, next) => {
                    sharedValidators.jwt(req, res, next);
                }));
                route.middlewareCallbacks.unshift(getAuthMw((req, res, next) => {
                    sharedValidators.hasRoles(req, res, next, route.authLevel);
                }));
                break;
            case enums.authLevel.SIGNAL_SERVER:
                route.middlewareCallbacks.unshift(getAuthMw((req, res, next) => {
                    sharedValidators.signalServerAuth(req, res, next);
                }));
                break;
            default:
                throw new Error(`AuthLevel not set for route: ${filePath}`);
            }
        };
    }

    load() {
        const basename = path.join(path.resolve(__dirname), `./controllers`);

        const paths = klawSync(basename, { noDir: true })
            .map(fileStats => fileStats.path)
            .filter(filePath => filePath.indexOf(`route.`) !== -1);

        const routes = [];
        paths.forEach((filePath) => {
            const route = require(filePath).default;

            if (isNullOrUndefined(route)) {
                throw new Error(`Route cannot be null/undefined: ${filePath}`);
            }

            if (route.overridenMiddlewares === false) {
                this.configureMiddlewares(route, filePath);
            }

            routes.push(route);
        });

        return routes.sort((x, y) => x.weight - y.weight);
    }
}

export default new RouteLoader();
