class RoleValidator {
    constructor() {
        this.initialize();
    }

    get findById() {
        return this._findById;
    }

    initialize() {
        this._findById = {
            type: `object`,
            properties: {
                role_id: { type: [`integer`] },
                name: { type: [`string`] },
                descrpition: { type: [`string`] }
            },
            required: [
                `role_id`,
                `name`
            ]
        };
    }
}

export default RoleValidator;
