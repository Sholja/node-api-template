import DAL from 'dal';
import sql from '../sql';

class Role {
    async findById(roleId) {
        return DAL.execQuerySingle(sql.role.findById, [roleId]);
    }

    async findByUserId(userId) {
        return DAL.execQuery(sql.role.findByUserId, [userId]);
    }
}

export default new Role();
