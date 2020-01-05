import winston from 'winston';

class Logger {
    constructor() {
        const customFormat = winston.format((info) => {
            if (info.stack) {
                info.message = `${info.stack}\n`;
                delete info.stack;
            }
            if (info.timestamp) {
                info.message = `${info.timestamp} ${info.message}`;
                delete info.timestamp;
            }
            return info;
        });

        this._logger = winston.createLogger({
            transports: [new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp(),
                    customFormat(),
                    winston.format.simple()
                )
            })]
        });

        this._logger.on(`error`, (err) => {
            console.log(err);
        });
    }

    _makeObject(_meta) {
        let useMeta = _meta;

        if (_meta === undefined) {
            useMeta = {};
        } else if (typeof _meta === `string`
            || typeof _meta === `number`
            || typeof _meta === `boolean`
            || _meta === null) {
            useMeta = {
                value: _meta
            };
        } else if (Array.isArray(_meta)) {
            useMeta = {
                value: JSON.stringify(_meta)
            };
        }
        return useMeta;
    }

    error(message, meta) {
        this._logger.log(`error`, message, this._makeObject(meta));
    }

    warn(message, meta) {
        this._logger.log(`warn`, message, this._makeObject(meta));
    }

    info(message, meta) {
        this._logger.log(`info`, message, this._makeObject(meta));
    }

    verbose(message, meta) {
        this._logger.log(`verbose`, message, this._makeObject(meta));
    }

    debug(message, meta) {
        this._logger.log(`debug`, message, this._makeObject(meta));
    }

    silly(message, meta) {
        this._logger.log(`silly`, message, this._makeObject(meta));
    }
}

export default new Logger();
