class ResponseSchema {
    constructor() {
        this.initialize();
    }

    /** Response validation schema */
    get responseTemplate() {
        return this._responseTemplate;
    }

    /** Initialize Schema */
    initialize() {
        this._responseTemplate = {
            type: `object`,
            properties: {
                success: {
                    type: `boolean`
                },
                info: {
                    type: `object`,
                    properties: {
                        code: {
                            type: `number`
                        },
                        message: {
                            type: `string`
                        }
                    },
                    required: [`code`, `message`]
                },
                errors: {
                    type: `array`,
                    items: {
                        type: `object`
                    }
                },
                data: {
                    type: `object`
                }
            },
            required: [`success`, `info`, `errors`, `data`]
        };
    }
}

const schema = new ResponseSchema();
export default schema;
