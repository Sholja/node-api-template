const constants = require(`../../config/sequelize-constants`);

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(constants.TABLES.ROLES, {
        role_id: {
            field: constants.PRIMARY_KEYS.ROLES,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING(500)
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
        .query(`ALTER TABLE \`${constants.TABLES.ROLES}\` CONVERT TO CHARACTER SET \`utf8\` COLLATE \`utf8_unicode_ci\`;`)),
    down: queryInterface => queryInterface.dropTable(constants.TABLES.ROLES)
};
