const SchemaTemplate = () => {
    const create = () => `/* eslint-disable quote-props, quotes */
export default class Schema {
    static requestSchema() {
        return {
            "type": "object",
            "properties": {
                "body": {
                    "type": "object",
                    "properties": {
                    }
                }
            },
            "required": [
                "body"
            ]
        };
    }
}`;

    return Object.freeze({
        create
    });
};

module.exports = SchemaTemplate;
