/* eslint-disable quote-props, quotes */
export default class Schema {
    static requestSchema() {
        return {
            "type": "object",
            "properties": {
                "body": {
                    "type": "object",
                    "properties": {
                        "email": {
                            "type": "string"
                        },
                        "password": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "email",
                        "password"
                    ]
                }
            },
            "required": [
                "body"
            ]
        };
    }
}
