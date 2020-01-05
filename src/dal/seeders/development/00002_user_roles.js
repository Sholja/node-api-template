const constants = require(`../../../config/sequelize-constants`);

module.exports = {
    up: queryInterface => queryInterface.bulkInsert(constants.TABLES.USER_ROLES,
        [{
            role_id: 3,
            user_id: 1
        }], {}),

    down: queryInterface => queryInterface.bulkDelete(constants.TABLES.ROLES, null, {})
};
