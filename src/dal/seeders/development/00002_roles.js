const constants = require(`../../../config/sequelize-constants`);

module.exports = {
    up: queryInterface => queryInterface.bulkInsert(constants.TABLES.ROLES,
        [{
            role_id: 1,
            name: `User`,
            description: `Default role of the app. With this role, user have an access to the client side of the app`
        }, {
            role_id: 2,
            name: `Manager`,
            description: `With this role, user is responsible for inviting new users.`
        }, {
            role_id: 3,
            name: `Admin`,
            description: `Owner of the platform, it can invite managers.`
        }], {}),

    down: queryInterface => queryInterface.bulkDelete(constants.TABLES.ROLES, null, {})
};
