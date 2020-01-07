const constants = require(`../../../config/sequelize-constants`);

module.exports = {
    up: queryInterface => queryInterface.bulkInsert(constants.TABLES.USER_ROLES,
        [{
            user_roles_id: 1,
            role_id: 3,
            user_id: 1
        }], {}),

    down: queryInterface => queryInterface.bulkDelete(constants.TABLES.ROLES, null, {})
};
