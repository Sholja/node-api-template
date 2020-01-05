import {
    addPath
} from 'app-module-path';
import path from 'path';

addPath(path.join(__dirname, `../../../`));

const constants = require(`../../../config/sequelize-constants`);
const crypto = require(`../../../lib/crypto`);


module.exports = {
    up: queryInterface => queryInterface.bulkInsert(constants.TABLES.USERS,
        [{
            user_id: 1,
            first_name: `Eldin`,
            last_name: `Soljic`,
            email: `eldinsoljic@gmail.com`,
            password: crypto.default.encrypt(`MlIuuLjoc9sM3dmB7a2oab42fqNbEdio+E3qZO39OcU=`)
        }], {}),

    down: queryInterface => queryInterface.bulkDelete(constants.TABLES.USERS, null, {})
};
