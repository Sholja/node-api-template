const constants = require(`../../config/sequelize-constants`);

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable(constants.TABLES.USER_ROLES, {
        user_id: {
            type: Sequelize.INTEGER,
            onDelete: `CASCADE`,
            primaryKey: true,
            allowNull: false,
            references: {
                model: constants.TABLES.USERS,
                key: constants.PRIMARY_KEYS.USERS
            }
        },
        role_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: constants.TABLES.ROLES,
                key: constants.PRIMARY_KEYS.ROLES
            }
        },
        created_id: {
            type: constants.DATA_TYPES.TIMESTAMP,
            defaultValue: Sequelize.literal(constants.LITERALS.CURRENT_TIMESTAMP),
            allowNull: false
        },
        updated_id: {
            type: constants.DATA_TYPES.TIMESTAMP,
            defaultValue: Sequelize.literal(constants.LITERALS.CURRENT_TIMESTAMP),
            allowNull: false
        }
    }).then(() => queryInterface.sequelize
        .query(`ALTER TABLE \`${constants.TABLES.USER_ROLES}\` CONVERT TO CHARACTER SET \`utf8\` COLLATE \`utf8_unicode_ci\`;`)),
    down: queryInterface => queryInterface.dropTable(constants.TABLES.USER_ROLES)
};
