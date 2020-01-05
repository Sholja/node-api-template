const config = {
    username: process.env.DB_USERNAME || `root`,
    password: process.env.DB_PASSWORD || `root`,
    database: process.env.DB_DATABASE || `opex_dev`,
    host: process.env.DB_HOST || `localhost`,
    port: process.env.DB_PORT || `3306`,
    dialect: process.env.DB_CONNECTION || `mysql`,
    seederStorage: `sequelize`,
    logging: (str) => {
        if (process.env.DB_LOGGING) {
            console.log(str);
        }
    }
};

module.exports = {
    development: config,
    test: config,
    production: config
};
