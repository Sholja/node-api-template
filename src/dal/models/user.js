import Sequelize from 'sequelize';
import constants from 'config/constants';
import {
    crypto
} from 'lib';

class User extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init({
            user_id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER
            },
            first_name: DataTypes.STRING,
            last_name: DataTypes.STRING,
            email: {
                allowNull: false,
                type: DataTypes.STRING
            },
            password: {
                allowNull: false,
                type: DataTypes.STRING,
                validate: {
                    len: [6, 15]
                },
                get() {
                    try {
                        const encryptedPassword = this.getDataValue(`password`);
                        if (encryptedPassword) {
                            return crypto.decrypt(encryptedPassword);
                        }

                        return null;
                    } catch (error) {
                        return null;
                    }
                },
                set(value) {
                    this.setDataValue(`password`, crypto.encrypt(String(value)));
                }
            },
            created_at: constants.sequelize.DATA_TYPES.TIMESTAMP,
            updated_at: constants.sequelize.DATA_TYPES.TIMESTAMP
        }, {
            sequelize
        });
    }
}

export default User;
