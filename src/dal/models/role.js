import Sequelize from "sequelize";
import constants from 'config/constants';

class Role extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init({
            role_id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING
            },
            description: DataTypes.STRING,
            created_at: constants.sequelize.DATA_TYPES.TIMESTAMP,
            updated_at: constants.sequelize.DATA_TYPES.TIMESTAMP
        }, { sequelize });
    }
}

export default Role;
