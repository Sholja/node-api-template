class AuthValidator {
    constructor() {
        this.initialize();
    }

    get login() {
        return this._login;
    }

    get findByEmail() {
        return this._findByEmail;
    }

    initialize() {
        this._findByEmail = {
            type: `object`,
            properties: {
                user_id: { type: [`integer`] },
                email: { type: [`string`] },
                first_name: { type: [`string`] },
                last_name: { type: [`string`] },
                password: { type: [`string`] }
            },
            required: [
                `user_id`,
                `email`,
                `password`
            ]
        };
        this._login = {
            type: `object`,
            properties: {
                user_id: { type: [`integer`] },
                email: { type: [`string`] },
                first_name: { type: [`string`] },
                last_name: { type: [`string`] }
            },
            required: [
                `user_id`,
                `email`
            ]
        };
    }
}

export default AuthValidator;
