import sequelize from './sequelize-constants';
import errorCodes from './error-codes';

const application = {
    DEFAULT_USER_ROLE_ID: 1,
    ALLOWED_HEADERS: [
        `applanguage`,
        `countryiso2code`,
        `deviceid`, `api-key`,
        `Origin`,
        `Accept`,
        `Accept-Version`,
        `Content-Length`,
        `Content-MD5`,
        `Content-Type`,
        `Date`,
        `X-Api-Version`,
        `X-Response-Time`,
        `X-PINGOTHER`,
        `X-CSRF-Token`,
        `Authorization`
    ],
    EXPOSED_HEADERS: [
        `X-Api-Version`,
        `X-Request-Id`,
        `X-Response-Time`
    ]
};

const roles = {
    ADMIN: `admin`,
    MANAGER: `manager`,
    USER: `user`
};

const supportedLanguages = new Set([`en`]);

export default {
    application,
    errorCodes,
    roles,
    sequelize,
    supportedLanguages
};
