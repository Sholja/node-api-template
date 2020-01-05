class MiddlewareDefaultWeights {
    constructor() {
        this.SCHEMA_VALIDATOR = 100;
        this.VALIDATOR = 500;
        this.EXECUTOR = 1000;
    }
}

export default new MiddlewareDefaultWeights();
