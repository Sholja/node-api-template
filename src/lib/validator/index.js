import ajv from 'ajv';
import Auth from './response-validator/auth';
import Role from './response-validator/role';

class Validator {
    constructor() {
        this.initializeSchema();
        this.initializeValidator();
        this.initializeKeywords();
    }

    get auth() {
        return new Auth();
    }

    get role() {
        return new Role();
    }

    /** Defined schema */
    schema() {
        return this._schema;
    }

    /** Validate the object based on the provided schema
     * @param {JSON} schema - Schema to validate against
     * @param {object} object - The object to validate
     * @returns {boolean}
     */
    validate(schema, object) {
        try {
            return {
                valid: this._validator.validate(schema, object),
                error: this._validator.errors,
                message: this._validator.errorsText()
            };
        } catch (error) {
            return {
                valid: false,
                error: [{ dataPath: ``, message: `Unexpected validation error` }],
                message: `Unexpected validation error`
            };
        }
    }

    /** Initialize the validator */
    initializeValidator() {
        this._validator = new ajv({ coerceTypes: true, useDefaults: true });
    }

    initializeKeywords() {
        this._validator.addKeyword(`isNotEmpty`, {
            type: `string`,
            validate(schema, data) {
                return typeof data === `string` && data.trim() !== ``;
            },
            errors: false
        });
        this._validator.addKeyword(`integersCSV`, {
            type: `string`,
            validate(schema, data) {
                const csv = data ? data.split(`,`) : [];
                let isCsv = true;
                if (csv && csv.length) {
                    csv.forEach((c) => {
                        if (!Number.isInteger(Number(c))) {
                            isCsv = false;
                        }
                    });
                }
                return isCsv;
            },
            errors: false
        });
    }

    /** Initialize defined schema */
    initializeSchema() {
        this._schema = {
            response: require(`./schema/response`).default
        };
    }
}

export default new Validator();
