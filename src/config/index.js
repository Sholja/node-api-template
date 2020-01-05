import dotenv from 'dotenv';
import path from 'path';
import logger from '../lib/logger';
import ENV_CONFIG from './environment';

class Config {
    constructor() {
        dotenv.config({
            path: path.normalize(`.env`)
        });

        this.configure();
    }

    async init() {
        this.validateEnv();
        this.configure();
    }

    configure() {
        this.configureRootPath();
        this.configureLocalEnv();
        this.configureEntries();
    }

    validateEnv() {
        let error_message = ``;
        let info_message = ``;
        ENV_CONFIG.forEach((variable) => {
            if (!(variable.name in process.env)) {
                if (variable.skip) {
                    info_message += `Skipping missed variable: ${variable.name} \n`;
                } else {
                    error_message += `Missing required variable: ${variable.name} \n`;
                }
            }
        });

        if (error_message.length > 0) {
            logger.error(error_message);
        }

        if (info_message.length > 0) {
            logger.info(info_message);
        }
    }

    /** Set the Root Directory */
    set root(val) {
        this._root = val;
    }

    /** Get the Root Directory */
    get root() {
        return this._root;
    }

    /** Set path to consistently get root folder. Use dotenv only if not in docker. */
    configureRootPath() {
        this.root = path.normalize(path.join(__dirname, `/../`));
    }

    /** Load local Env configuration (ENV variables). To be used to configure Dev, Staging, Production */
    configureLocalEnv() {
        if (!process.env.IS_DOCKER_ENV) {
            dotenv.config({
                path: path.normalize(path.join(this.root, `.env`))
            });
        }
    }

    /** Load all env variables */
    configureEntries() {
        this.application = {
            defaultLanguage: process.env.DEFAULT_LANGUAGE
        };

        this.DB = {
            database: process.env.DB_DATABASE,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: process.env.DB_CONNECTION || `mysql`,
            seederStorage: `sequelize`,
            dialectOptions: {
                charset: `utf8mb4`
            },
            logging: (str) => {
                if (process.env.DB_LOGGING) {
                    console.log(str);
                }
            }
        };

        this.redis = {
            package: process.env.REDIS_PACKAGE,
            url: process.env.REDIS_URL,
            port: process.env.REDIS_PORT
        };

        this.jwt = {
            secret: process.env.JWT_SECRET,
            exp: process.env.JWT_EXPIRATION,
            algorithm: process.env.JWT_ALGORITHM
        };

        this.crypto = {
            encryptionType: process.env.CRYPTO_ENCRYPTION_TYPE,
            decryptionType: process.env.CRYPTO_DECRYPTION_TYPE,
            keyType: process.env.CRYPTO_KEY_TYPE,
            ivType: process.env.CRYPTO_IV_TYPE,
            key: process.env.CRYPTO_KEY,
            iv: process.env.CRYPTO_IV
        };
    }
}

export default new Config();
