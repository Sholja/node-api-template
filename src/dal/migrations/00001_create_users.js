const constants = require(`../../config/sequelize-constants`);

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(constants.TABLES.USERS, {
        user_id: {
            field: constants.PRIMARY_KEYS.USERS,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        first_name: {
            type: Sequelize.STRING
        },
        last_name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        created_at: {
            type: constants.DATA_TYPES.TIMESTAMP,
            defaultValue: Sequelize.literal(constants.LITERALS.CURRENT_TIMESTAMP),
            allowNull: false
        },
        updated_at: {
            type: constants.DATA_TYPES.TIMESTAMP,
            defaultValue: Sequelize.literal(constants.LITERALS.CURRENT_TIMESTAMP),
            allowNull: false
        }
    }).then(() => queryInterface.sequelize
        .query(`ALTER TABLE \`${constants.TABLES.USERS}\` CONVERT TO CHARACTER SET \`utf8\` COLLATE \`utf8_unicode_ci\`;`)),
    down: queryInterface => queryInterface.dropTable(constants.TABLES.USERS)
};
