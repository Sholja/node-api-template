/* eslint-disable quote-props, quotes */
export default class Schema {
    static requestSchema() {
        return {
            "type": "object",
            "properties": {
                "params": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "integer"
                        }
                    }
                }
            },
            "required": [
                "params"
            ]
        };
    }
}
